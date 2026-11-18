const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },

    // Step A: Instruction acknowledgment
    hasReadInstructions: {
      type: Boolean,
      default: false
    },

    // Step B: Mandatory Profile Updation
    isProfileCompleted: {
      type: Boolean,
      default: false
    },
    phoneNumber: {
      type: String,
      default: ''
    },
    degree: {
      type: String,
      default: '' // B.E., B.Tech, B.Sc, BCA, M.E., M.Tech, MCA, etc.
    },
    yearOfStudy: {
      type: String,
      default: '' // 1st Year, 2nd Year, 3rd Year, 4th Year / Final Year
    },
    department: {
      type: String,
      default: '' // CSE, IT, ECE, EEE, AI & DS, etc.
    },
    specialization: {
      type: String,
      default: '' // CSE, IT, Computer Science, ECE, etc.
    },
    collegeName: {
      type: String,
      default: ''
    },
    disqualificationReason: {
      type: String,
      default: ''
    },
    interestedRole: {
      type: String,
      enum: [
        'Full Stack Developer',
        'Java Full Stack Developer',
        'Data Analyst / Data Scientist',
        'Frontend Developer',
        'Backend Developer',
        'Python Developer',
        'Java Developer'
      ],
      default: 'Java Full Stack Developer'
    },

    // Re-entry & abandonment prevention (by email) across all rounds
    round1Started: {
      type: Boolean,
      default: false
    },
    round1StartedAt: {
      type: Date,
      default: null
    },
    round2Started: {
      type: Boolean,
      default: false
    },
    round2StartedAt: {
      type: Date,
      default: null
    },
    round3Started: {
      type: Boolean,
      default: false
    },
    round3StartedAt: {
      type: Date,
      default: null
    },
    reEntryBlocked: {
      type: Boolean,
      default: false
    },
    blockReason: {
      type: String,
      default: ''
    },

    attemptNumber: {
      type: Number,
      default: 1
    },
    currentRound: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      default: 'instructions_pending'
      // instructions_pending, profile_pending, ready_for_round1, round1_in_progress,
      // round1_passed, round1_failed, ready_for_round2, round2_passed, round2_borderline_pending,
      // round2_admin_approved, round2_failed, ready_for_round3, all_cleared, re_entry_blocked, disqualified
    },
    disqualified: {
      type: Boolean,
      default: false
    },
    violationCount: {
      type: Number,
      default: 0
    },
    violations: [
      {
        type: { type: String },
        reason: { type: String },
        timestamp: { type: Date, default: Date.now }
      }
    ],

    round1: {
      score: { type: Number, default: 0 },
      total: { type: Number, default: 25 },
      percentage: { type: Number, default: 0 },
      passed: { type: Boolean, default: false },
      completedAt: { type: Date, default: null }
    },
    round2: {
      score: { type: Number, default: 0 },
      total: { type: Number, default: 50 },
      percentage: { type: Number, default: 0 },
      passed: { type: Boolean, default: false },
      borderline: { type: Boolean, default: false },
      adminApproved: { type: Boolean, default: false },
      adminApprovedAt: { type: Date, default: null },
      completedAt: { type: Date, default: null },
      domainEvaluated: { type: String, default: 'Full Stack Developer' }
    },
    round3: {
      score: { type: Number, default: 0 }, // problems passed
      total: { type: Number, default: 4 }, // 4 questions
      passed: { type: Boolean, default: false },
      completedAt: { type: Date, default: null },
      solutions: [
        {
          questionId: Number,
          language: String,
          code: String,
          testCasesPassed: Number,
          totalTestCases: Number,
          status: String
        }
      ]
    },

    history: [
      {
        attemptNumber: Number,
        round1Score: Number,
        round1Passed: Boolean,
        round2Score: Number,
        round2Passed: Boolean,
        round2AdminApproved: Boolean,
        round3Score: Number,
        round3Passed: Boolean,
        status: String,
        violations: Number,
        archivedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
