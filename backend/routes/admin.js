const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const AssessmentConfig = require('../models/AssessmentConfig');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

async function getConfig() {
  let config = await AssessmentConfig.findOne();
  if (!config) {
    config = await AssessmentConfig.create({
      round1DurationMinutes: 25,
      round1CutoffPercent: 60,
      round2DurationMinutes: 45,
      round2CutoffPercent: 70,
      round2BorderlinePercent: 60,
      round3DurationMinutes: 60,
      round3QuestionsCount: 4
    });
  }
  return config;
}

// -------------------------------------------------------------
// 1. STATS
// -------------------------------------------------------------
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const allCleared = await User.countDocuments({ role: 'student', 'round3.passed': true });
    const round1Passed = await User.countDocuments({ role: 'student', 'round1.passed': true });
    const round2Passed = await User.countDocuments({ role: 'student', 'round2.passed': true });
    const pendingBorderline = await User.countDocuments({
      role: 'student',
      'round2.borderline': true,
      'round2.adminApproved': false
    });
    const reEntryBlockedCount = await User.countDocuments({ role: 'student', reEntryBlocked: true });
    const disqualified = await User.countDocuments({ role: 'student', disqualified: true });

    res.json({
      success: true,
      stats: {
        totalStudents,
        allCleared,
        round1Passed,
        round2Passed,
        pendingBorderline,
        reEntryBlockedCount,
        disqualified
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve stats' });
  }
});

// -------------------------------------------------------------
// 2. STUDENTS LIST (Full details of candidates & 3-round cleared)
// -------------------------------------------------------------
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    const formatted = students.map((s) => {
      const clearedAll = s.round3.passed === true;

      let clearedSummary = 'In Progress';
      if (s.disqualified) {
        clearedSummary = `Terminated: ${s.disqualificationReason || s.blockReason || 'Proctoring Violation'}`;
      } else if (s.reEntryBlocked) {
        clearedSummary = 'Blocked: Exited midway without submitting';
      } else if (clearedAll) {
        clearedSummary = 'Cleared All 3 Rounds 🏆';
      } else if (s.status === 'round1_failed') {
        clearedSummary = 'Round 1 Failed';
      } else if (s.status === 'round2_failed') {
        clearedSummary = 'Round 2 Failed';
      } else if (s.round2.borderline && !s.round2.adminApproved) {
        clearedSummary = 'Round 2 Borderline (Needs Admin Approval)';
      } else if (s.round2.adminApproved) {
        clearedSummary = 'Round 2 Admin Approved (Eligible for Round 3)';
      } else if (s.round2.passed) {
        clearedSummary = 'Round 2 Cleared (Ready for Round 3)';
      } else if (s.round1.passed) {
        clearedSummary = 'Round 1 Cleared (Ready for Round 2)';
      }

      return {
        _id: s._id,
        name: s.name,
        email: s.email,
        phone: s.phoneNumber || s.phone,
        college: s.collegeName || s.college,
        degree: s.degree || (s.department ? `${s.department} (${s.yearOfStudy || ''})` : ''),
        yearOfStudy: s.yearOfStudy,
        department: s.department,
        specialization: s.specialization,
        interestedRole: s.interestedRole,
        isProfileCompleted: s.isProfileCompleted,
        currentRound: s.currentRound,
        status: s.status,
        clearedSummary,
        clearedAll,
        disqualified: s.disqualified,
        disqualificationReason: s.disqualificationReason || s.blockReason || '',
        reEntryBlocked: s.reEntryBlocked,
        blockReason: s.blockReason,
        violationCount: s.violationCount,
        violations: s.violations,
        round1: s.round1,
        round2: {
          ...s.round2,
          eligibleForAdminApproval: s.round2.percentage >= 60 && !s.round2.passed && !s.round2.adminApproved
        },
        round3: s.round3,
        createdAt: s.createdAt
      };
    });

    res.json({
      success: true,
      students: formatted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve students list' });
  }
});

// -------------------------------------------------------------
// 3. CONFIGURATION (Duration, Cutoffs, Scheduling)
// -------------------------------------------------------------
router.get('/config', async (req, res) => {
  try {
    const config = await getConfig();
    res.json({ success: true, config });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch config' });
  }
});

router.put('/config', async (req, res) => {
  try {
    const config = await getConfig();
    const {
      round1DurationMinutes,
      round1CutoffPercent,
      round2DurationMinutes,
      round2CutoffPercent,
      round2BorderlinePercent,
      round3DurationMinutes,
      round3QuestionsCount,
      scheduleStart,
      scheduleEnd,
      isScheduleActive
    } = req.body;

    if (round1DurationMinutes !== undefined) config.round1DurationMinutes = Number(round1DurationMinutes);
    if (round1CutoffPercent !== undefined) config.round1CutoffPercent = Number(round1CutoffPercent);
    if (round2DurationMinutes !== undefined) config.round2DurationMinutes = Number(round2DurationMinutes);
    if (round2CutoffPercent !== undefined) config.round2CutoffPercent = Number(round2CutoffPercent);
    if (round2BorderlinePercent !== undefined) config.round2BorderlinePercent = Number(round2BorderlinePercent);
    if (round3DurationMinutes !== undefined) config.round3DurationMinutes = Number(round3DurationMinutes);
    if (round3QuestionsCount !== undefined) config.round3QuestionsCount = Number(round3QuestionsCount);
    if (scheduleStart !== undefined) config.scheduleStart = scheduleStart ? new Date(scheduleStart) : null;
    if (scheduleEnd !== undefined) config.scheduleEnd = scheduleEnd ? new Date(scheduleEnd) : null;
    if (isScheduleActive !== undefined) config.isScheduleActive = Boolean(isScheduleActive);

    await config.save();

    res.json({
      success: true,
      message: 'Assessment configuration and scheduling updated successfully!',
      config
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update config' });
  }
});

// -------------------------------------------------------------
// 4. QUESTION MANAGEMENT (CRUD for Admin)
// -------------------------------------------------------------
router.get('/questions', async (req, res) => {
  try {
    const { round, domain } = req.query;
    const filter = {};
    if (round) filter.round = Number(round);
    if (domain) filter.domain = domain;

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: questions.length, questions });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch questions' });
  }
});

router.post('/questions', async (req, res) => {
  try {
    const {
      round,
      domain,
      questionText,
      category,
      options,
      correctAnswer,
      title,
      scenario,
      description,
      sampleInput,
      sampleOutput,
      constraints,
      starterCode,
      testCases
    } = req.body;

    if (!round) {
      return res.status(400).json({ success: false, message: 'Round number is required' });
    }

    const newQ = await Question.create({
      round: Number(round),
      domain: domain || 'common',
      questionText,
      category,
      options: options || [],
      correctAnswer,
      title,
      scenario,
      description,
      sampleInput,
      sampleOutput,
      constraints: constraints || [],
      starterCode: starterCode || { python: '', java: '' },
      testCases: testCases || []
    });

    res.status(201).json({
      success: true,
      message: 'New question added successfully!',
      question: newQ
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create question' });
  }
});

router.put('/questions/:id', async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ success: false, message: 'Question not found' });

    Object.assign(q, req.body);
    await q.save();

    res.json({
      success: true,
      message: 'Question updated successfully!',
      question: q
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update question' });
  }
});

router.delete('/questions/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete question' });
  }
});

// -------------------------------------------------------------
// 5. APPROVE BORDERLINE STUDENT FOR ROUND 3
// -------------------------------------------------------------
router.post('/approve-round3/:studentId', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    student.round2.adminApproved = true;
    student.round2.adminApprovedAt = new Date();
    student.currentRound = 3;
    student.status = 'round2_admin_approved';

    await student.save();

    res.json({
      success: true,
      message: `Student ${student.name} approved for Round 3 by Admin!`,
      student
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve student' });
  }
});

// -------------------------------------------------------------
// 6. UNBLOCK RE-ENTRY (EMAIL CHECK)
// -------------------------------------------------------------
router.post('/reset-reentry/:studentId', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    student.reEntryBlocked = false;
    student.round1Started = false;
    student.blockReason = '';
    if (student.status === 're_entry_blocked' || student.status === 'round1_in_progress') {
      student.status = 'ready_for_round1';
    }
    await student.save();

    res.json({
      success: true,
      message: `Re-entry unblocked for ${student.email}. Student can now take assessment.`,
      student
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to unblock re-entry' });
  }
});

// -------------------------------------------------------------
// 7. RESET DISQUALIFICATION
// -------------------------------------------------------------
router.post('/reset-disqualification/:studentId', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    student.disqualified = false;
    student.violationCount = 0;
    student.status = student.round2.passed ? 'ready_for_round3' : student.round1.passed ? 'ready_for_round2' : 'ready_for_round1';
    await student.save();

    res.json({
      success: true,
      message: `Disqualification cleared for ${student.name}`,
      student
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset student status' });
  }
});

module.exports = router;
