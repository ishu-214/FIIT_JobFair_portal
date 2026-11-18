const mongoose = require('mongoose');

const assessmentConfigSchema = new mongoose.Schema(
  {
    round1DurationMinutes: { type: Number, default: 25 },
    round1CutoffPercent: { type: Number, default: 60 }, // 60% cutoff for Round 1
    round2DurationMinutes: { type: Number, default: 45 },
    round2CutoffPercent: { type: Number, default: 70 }, // 70% cutoff for Round 2
    round2BorderlinePercent: { type: Number, default: 60 }, // 60% borderline review for Round 2
    round3DurationMinutes: { type: Number, default: 60 },
    round3QuestionsCount: { type: Number, default: 4 }, // 4 coding questions for Round 3
    scheduleStart: { type: Date, default: null },
    scheduleEnd: { type: Date, default: null },
    isScheduleActive: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AssessmentConfig', assessmentConfigSchema);
