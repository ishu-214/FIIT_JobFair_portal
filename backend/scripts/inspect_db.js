const mongoose = require('mongoose');
const User = require('../models/User');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fiit_recruitment');
  const users = await User.find({}).select('email name violationCount violations disqualified reEntryBlocked round1 round2 round3 status');
  console.log(`Total users in DB: ${users.length}`);
  for (const u of users) {
    if (u.violations && u.violations.length > 0 || u.disqualified || u.reEntryBlocked) {
      console.log(`- ${u.email}: disqualified=${u.disqualified}, reEntryBlocked=${u.reEntryBlocked}, violationCount=${u.violationCount}`);
      console.log(`  violations:`, u.violations);
    }
  }
  await mongoose.disconnect();
}
check().catch(console.error);
