const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const testUsersData = [
  // 1. Java Full Stack Developer
  {
    name: 'Arun Kumar (FullStack R2)',
    email: 'fullstack.r2@fiit.edu',
    password: 'student123',
    domain: 'Java Full Stack Developer',
    degree: 'B.E. (Bachelor of Engineering)',
    department: 'Computer Science and Engineering (CSE)',
    collegeName: 'Anna University, Chennai',
    stage: 'ready_for_r2'
  },
  {
    name: 'Divya Ramesh (FullStack R3)',
    email: 'fullstack.r3@fiit.edu',
    password: 'student123',
    domain: 'Java Full Stack Developer',
    degree: 'B.Tech (Bachelor of Technology)',
    department: 'Information Technology (IT)',
    collegeName: 'PSG College of Technology, Coimbatore',
    stage: 'ready_for_r3'
  },

  // 2. Data Analyst / Data Scientist
  {
    name: 'Sneha Reddy (DataAnalyst R2)',
    email: 'dataanalyst.r2@fiit.edu',
    password: 'student123',
    domain: 'Data Analyst / Data Scientist',
    degree: 'B.Tech (Bachelor of Technology)',
    department: 'Artificial Intelligence & Data Science (AI & DS)',
    collegeName: 'SSN College of Engineering, Chennai',
    stage: 'ready_for_r2'
  },
  {
    name: 'Vikram Santhosh (DataAnalyst R3)',
    email: 'dataanalyst.r3@fiit.edu',
    password: 'student123',
    domain: 'Data Analyst / Data Scientist',
    degree: 'B.Sc (Bachelor of Science)',
    department: 'Computer Science',
    collegeName: 'Loyola College, Chennai',
    stage: 'ready_for_r3'
  },

  // 3. Python Developer
  {
    name: 'Pooja Sharma (Python R2)',
    email: 'python.r2@fiit.edu',
    password: 'student123',
    domain: 'Python Developer',
    degree: 'B.E. (Bachelor of Engineering)',
    department: 'Computer Science and Engineering (CSE)',
    collegeName: 'CIT, Coimbatore',
    stage: 'ready_for_r2'
  },
  {
    name: 'Kiran Patel (Python R3)',
    email: 'python.r3@fiit.edu',
    password: 'student123',
    domain: 'Python Developer',
    degree: 'BCA (Bachelor of Computer Applications)',
    department: 'Computer Science',
    collegeName: 'Madras Christian College',
    stage: 'ready_for_r3'
  },

  // 4. Java Developer
  {
    name: 'Manoj Varma (Java R2)',
    email: 'java.r2@fiit.edu',
    password: 'student123',
    domain: 'Java Developer',
    degree: 'B.E. (Bachelor of Engineering)',
    department: 'Information Technology (IT)',
    collegeName: 'Thiagarajar College of Engineering, Madurai',
    stage: 'ready_for_r2'
  },
  {
    name: 'Swathi Krishnan (Java R3)',
    email: 'java.r3@fiit.edu',
    password: 'student123',
    domain: 'Java Developer',
    degree: 'B.Tech (Bachelor of Technology)',
    department: 'Computer Science and Engineering (CSE)',
    collegeName: 'Government College of Technology, Coimbatore',
    stage: 'ready_for_r3'
  },

  // 5. Frontend Developer
  {
    name: 'Harish Bala (Frontend R2)',
    email: 'frontend.r2@fiit.edu',
    password: 'student123',
    domain: 'Frontend Developer',
    degree: 'B.E. (Bachelor of Engineering)',
    department: 'Electronics and Communication Engineering (ECE)',
    collegeName: 'Kumaraguru College of Technology',
    stage: 'ready_for_r2'
  },
  {
    name: 'Nithya Sundar (Frontend R3)',
    email: 'frontend.r3@fiit.edu',
    password: 'student123',
    domain: 'Frontend Developer',
    degree: 'B.Tech (Bachelor of Technology)',
    department: 'Information Technology (IT)',
    collegeName: 'Sri Venkateswara College of Engineering',
    stage: 'ready_for_r3'
  },

  // 6. Backend Developer
  {
    name: 'Gowtham Raj (Backend R2)',
    email: 'backend.r2@fiit.edu',
    password: 'student123',
    domain: 'Backend Developer',
    degree: 'B.E. (Bachelor of Engineering)',
    department: 'Computer Science and Engineering (CSE)',
    collegeName: 'Coimbatore Institute of Engineering and Technology',
    stage: 'ready_for_r2'
  },
  {
    name: 'Deepa Lakshmi (Backend R3)',
    email: 'backend.r3@fiit.edu',
    password: 'student123',
    domain: 'Backend Developer',
    degree: 'MCA (Master of Computer Applications)',
    department: 'Computer Science',
    collegeName: 'Anna University Guindy Campus',
    stage: 'ready_for_r3'
  }
];

async function seedTestUsers() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/fiit_recruitment');
    console.log('✅ Connected to MongoDB fiit_recruitment.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('student123', salt);

    for (const data of testUsersData) {
      // Remove any existing user with this email
      await User.deleteOne({ email: data.email });

      const isR3Ready = data.stage === 'ready_for_r3';

      const userDoc = new User({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'student',
        hasReadInstructions: true,
        isProfileCompleted: true,
        phoneNumber: '9876543210',
        degree: data.degree,
        yearOfStudy: '4th Year / Final Year',
        department: data.department,
        collegeName: data.collegeName,
        interestedRole: data.domain,

        // Anti-cheat state: Clean
        disqualified: false,
        reEntryBlocked: false,
        violationCount: 0,
        violations: [],
        round1Started: true,
        round1StartedAt: new Date(Date.now() - 3600000),
        round2Started: isR3Ready,
        round2StartedAt: isR3Ready ? new Date(Date.now() - 1800000) : null,
        round3Started: false,
        round3StartedAt: null,

        // Round 1 is cleared for all 12 users
        round1: {
          score: isR3Ready ? 24 : 22,
          total: 25,
          percentage: isR3Ready ? 96 : 88,
          passed: true,
          completedAt: new Date(Date.now() - 3600000)
        },

        // Round 2
        round2: isR3Ready
          ? {
              score: 45,
              total: 50,
              percentage: 90,
              passed: true,
              borderline: false,
              completedAt: new Date(Date.now() - 1800000),
              domainEvaluated: data.domain
            }
          : {
              score: 0,
              total: 50,
              percentage: 0,
              passed: false,
              borderline: false,
              completedAt: null,
              domainEvaluated: data.domain
            },

        // Round 3
        round3: {
          score: 0,
          total: 4,
          passed: false,
          completedAt: null,
          solutions: []
        },

        status: isR3Ready ? 'round2_passed' : 'round1_passed'
      });

      await userDoc.save();
      console.log(`Created user: ${data.email} [${data.domain}] -> Status: ${data.stage}`);
    }

    console.log('\n🎉 Successfully created all 12 test candidate accounts!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding test users:', err);
    process.exit(1);
  }
}

seedTestUsers();
