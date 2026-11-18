const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AssessmentConfig = require('../models/AssessmentConfig');
const Question = require('../models/Question');
const { protect } = require('../middleware/authMiddleware');
const round1Questions = require('../data/round1Questions');
const round2Questions = require('../data/round2Questions');
const { round3Questions, getRound3QuestionsForDomain, findRound3Question } = require('../data/round3Questions');
const { getQuestionsForDomain, domainQuestionsMap } = require('../data/domainQuestions');
const { runAgainstTestCases } = require('../utils/codeRunner');

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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
// CONFIG / TIMING / SCHEDULE INFO
// -------------------------------------------------------------
router.get('/config', async (req, res) => {
  try {
    const config = await getConfig();
    res.json({ success: true, config });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to retrieve config' });
  }
});

// -------------------------------------------------------------
// ROUND 1: Basic Computer Knowledge Assessment (25 Common MCQs)
// -------------------------------------------------------------
router.get('/round1/questions', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.disqualified) {
      return res.status(403).json({ success: false, message: 'Disqualified due to proctoring strikes.' });
    }

    if (user.reEntryBlocked) {
      return res.status(403).json({
        success: false,
        reEntryBlocked: true,
        message: `Assessment re-entry is blocked for ${user.email}. Retest not permitted without Admin clearance.`
      });
    }

    const config = await getConfig();

    // Check schedule window if active
    if (config.isScheduleActive && config.scheduleStart && config.scheduleEnd) {
      const now = new Date();
      if (now < new Date(config.scheduleStart) || now > new Date(config.scheduleEnd)) {
        return res.status(403).json({
          success: false,
          message: `Assessment is scheduled between ${new Date(config.scheduleStart).toLocaleString()} and ${new Date(config.scheduleEnd).toLocaleString()}.`
        });
      }
    }

    // Always ensure a full pool of at least 25+ questions
    let dbPool = await Question.find({ round: 1 }).lean();
    let pool = [];

    if (dbPool && dbPool.length >= 25) {
      pool = dbPool.map(q => ({
        id: q._id.toString(),
        questionText: q.questionText,
        category: q.category,
        options: q.options
      }));
    } else {
      pool = round1Questions.map(q => ({
        id: q.id,
        questionText: q.question,
        category: q.category,
        options: q.options
      }));
    }

    const sampled = shuffleArray(pool).slice(0, 25);
    const clientQuestions = sampled.map(q => ({
      id: q.id,
      question: q.questionText,
      category: q.category || 'Computer Basics',
      options: shuffleArray(q.options)
    }));

    const passMark = Math.ceil((25 * config.round1CutoffPercent) / 100);

    res.json({
      success: true,
      total: clientQuestions.length,
      durationMinutes: config.round1DurationMinutes,
      cutoffPercent: config.round1CutoffPercent,
      passMark,
      questions: clientQuestions
    });
  } catch (error) {
    console.error('Round 1 questions error:', error);
    res.status(500).json({ success: false, message: 'Failed to load Round 1 questions' });
  }
});

router.post('/round1/submit', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.disqualified || user.reEntryBlocked) {
      return res.status(403).json({ success: false, message: 'Assessment access blocked.' });
    }

    const config = await getConfig();
    const { answers } = req.body;

    let score = 0;
    const qMap = new Map();

    // Map correct answers from DB or static
    const dbQuestions = await Question.find({ round: 1 }).lean();
    if (dbQuestions && dbQuestions.length > 0) {
      dbQuestions.forEach(q => qMap.set(q._id.toString(), q.correctAnswer));
    }
    round1Questions.forEach(q => qMap.set(q.id.toString(), q.correctAnswer));

    Object.keys(answers || {}).forEach(qIdStr => {
      const correctAns = qMap.get(qIdStr.toString());
      if (correctAns && answers[qIdStr] === correctAns) {
        score++;
      }
    });

    const total = 25;
    const percentage = Math.round((score / total) * 100);
    const passMark = Math.ceil((total * config.round1CutoffPercent) / 100);
    const passed = percentage >= config.round1CutoffPercent;

    user.round1 = {
      score,
      total,
      percentage,
      passed,
      completedAt: new Date()
    };

    if (passed) {
      user.currentRound = 2;
      user.status = 'round1_passed';
    } else {
      user.status = 'round1_failed';
    }

    await user.save();

    res.json({
      success: true,
      score,
      total,
      percentage,
      cutoffPercent: config.round1CutoffPercent,
      passMark,
      passed,
      message: passed
        ? 'Congratulations, you have passed the first assessment and you can move to second assessment test'
        : 'Sorry, you have not cleared the assessment.',
      nextRoundAllowed: passed
    });
  } catch (error) {
    console.error('Round 1 submit error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit Round 1 answers' });
  }
});

// -------------------------------------------------------------
// ROUND 2: Domain-Based Technical Assessment (50 MCQs)
// -------------------------------------------------------------
router.get('/round2/questions', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.disqualified) {
      return res.status(403).json({ success: false, message: 'Disqualified from assessment.' });
    }

    if (!user.round1.passed) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You must pass Round 1 to enter Round 2.'
      });
    }

    const config = await getConfig();
    const candidateDomain = user.interestedRole || 'Full Stack Developer';

    // Fetch dynamic questions from DB for this domain if present
    let pool = await Question.find({ round: 2, domain: candidateDomain.toLowerCase().replace(/[^a-z]/g, '_') }).lean();
    if (!pool || pool.length < 50) {
      pool = getQuestionsForDomain(candidateDomain, 50);
    }

    const sampled = shuffleArray(pool).slice(0, 50);
    const clientQuestions = sampled.map(q => ({
      id: q._id ? q._id.toString() : q.id,
      topic: q.category || q.topic || candidateDomain,
      question: q.questionText || q.question,
      options: shuffleArray(q.options)
    }));

    const passMark = Math.ceil((50 * config.round2CutoffPercent) / 100);

    res.json({
      success: true,
      total: clientQuestions.length,
      domain: candidateDomain,
      durationMinutes: config.round2DurationMinutes,
      cutoffPercent: config.round2CutoffPercent,
      borderlinePercent: config.round2BorderlinePercent,
      passMark,
      questions: clientQuestions
    });
  } catch (error) {
    console.error('Round 2 questions error:', error);
    res.status(500).json({ success: false, message: 'Failed to load Round 2 questions' });
  }
});

router.post('/round2/submit', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.round1.passed) {
      return res.status(403).json({ success: false, message: 'Round 1 not cleared.' });
    }

    const config = await getConfig();
    const { answers } = req.body;

    let score = 0;
    const qMap = new Map();

    // Map correct answers
    const dbQuestions = await Question.find({ round: 2 }).lean();
    if (dbQuestions && dbQuestions.length > 0) {
      dbQuestions.forEach(q => qMap.set(q._id.toString(), q.correctAnswer));
    }
    round2Questions.forEach(q => qMap.set(q.id.toString(), q.correctAnswer));
    Object.values(domainQuestionsMap || {}).forEach(arr => {
      if (Array.isArray(arr)) {
        arr.forEach(q => {
          if (q.id && q.correctAnswer) qMap.set(q.id.toString(), q.correctAnswer);
        });
      }
    });

    Object.keys(answers || {}).forEach(qIdStr => {
      const correctAns = qMap.get(qIdStr.toString());
      if (correctAns && answers[qIdStr] === correctAns) {
        score++;
      }
    });

    const total = 50;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= config.round2CutoffPercent;
    const borderline = percentage >= config.round2BorderlinePercent && percentage < config.round2CutoffPercent;

    user.round2 = {
      score,
      total,
      percentage,
      passed,
      borderline,
      adminApproved: user.round2.adminApproved || false,
      completedAt: new Date(),
      domainEvaluated: user.interestedRole || 'Full Stack Developer'
    };

    if (passed) {
      user.currentRound = 3;
      user.status = 'round2_passed';
    } else if (borderline) {
      user.status = 'round2_borderline_pending';
    } else {
      user.status = 'round2_failed';
    }

    await user.save();

    let message = '';
    if (passed) {
      message = `Congratulations! You have passed the technical assessment with ${score}/50 (${percentage}%). You can now move to the third assessment test.`;
    } else if (borderline) {
      message = `You scored ${score}/50 (${percentage}%). Standard cutoff is ${config.round2CutoffPercent}%. Your profile has been forwarded to the Admin for manual review and approval to take Round 3.`;
    } else {
      message = 'Sorry, you have not cleared the assessment.';
    }

    res.json({
      success: true,
      score,
      total,
      percentage,
      passed,
      borderline,
      adminApproved: user.round2.adminApproved,
      message,
      nextRoundAllowed: passed || user.round2.adminApproved
    });
  } catch (error) {
    console.error('Round 2 submit error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit Round 2 answers' });
  }
});

// -------------------------------------------------------------
// ROUND 3: Domain Technical Coding Assessment (4 Questions)
// -------------------------------------------------------------
router.get('/round3/questions', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const allowed = user.round2.passed || user.round2.adminApproved;
    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You must pass Round 2 or receive Admin approval to access Round 3.'
      });
    }

    const config = await getConfig();

    // Pull 4 domain-specific coding questions
    const candidateDomain = user.interestedRole || 'Java Full Stack Developer';
    const domainQuestions = getRound3QuestionsForDomain(candidateDomain);
    const clientQuestions = domainQuestions.slice(0, config.round3QuestionsCount || 4).map(q => ({
      id: q.id,
      title: q.title,
      difficulty: q.difficulty,
      scenario: q.scenario,
      description: q.description,
      constraints: q.constraints,
      sampleInput: q.sampleInput,
      sampleOutput: q.sampleOutput,
      sampleExplanation: q.sampleExplanation,
      examples: q.examples,
      starterCode: q.starterCode,
      totalTestCases: q.testCases.length
    }));

    res.json({
      success: true,
      durationMinutes: config.round3DurationMinutes,
      questionsCount: clientQuestions.length,
      domain: candidateDomain,
      questions: clientQuestions
    });
  } catch (error) {
    console.error('Round 3 questions error:', error);
    res.status(500).json({ success: false, message: 'Failed to load Round 3 questions' });
  }
});

router.post('/round3/run', protect, async (req, res) => {
  try {
    const { questionId, language, code } = req.body;
    const question = findRound3Question(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const testResult = await runAgainstTestCases(language, code, question.testCases);

    res.json({
      success: true,
      questionId: question.id,
      language,
      totalTestCases: testResult.totalTestCases || question.testCases.length,
      passedCount: testResult.passedCount || 0,
      allPassed: testResult.allPassed || false,
      results: testResult.results || [],
      error: testResult.error || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Execution error: ' + error.message });
  }
});

router.post('/round3/submit', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const allowed = user.round2.passed || user.round2.adminApproved;
    if (!allowed) return res.status(403).json({ success: false, message: 'Not authorized for Round 3' });

    const config = await getConfig();
    const targetCount = config.round3QuestionsCount || 4;
    const { solutions } = req.body;

    let fullySolvedCount = 0;
    const evaluatedSolutions = [];

    for (const sol of solutions || []) {
      const question = findRound3Question(sol.questionId);
      if (!question) continue;

      const evalResult = await runAgainstTestCases(sol.language || 'python', sol.code || '', question.testCases);
      const isSolved = evalResult.allPassed;
      if (isSolved) fullySolvedCount++;

      evaluatedSolutions.push({
        questionId: question.id,
        language: sol.language,
        code: sol.code,
        testCasesPassed: evalResult.passedCount || 0,
        totalTestCases: question.testCases.length,
        status: isSolved ? 'solved' : 'partial'
      });
    }

    const allCleared = fullySolvedCount === targetCount;

    user.round3 = {
      score: fullySolvedCount,
      total: targetCount,
      passed: allCleared,
      completedAt: new Date(),
      solutions: evaluatedSolutions
    };

    if (allCleared) {
      user.status = 'all_cleared';
    } else {
      user.status = 'round3_partial';
    }

    await user.save();

    res.json({
      success: true,
      solvedCount: fullySolvedCount,
      total: targetCount,
      allCleared,
      message: allCleared
        ? 'Congratulations! You have successfully cleared all 3 rounds of the FIIT Assessment!'
        : `You solved ${fullySolvedCount}/${targetCount} problems completely. All ${targetCount} problems must pass all test cases to clear.`,
      solutions: evaluatedSolutions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit Round 3' });
  }
});

// -------------------------------------------------------------
// PROCTORING: Violation Tracking
// -------------------------------------------------------------
router.post('/violation', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.disqualified) {
      return res.json({ success: false, disqualified: true, message: 'Already disqualified.' });
    }

    const { type, reason } = req.body;
    let readableReason = reason || 'Proctoring violation detected';
    if (type === 'copy_paste' || type === 'clipboard_shortcut') {
      readableReason = 'Copy & Paste Violation (Ctrl+C / Ctrl+V prohibited)';
    } else if (type === 'fullscreen_exit') {
      readableReason = 'Fullscreen Mode Exited';
    } else if (type === 'tab_switch' || type === 'window_blur') {
      readableReason = 'Tab Switch / Window Minimized';
    } else if (type === 'screenshot') {
      readableReason = 'Screenshot Attempt (PrintScreen)';
    }

    user.violationCount += 1;
    user.disqualificationReason = readableReason;
    user.violations.push({
      type: type || 'violation',
      reason: readableReason,
      timestamp: new Date()
    });

    if (user.violationCount >= 2) {
      user.disqualified = true;
      user.status = 'disqualified';
      user.reEntryBlocked = true;
      user.blockReason = `Terminated: ${readableReason}`;
      await user.save();

      return res.json({
        success: true,
        disqualified: true,
        violationCount: user.violationCount,
        strike: 2,
        maxStrikes: 2,
        reason: readableReason,
        message: `DISQUALIFIED: Assessment terminated due to ${readableReason}.`
      });
    }

    await user.save();

    res.json({
      success: true,
      disqualified: false,
      violationCount: user.violationCount,
      strike: 1,
      maxStrikes: 2,
      message: `WARNING (Strike 1 of 2): Proctoring violation detected: ${reason || type}. Next violation will disqualify you!`
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to log violation' });
  }
});

module.exports = router;
