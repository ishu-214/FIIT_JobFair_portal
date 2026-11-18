const puppeteer = require('puppeteer-core');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fiit_recruitment');
  const email = `r2_test_${Date.now()}@fiit.edu`;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('Password@123', salt);
  await User.create({
    name: 'Priya Sharma (R2 Candidate)',
    email: email,
    password: hash,
    phoneNumber: '9876543210',
    collegeName: 'Anna University, Chennai',
    department: 'Computer Science and Engineering',
    interestedRole: 'Full Stack Developer',
    yearOfStudy: '3rd Year',
    hasReadInstructions: true,
    isProfileCompleted: true,
    currentRound: 2,
    round1: { score: 22, total: 25, percentage: 88, passed: true, completedAt: new Date() }
  });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await delay(1000);

  const inputs = await page.$$('input');
  await inputs[0].type(email);
  await inputs[1].type('Password@123');
  const btn = await page.$('button[type="submit"]');
  await btn.click();
  await delay(1500);

  const r2Btn = await page.$('button ::-p-text(Take Round 2 Technical Assessment)');
  if (r2Btn) {
    await r2Btn.click();
  } else {
    const allBtns = await page.$$('button');
    for (const b of allBtns) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt.includes('Round 2') || txt.includes('Take')) {
        await b.click();
        break;
      }
    }
  }
  await delay(2000);

  await page.screenshot({ path: path.join(__dirname, '..', 'screenshots', '07_round2_domain_mcqs.png'), fullPage: true });
  console.log('✅ Saved 07_round2_domain_mcqs.png');
  await browser.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
