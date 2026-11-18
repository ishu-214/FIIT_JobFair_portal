const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    round: { type: Number, required: true }, // 1, 2, 3
    domain: {
      type: String,
      enum: ['common', 'fullstack', 'data_analyst', 'frontend', 'backend', 'python', 'java'],
      default: 'common'
    },
    // MCQ fields (Rounds 1 & 2)
    questionText: { type: String, default: '' },
    category: { type: String, default: '' },
    options: [{ type: String }],
    correctAnswer: { type: String, default: '' },

    // Coding fields (Round 3)
    title: { type: String, default: '' },
    scenario: { type: String, default: '' },
    description: { type: String, default: '' },
    sampleInput: { type: String, default: '' },
    sampleOutput: { type: String, default: '' },
    constraints: [{ type: String }],
    starterCode: {
      python: { type: String, default: '' },
      java: { type: String, default: '' }
    },
    testCases: [
      {
        id: Number,
        input: String,
        expectedOutput: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
