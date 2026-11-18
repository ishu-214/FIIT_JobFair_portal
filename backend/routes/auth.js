const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fiit_secret_key', {
    expiresIn: '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new student with ONLY name, email, password
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'student',
      attemptNumber: 1,
      currentRound: 1,
      hasReadInstructions: false,
      isProfileCompleted: false,
      status: 'instructions_pending'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasReadInstructions: user.hasReadInstructions,
        isProfileCompleted: user.isProfileCompleted,
        attemptNumber: user.attemptNumber,
        currentRound: user.currentRound,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate candidate or recruiter admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        yearOfStudy: user.yearOfStudy,
        department: user.department,
        specialization: user.specialization,
        collegeName: user.collegeName,
        interestedRole: user.interestedRole,
        hasReadInstructions: user.hasReadInstructions,
        isProfileCompleted: user.isProfileCompleted,
        round1Started: user.round1Started,
        reEntryBlocked: user.reEntryBlocked,
        blockReason: user.blockReason,
        attemptNumber: user.attemptNumber,
        currentRound: user.currentRound,
        status: user.status,
        round1: user.round1,
        round2: user.round2,
        round3: user.round3,
        disqualified: user.disqualified,
        violationCount: user.violationCount,
        history: user.history
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// @route   POST /api/auth/acknowledge-instructions
// @desc    Candidate acknowledges assessment instructions
router.post('/acknowledge-instructions', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.hasReadInstructions = true;
    if (!user.isProfileCompleted) {
      user.status = 'profile_pending';
    }
    await user.save();

    res.json({
      success: true,
      message: 'Instructions acknowledged',
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to acknowledge instructions' });
  }
});

// @route   POST /api/auth/update-profile
// @desc    Mandatory profile update page. Disallows changing email & password.
router.post('/update-profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const {
      name,
      phoneNumber,
      degree,
      yearOfStudy,
      department,
      specialization,
      collegeName,
      interestedRole
    } = req.body;

    // Validate ALL mandatory fields
    if (
      !name ||
      !phoneNumber ||
      !degree ||
      !collegeName ||
      !department ||
      !yearOfStudy ||
      !interestedRole
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are mandatory: Name, Phone, Degree, Branch, Year of Study, College, and Interested Role.'
      });
    }

    const cleanPhone = phoneNumber.trim();
    if (!/^[1-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Must be exactly 10 digits, contain only numbers, and cannot start with 0.'
      });
    }

    user.name = name.trim();
    user.phoneNumber = cleanPhone;
    user.degree = degree.trim();
    user.yearOfStudy = yearOfStudy.trim();
    user.department = department.trim();
    user.specialization = (specialization || department).trim();
    user.collegeName = collegeName.trim();
    user.interestedRole = interestedRole;
    user.isProfileCompleted = true;

    if (user.status === 'profile_pending' || user.status === 'instructions_pending') {
      user.status = 'ready_for_round1';
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
});

// @route   POST /api/auth/start-round
// @desc    Marks Round 1, 2, or 3 started. Enforces strict re-entry restriction by email.
router.post('/start-round', protect, async (req, res) => {
  try {
    const round = Number(req.body.round) || 1;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.disqualified) {
      return res.status(403).json({
        success: false,
        disqualified: true,
        message: `Account disqualified due to anti-cheat violations.`
      });
    }

    if (user.reEntryBlocked) {
      return res.status(403).json({
        success: false,
        reEntryBlocked: true,
        message: `Assessment re-entry blocked for ${user.email}. Retaking is not permitted without Admin clearance.`
      });
    }

    const startedField = `round${round}Started`;
    const startedAtField = `round${round}StartedAt`;
    const roundObj = user[`round${round}`];

    if (user[startedField] && !roundObj?.completedAt) {
      // User previously initiated this round and exited/reloaded
      user.reEntryBlocked = true;
      user.blockReason = `Attempted re-entry to Round ${round} after abandoning initiated assessment`;
      await user.save();

      return res.status(403).json({
        success: false,
        reEntryBlocked: true,
        message: `Assessment re-entry blocked for ${user.email}. You already started Round ${round}. Leaving midway locks your test.`
      });
    }

    user[startedField] = true;
    user[startedAtField] = new Date();
    user.currentRound = round;
    user.status = `round${round}_in_progress`;
    await user.save();

    res.json({
      success: true,
      message: `Round ${round} initiated`,
      user
    });
  } catch (error) {
    console.error('Start round error:', error);
    res.status(500).json({ success: false, message: 'Error initiating round' });
  }
});

// Backward compatibility alias for Round 1
router.post('/start-round1', protect, async (req, res) => {
  req.body.round = 1;
  return router.handle(req, res);
});

// @route   POST /api/auth/abandon-round
// @desc    Triggered when student attempts to back out, navigate away, or abandon test
router.post('/abandon-round', protect, async (req, res) => {
  try {
    const round = Number(req.body.round) || 1;
    const user = await User.findById(req.user._id);
    const roundObj = user ? user[`round${round}`] : null;

    if (user && !roundObj?.completedAt) {
      user.reEntryBlocked = true;
      user.blockReason = `Candidate exited Round ${round} midway without submitting`;
      await user.save();
    }
    res.json({ success: true, reEntryBlocked: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

// Backward compatibility alias for Round 1
router.post('/abandon-round1', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user && !user.round1.completedAt) {
      user.reEntryBlocked = true;
      user.blockReason = 'Candidate exited assessment midway without completing';
      await user.save();
    }
    res.json({ success: true, reEntryBlocked: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

// @route   POST /api/auth/start-new-attempt
// @desc    Archive current attempt and start fresh attempt
router.post('/start-new-attempt', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.history.push({
      attemptNumber: user.attemptNumber,
      round1Score: user.round1.score,
      round1Passed: user.round1.passed,
      round2Score: user.round2.score,
      round2Passed: user.round2.passed,
      round2AdminApproved: user.round2.adminApproved,
      round3Score: user.round3.score,
      round3Passed: user.round3.passed,
      status: user.status,
      violations: user.violationCount,
      archivedAt: new Date()
    });

    user.attemptNumber += 1;
    user.currentRound = 1;
    user.status = 'ready_for_round1';
    user.disqualified = false;
    user.violationCount = 0;
    user.violations = [];
    user.round1Started = false;
    user.reEntryBlocked = false;
    user.blockReason = '';

    user.round1 = { score: 0, total: 25, percentage: 0, passed: false, completedAt: null };
    user.round2 = { score: 0, total: 50, percentage: 0, passed: false, borderline: false, adminApproved: false, completedAt: null };
    user.round3 = { score: 0, total: 4, passed: false, completedAt: null, solutions: [] };

    await user.save();

    res.json({
      success: true,
      message: `New attempt (#${user.attemptNumber}) initialized successfully!`,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error initializing new attempt' });
  }
});

module.exports = router;
