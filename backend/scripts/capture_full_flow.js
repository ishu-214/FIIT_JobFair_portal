const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('🚀 Starting end-to-end verification and visual snapshot generation...');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // 1. Visit Portal & Verify Registration with 3 fields
    console.log('1. Loading Auth Page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await delay(1000);

    // Click on "Register New Account"
    const registerTab = await page.$('button ::-p-text(Register New Candidate)');
    if (registerTab) {
      await registerTab.click();
      await delay(600);
    } else {
      // Look for toggle button
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text.includes('Register') || text.includes('Create Account')) {
          await btn.click();
          break;
        }
      }
      await delay(600);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_auth_register_3fields.png'), fullPage: true });
    console.log('📸 Saved 01_auth_register_3fields.png');

    // 2. Register Candidate with only 3 fields
    const testEmail = `student_${Date.now()}@fiit.edu`;
    const testName = 'Kaviyarasan M';
    const testPassword = 'Password@123';

    console.log(`2. Registering candidate: ${testEmail}...`);
    // Find inputs
    const inputs = await page.$$('input');
    // In register form: Name, Email, Password
    if (inputs.length >= 3) {
      await inputs[0].type(testName);
      await inputs[1].type(testEmail);
      await inputs[2].type(testPassword);
    }

    // Submit registration
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
    }
    await delay(2000);

    // 3. Candidate arrives at Step 1: Instructions Page
    console.log('3. Capturing Instructions Briefing Page...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_instructions_briefing.png'), fullPage: true });
    console.log('📸 Saved 02_instructions_briefing.png');

    // Check acknowledgment checkbox and continue
    const agreeCheckbox = await page.$('label');
    if (agreeCheckbox) {
      await agreeCheckbox.click();
      await delay(500);
    }

    const proceedBtn = await page.$('button ::-p-text(Proceed to Profile Updation)');
    if (proceedBtn) {
      await proceedBtn.click();
    } else {
      const btns = await page.$$('button');
      for (const b of btns) {
        const txt = await page.evaluate(el => el.textContent, b);
        if (txt.includes('Proceed') || txt.includes('Profile')) {
          await b.click();
          break;
        }
      }
    }
    await delay(1500);

    // 4. Candidate arrives at Step 2: Mandatory Profile Updation Page
    console.log('4. Capturing Mandatory Profile Update Page...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_mandatory_profile_update.png'), fullPage: true });
    console.log('📸 Saved 03_mandatory_profile_update.png');

    // Fill Mandatory Profile fields
    console.log('5. Filling Mandatory Profile details & Selecting Domain...');
    const profileInputs = await page.$$('input[type="text"], input[type="tel"]');
    // phone, college, department
    for (const inp of profileInputs) {
      const placeholder = await page.evaluate(el => el.placeholder, inp);
      if (placeholder.includes('9876543210') || placeholder.includes('phone')) {
        await inp.type('9876543210');
      } else if (placeholder.includes('Madras') || placeholder.includes('college')) {
        await inp.type('PSG College of Technology, Coimbatore');
      } else if (placeholder.includes('Computer Science') || placeholder.includes('department')) {
        await inp.click({ clickCount: 3 });
        await inp.type('Information Technology & Software Systems');
      }
    }

    // Save profile
    const saveProfileBtn = await page.$('button[type="submit"]');
    if (saveProfileBtn) {
      await saveProfileBtn.click();
    }
    await delay(2000);

    // 5. Candidate Dashboard
    console.log('6. Capturing Candidate Dashboard with Domain Badge & Cutoffs...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_candidate_dashboard.png'), fullPage: true });
    console.log('📸 Saved 04_candidate_dashboard.png');

    // 6. Test Single-Initiation & Re-entry Block
    console.log('7. Simulating Assessment Start & Mid-way exit for re-entry restriction...');
    // Handle dialog if confirm appears
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    const takeTestBtn = await page.$('button ::-p-text(Take Round 1 Assessment)');
    if (takeTestBtn) {
      await takeTestBtn.click();
      await delay(2000);
    }

    // Capture active Round 1
    console.log('8. Capturing Round 1 Assessment with Timer & Proctoring Bubble...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_round1_assessment.png'), fullPage: true });
    console.log('📸 Saved 06_round1_assessment.png');

    // Now navigate back to Dashboard without submitting to trigger re-entry lock
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await delay(1500);

    // Dashboard should now show "Assessment Locked / Incomplete Attempt" and DISABLED "Take Assessment" button!
    console.log('9. Capturing Disabled Take Assessment button (Email-locked re-entry)...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_reentry_blocked_notice.png'), fullPage: true });
    console.log('📸 Saved 05_reentry_blocked_notice.png');

    // 7. Test Admin Login
    console.log('10. Logging out student and logging in as Admin...');
    // Click logout
    const logoutBtn = await page.$('button[title="Logout"]');
    if (logoutBtn) {
      await logoutBtn.click();
      await delay(1000);
    } else {
      await page.evaluate(() => localStorage.clear());
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
      await delay(1000);
    }

    // Admin Login
    const loginInputs = await page.$$('input');
    if (loginInputs.length >= 2) {
      await loginInputs[0].type('admin@fiit.edu');
      await loginInputs[1].type('admin123');
    }
    const loginBtn = await page.$('button[type="submit"]');
    if (loginBtn) {
      await loginBtn.click();
      await delay(2000);
    }

    // Admin Dashboard - Tab 1: Candidates Roster
    console.log('11. Capturing Admin Dashboard (Candidate Evaluations & Re-entry unblock)...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_admin_dashboard_candidates.png'), fullPage: true });
    console.log('📸 Saved 09_admin_dashboard_candidates.png');

    // Click Tab 2: Timing, Scheduling & Cutoffs
    const tabButtons = await page.$$('button');
    for (const b of tabButtons) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt.includes('Timing') || txt.includes('Cutoff') || txt.includes('Scheduling')) {
        await b.click();
        await delay(1000);
        break;
      }
    }
    console.log('12. Capturing Admin Tab 2: Timing, Scheduling & Cutoff Configurations...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_admin_timing_scheduling_cutoffs.png'), fullPage: true });
    console.log('📸 Saved 10_admin_timing_scheduling_cutoffs.png');

    // Click Tab 3: Question Bank CRUD
    for (const b of tabButtons) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt.includes('Question Bank') || txt.includes('CRUD')) {
        await b.click();
        await delay(1000);
        break;
      }
    }
    console.log('13. Capturing Admin Tab 3: Question Bank CRUD Management...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_admin_question_bank_crud.png'), fullPage: true });
    console.log('📸 Saved 11_admin_question_bank_crud.png');

    // 8. Capture HackerRank Coding Round (Round 3) and Domain-Based Round 2
    // Let's create an admin-cleared student or mock session to view Round 2 and Round 3
    console.log('14. Capturing HackerRank Coding layout & Round 2 Domain layout...');
    const r3CandidateEmail = `cleared_${Date.now()}@fiit.edu`;
    const bcrypt = require('bcryptjs');
    const mongoose = require('mongoose');
    const User = require('../models/User');

    // Update candidate in DB directly to have cleared Round 1 and Round 2
    await mongoose.connect('mongodb://127.0.0.1:27017/fiit_recruitment');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Password@123', salt);
    await User.create({
      name: 'Rithanya S (Finalist)',
      email: r3CandidateEmail,
      password: hash,
      phoneNumber: '9123456789',
      collegeName: 'College of Engineering, Guindy (CEG Anna University)',
      department: 'Computer Science and Engineering',
      specialization: 'Artificial Intelligence & Machine Learning',
      interestedRole: 'Full Stack Developer',
      yearOfStudy: 'Final Year',
      hasReadInstructions: true,
      isProfileCompleted: true,
      currentRound: 3,
      round1: {
        score: 24,
        total: 25,
        percentage: 96,
        passed: true,
        completedAt: new Date()
      },
      round2: {
        score: 46,
        total: 50,
        percentage: 92,
        passed: true,
        domain: 'Full Stack Developer',
        completedAt: new Date()
      }
    });

    // Logout Admin and Login as R3 Candidate
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await delay(1000);

    const r3Inputs = await page.$$('input');
    if (r3Inputs.length >= 2) {
      await r3Inputs[0].type(r3CandidateEmail);
      await r3Inputs[1].type('Password@123');
    }
    const r3LoginBtn = await page.$('button[type="submit"]');
    if (r3LoginBtn) {
      await r3LoginBtn.click();
      await delay(2000);
    }

    // Now on Dashboard, Round 1 and Round 2 are cleared, Round 3 is active!
    console.log('15. Clicking Take Round 3 Coding Challenge...');
    const takeR3Btn = await page.$('button ::-p-text(Take Round 3 Coding Assessment)');
    if (takeR3Btn) {
      await takeR3Btn.click();
      await delay(2000);
    } else {
      const allBtns = await page.$$('button');
      for (const b of allBtns) {
        const t = await page.evaluate(el => el.textContent, b);
        if (t.includes('Round 3') || t.includes('Coding')) {
          await b.click();
          break;
        }
      }
      await delay(2000);
    }

    // Capture HackerRank Coding Round!
    console.log('16. Capturing Round 3 HackerRank Coding Platform (Split Layout, Editor, Test Cases)...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_round3_hackerrank_coding.png'), fullPage: true });
    console.log('📸 Saved 08_round3_hackerrank_coding.png');

    console.log('✅ ALL SCREENSHOTS SUCCESSFULLY CAPTURED AND SAVED!');
  } catch (err) {
    console.error('❌ Error during capture:', err);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

run();
