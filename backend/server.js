require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessment');
const adminRoutes = require('./routes/admin');
const User = require('./models/User');
const AssessmentConfig = require('./models/AssessmentConfig');
const Question = require('./models/Question');
const round1Questions = require('./data/round1Questions');
const round2Questions = require('./data/round2Questions');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fiit_recruitment';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'FIIT Job Fair Assessment Portal',
    theme: {
      primaryColor: '#2F2D7D',
      rgb: '47, 45, 125',
      secondary: '#FFFFFF'
    },
    timestamp: new Date()
  });
});

// Seed default Admin, Config & Questions
async function seedDefaults() {
  try {
    // 1. Admin
    const adminEmail = 'admin@fiit.edu';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'FIIT Recruitment Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        attemptNumber: 1,
        currentRound: 3,
        isProfileCompleted: true,
        hasReadInstructions: true,
        status: 'admin'
      });
      console.log('✅ Default Admin created: admin@fiit.edu / admin123');
    }

    // 2. Assessment Config
    let config = await AssessmentConfig.findOne();
    if (!config) {
      await AssessmentConfig.create({
        round1DurationMinutes: 25,
        round1CutoffPercent: 60, // 60% cutoff for Round 1
        round2DurationMinutes: 45,
        round2CutoffPercent: 70, // 70% cutoff for Round 2
        round2BorderlinePercent: 60, // 60% borderline
        round3DurationMinutes: 60,
        round3QuestionsCount: 4
      });
      console.log('✅ Default Assessment Config initialized (60% R1 Cutoff, 4 R3 Questions)');
    }

    // 3. Seed sample questions into DB if empty or insufficient
    const r1DbCount = await Question.countDocuments({ round: 1 });
    if (r1DbCount < 25) {
      console.log('Seeding full 40 Round 1 questions into database for Admin management...');
      await Question.deleteMany({ round: 1 });
      const seedR1 = round1Questions.map(q => ({
        round: 1,
        domain: 'common',
        questionText: q.question,
        category: q.category,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));
      await Question.insertMany(seedR1);
      console.log('✅ Full 40 Round 1 questions seeded into Question collection');
    }

    const r2DbCount = await Question.countDocuments({ round: 2 });
    if (r2DbCount === 0) {
      const seedR2 = round2Questions.map(q => ({
        round: 2,
        domain: 'common',
        questionText: q.question,
        category: q.topic || 'Technical',
        options: q.options,
        correctAnswer: q.correctAnswer
      }));
      await Question.insertMany(seedR2);
      console.log('✅ Round 2 questions seeded into Question collection');
    }
  } catch (err) {
    console.error('Error seeding defaults:', err.message);
  }
}

// Connect to MongoDB & Start Server
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);
    await seedDefaults();
    app.listen(PORT, () => {
      console.log(`🚀 FIIT Backend Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
