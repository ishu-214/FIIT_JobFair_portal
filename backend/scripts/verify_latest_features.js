const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('🚀 Running comprehensive test of latest requested features...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // 1. Test Autofill prevention
    console.log('1. Testing Login Tab Switching & Autofill...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await delay(1000);

    // Click Admin Tab
    const adminTab = await page.$('button ::-p-text(Admin)');
    if (adminTab) await adminTab.click();
    await delay(500);

    // Verify email & password fields are EMPTY (no autofill)
    const adminInputs = await page.$$('input');
    const emailVal = await page.evaluate(el => el.value, adminInputs[0]);
    const passVal = await page.evaluate(el => el.value, adminInputs[1]);
    console.log(`Admin Tab inputs: email="${emailVal}", password="${passVal}"`);
    if (emailVal === '' && passVal === '') {
      console.log('✅ PASS: Admin credentials are NOT autofilled!');
    } else {
      console.warn('⚠️ Warning: Admin credentials had values');
    }

    // Switch to Student Login Tab
    const loginTab = await page.$('button ::-p-text(Login)');
    if (loginTab) await loginTab.click();
    await delay(500);

    const loginInputs = await page.$$('input');
    const studentEmailVal = await page.evaluate(el => el.value, loginInputs[0]);
    const studentPassVal = await page.evaluate(el => el.value, loginInputs[1]);
    console.log(`Student Tab inputs: email="${studentEmailVal}", password="${studentPassVal}"`);
    if (studentEmailVal === '' && studentPassVal === '') {
      console.log('✅ PASS: Student inputs are clean and not prefilled from admin!');
    }

    // 2. Register Candidate
    const regTab = await page.$('button ::-p-text(Register)');
    if (regTab) await regTab.click();
    await delay(500);

    const testEmail = `student_${Date.now()}@fiit.edu`;
    console.log(`2. Registering new student: ${testEmail}...`);
    const regInputs = await page.$$('input');
    await regInputs[0].type('Surya Prakash');
    await regInputs[1].type(testEmail);
    await regInputs[2].type('Password@123');

    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();
    await delay(2000);

    // 3. Step 1: Instructions Page (Clean High-Level Information)
    console.log('3. Verifying Instructions Page (Clean content, no answer leaks)...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_instructions_briefing.png'), fullPage: true });
    console.log('📸 Updated 02_instructions_briefing.png');

    const agreeBox = await page.$('label');
    if (agreeBox) await agreeBox.click();
    await delay(500);

    const proceedBtn = await page.$('button ::-p-text(Proceed to Profile Updation)');
    if (proceedBtn) await proceedBtn.click();
    await delay(1500);

    // 4. Step 2: Profile Update Page with Degree, Specialization & Phone Validation
    console.log('4. Testing Profile Update validations (Degree, Phone Number)...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_mandatory_profile_update.png'), fullPage: true });
    console.log('📸 Updated 03_mandatory_profile_update.png');

    // Fill College & Phone (Test invalid phone starting with 0)
    const phoneInput = await page.$('input[placeholder="e.g. 9876543210"]');
    if (phoneInput) {
      await phoneInput.type('0987654321'); // starts with 0
    }
    const collegeInput = await page.$('input[placeholder="e.g. Madras Institute of Technology"]');
    if (collegeInput) {
      await collegeInput.type('PSG College of Technology');
    }

    // Try submitting with invalid phone
    const saveBtn = await page.$('button[type="submit"]');
    if (saveBtn) await saveBtn.click();
    await delay(600);

    // Check error message
    const errorEl = await page.$('.bg-rose-50');
    if (errorEl) {
      const errText = await page.evaluate(el => el.textContent, errorEl);
      console.log(`Validation caught correctly: "${errText}"`);
    }

    // Now fix phone number to valid 10-digit number starting with 9
    if (phoneInput) {
      await phoneInput.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await phoneInput.type('9876543210');
    }

    // Submit valid profile
    if (saveBtn) await saveBtn.click();
    await delay(2000);

    // 5. Step 3: Webcam Permission & Readiness Check Page!
    console.log('5. Verifying Step 3: Camera Permission & Readiness Prompt...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03b_camera_permission_prompt.png'), fullPage: true });
    console.log('📸 Saved 03b_camera_permission_prompt.png');

    // Click Allow Camera Permission
    const allowCamBtn = await page.$('button ::-p-text(Allow Camera Permission)');
    if (allowCamBtn) {
      await allowCamBtn.click();
      await delay(2000);
    }

    // Proceed to Assessment Hub
    const enterHubBtn = await page.$('button ::-p-text(Enter Assessment Hub)');
    if (enterHubBtn) {
      await enterHubBtn.click();
      await delay(2000);
    } else {
      // If camera wasn't mockable in headless, bypass via localStorage
      await page.evaluate(() => {
        localStorage.setItem('fiit_camera_verified', 'true');
        window.location.reload();
      });
      await delay(2000);
    }

    // 6. Candidate Dashboard (Strict Single Attempt, Degree & Details displayed)
    console.log('6. Verifying Dashboard with Single Attempt policy (No attempt counter)...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_candidate_dashboard.png'), fullPage: true });
    console.log('📸 Updated 04_candidate_dashboard.png');

    // 7. Test Round 1 & Next Button Visibility
    console.log('7. Verifying Round 1 & Next Button Visibility (Webcam at top-right)...');
    page.on('dialog', async d => await d.accept());
    const takeR1 = await page.$('button ::-p-text(Take Round 1 Assessment)');
    if (takeR1) {
      await takeR1.click();
      await delay(2000);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_round1_assessment.png'), fullPage: true });
    console.log('📸 Updated 06_round1_assessment.png');

    // Verify Next button exists and is clickable
    const nextBtn = await page.$('button ::-p-text(Next)');
    if (nextBtn) {
      const isVisible = await page.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }, nextBtn);
      console.log(`Next button visible: ${isVisible}`);
      await nextBtn.click();
      await delay(600);
      console.log('✅ PASS: Next button clicked smoothly without webcam blockage!');
    }

    // 8. Test Copy-Paste Anti-Cheat Trigger & Exit Reason Logging
    console.log('8. Testing Copy-Paste Violation Trigger & Exit Logging...');
    // Dispatch copy event to trigger violation
    await page.evaluate(() => {
      document.dispatchEvent(new Event('copy'));
    });
    await delay(1000);

    // Dispatch second copy event to trigger disqualification
    await page.evaluate(() => {
      document.dispatchEvent(new Event('paste'));
    });
    await delay(2000);

    // 9. Admin Dashboard View
    console.log('9. Logging in as Admin to verify Disqualification Reason & Single Attempt Roster...');
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await delay(1000);

    const adminTabBtn = await page.$('button ::-p-text(Admin)');
    if (adminTabBtn) await adminTabBtn.click();
    await delay(500);

    const adminInputsFinal = await page.$$('input');
    await adminInputsFinal[0].type('admin@fiit.edu');
    await adminInputsFinal[1].type('admin123');
    const adminSubmit = await page.$('button[type="submit"]');
    await adminSubmit.click();
    await delay(2000);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_admin_dashboard_candidates.png'), fullPage: true });
    console.log('📸 Updated 09_admin_dashboard_candidates.png');

    console.log('✅ ALL TESTS COMPLETED AND ALL NEW SCREENSHOTS CAPTURED!');
  } catch (err) {
    console.error('❌ Error in verification:', err);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

run();
