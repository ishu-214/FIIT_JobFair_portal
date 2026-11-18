const mongoose = require('mongoose');
const Question = require('../models/Question');
const round1Questions = require('../data/round1Questions');
const round2Questions = require('../data/round2Questions');
const { dataAnalystQuestions, javaFullStackQuestions } = require('../data/domainQuestions');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fiit_recruitment');
  console.log('Connected to MongoDB.');

  // Delete old Round 1 questions
  await Question.deleteMany({ round: 1 });
  console.log('Cleared old Round 1 questions.');

  // Seed all 60 Round 1 questions (Computer Knowledge, Aptitude, Logical Reasoning, Number Series)
  const seedR1 = round1Questions.map(q => ({
    round: 1,
    domain: 'common',
    questionText: q.question,
    category: q.category,
    options: q.options,
    correctAnswer: q.correctAnswer
  }));
  await Question.insertMany(seedR1);
  console.log(`✅ Inserted ${seedR1.length} Round 1 questions (Computer, Aptitude, Logic, Number Series).`);

  // Delete old Round 2 questions
  await Question.deleteMany({ round: 2 });
  console.log('Cleared old Round 2 questions.');

  // Seed general Round 2 questions
  const seedR2General = round2Questions.map(q => ({
    round: 2,
    domain: 'common',
    questionText: q.question,
    category: q.topic,
    options: q.options,
    correctAnswer: q.correctAnswer
  }));
  await Question.insertMany(seedR2General);

  // Seed Data Analyst Round 2 questions
  const seedR2DA = dataAnalystQuestions.map(q => ({
    round: 2,
    domain: 'data_analyst',
    questionText: q.question,
    category: q.topic,
    options: q.options,
    correctAnswer: q.correctAnswer
  }));
  await Question.insertMany(seedR2DA);

  console.log(`✅ Inserted ${seedR2General.length + seedR2DA.length} Round 2 domain questions into MongoDB.`);

  const r1Count = await Question.countDocuments({ round: 1 });
  const r2Count = await Question.countDocuments({ round: 2 });
  console.log(`Current DB Questions -> Round 1: ${r1Count}, Round 2: ${r2Count}`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
