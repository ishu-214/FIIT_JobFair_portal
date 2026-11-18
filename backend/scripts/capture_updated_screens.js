const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('Capturing updated screens: Profile (Branch only), Round 1 (25 easy questions), Round 3 (White/#2F2D7D editor)...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();

  // 1. Register a new user to show Profile Updation Page with Branch only & nothing prefilled
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await delay(1000);

  const regTab = await page.$('button ::-p-text(Register)');
  if (regTab) await regTab.click();
  await delay(500);

  const testEmail = `newcandidate_${Date.now()}@fiit.edu`;
  const regInputs = await page.$$('input');
  await regInputs[0].type('Ananya Raman');
  await regInputs[1].type(testEmail);
  await regInputs[2].type('Password@123');

  const subBtn = await page.$('button[type="submit"]');
  await subBtn.click();
  await delay(1500);

  // Acknowledge instructions
  const agreeBox = await page.$('label');
  if (agreeBox) await agreeBox.click();
  await delay(400);

  const proceedBtn = await page.$('button ::-p-text(Proceed to Profile Updation)');
  if (proceedBtn) await proceedBtn.click();
  await delay(1500);

  // Capture updated 03_mandatory_profile_update.png
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_mandatory_profile_update.png'), fullPage: true });
  console.log('📸 Saved 03_mandatory_profile_update.png (Branch only, nothing prefilled)');

  // Fill profile and proceed
  const phoneInp = await page.$('input[placeholder="e.g. 9876543210"]');
  if (phoneInp) await phoneInp.type('9876543210');
  const collegeInp = await page.$('input[placeholder="e.g. Madras Institute of Technology"]');
  if (collegeInp) await collegeInp.type('Anna University, Guindy');

  // Select Degree
  const selects = await page.$$('select');
  if (selects.length >= 3) {
    await selects[0].select('B.E. (Bachelor of Engineering)');
    await selects[1].select('Computer Science and Engineering (CSE)');
    await selects[2].select('3rd Year');
  }

  const saveProfBtn = await page.$('button[type="submit"]');
  if (saveProfBtn) await saveProfBtn.click();
  await delay(1500);

  // Camera permission step -> bypass for speed
  await page.evaluate(() => {
    localStorage.setItem('fiit_camera_verified', 'true');
    window.location.reload();
  });
  await delay(1500);

  // Candidate Dashboard -> Start Round 1
  page.on('dialog', async d => await d.accept());
  const takeR1Btn = await page.$('button ::-p-text(Take Round 1 Assessment)');
  if (takeR1Btn) {
    await takeR1Btn.click();
    await delay(2000);
  }

  // Capture updated 06_round1_assessment.png (25 questions, easy questions, #2F2D7D branding)
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_round1_assessment.png'), fullPage: true });
  console.log('📸 Saved 06_round1_assessment.png (25 easy questions, #2F2D7D palette)');

  // Now create a candidate who is ready for Round 3 to capture updated Round 3 (#2F2D7D & White editor)
  await mongoose.connect('mongodb://127.0.0.1:27017/fiit_recruitment');
  const r3Email = `r3_cleared_${Date.now()}@fiit.edu`;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('Password@123', salt);
  await User.create({
    name: 'Karthik Raja',
    email: r3Email,
    password: hash,
    phoneNumber: '9876543210',
    collegeName: 'Anna University',
    department: 'CSE',
    interestedRole: 'Full Stack Developer',
    yearOfStudy: 'Final Year',
    hasReadInstructions: true,
    isProfileCompleted: true,
    currentRound: 3,
    round1: { score: 25, total: 25, percentage: 100, passed: true, completedAt: new Date() },
    round2: { score: 48, total: 50, percentage: 96, passed: true, completedAt: new Date() }
  });

  await page.evaluate(() => localStorage.clear());
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await delay(1000);

  const inputs = await page.$$('input');
  await inputs[0].type(r3Email);
  await inputs[1].type('Password@123');
  const loginSubmit = await page.$('button[type="submit"]');
  await loginSubmit.click();
  await delay(2000);

  const takeR3Btn = await page.$('button ::-p-text(Take Round 3 Coding Assessment)');
  if (takeR3Btn) {
    await takeR3Btn.click();
    await delay(2000);
  }

  // Capture updated 08_round3_hackerrank_coding.png (#2F2D7D & White editor)
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_round3_hackerrank_coding.png'), fullPage: true });
  console.log('📸 Saved 08_round3_hackerrank_coding.png (#2F2D7D & White editor, no dark slate)');

  await browser.close();
  console.log('✅ ALL SCREENSHOTS SUCCESSFULLY UPDATED!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
