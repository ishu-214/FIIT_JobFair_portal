const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function captureAll() {
  console.log('Starting screenshot capture...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1440,900',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream'
    ],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();

  // 1. Candidate Login / Register Portal
  console.log('1. Capturing Login Portal...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await wait(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_login_portal.png') });

  // 2. Admin Portal Tab
  console.log('2. Capturing Admin Portal Tab...');
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate((el) => el.innerText, b);
    if (text.includes('Admin Portal')) {
      await b.click();
      break;
    }
  }
  await wait(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_admin_login_tab.png') });

  // 3. Admin Recruiter Dashboard
  console.log('3. Capturing Admin Recruiter Dashboard...');
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) await submitBtn.click();
  await wait(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_admin_recruiter_dashboard.png') });

  // Logout from Admin
  const logoutBtn = await page.$('button[title="Logout"]');
  if (logoutBtn) await logoutBtn.click();
  await wait(1000);

  // 4. Register a fresh Candidate: Arjun Kumar
  console.log('4. Registering Candidate for Candidate Flow...');
  const tabBtns = await page.$$('button');
  for (const b of tabBtns) {
    const text = await page.evaluate((el) => el.innerText, b);
    if (text === 'Register') {
      await b.click();
      break;
    }
  }
  await wait(800);

  const testEmail = `arjun_${Date.now()}@example.com`;
  await page.type('input[placeholder*="Rahul Sharma"]', 'Arjun Kumar');
  await page.type('input[placeholder="9876543210"]', '9840112233');
  await page.type('input[placeholder="College Name"]', 'PSG College of Technology');
  await page.type('input[type="email"]', testEmail);
  await page.type('input[type="password"]', 'password123');

  await page.click('button[type="submit"]');
  await wait(2000);

  // 5. Candidate Dashboard
  console.log('5. Capturing Candidate Roadmap Dashboard...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_candidate_dashboard.png') });

  // 6. Round 1 MCQ Assessment
  console.log('6. Capturing Round 1 MCQ Assessment...');
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const txt = await page.evaluate((el) => el.innerText, b);
    if (txt.includes('Take Round 1 Test')) {
      await b.click();
      break;
    }
  }
  await wait(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_round1_mcq_assessment.png') });

  // 7. Answer Round 1 questions & Submit
  console.log('7. Answering Round 1 questions...');
  for (let i = 0; i < 4; i++) {
    const optionBtns = await page.$$('button[type="button"]');
    if (optionBtns.length > 2) {
      await optionBtns[1].click();
      await wait(200);
    }
    for (const b of await page.$$('button')) {
      const txt = await page.evaluate((el) => el.innerText, b);
      if (txt.includes('Next Question')) {
        await b.click();
        break;
      }
    }
    await wait(200);
  }

  // Click Finish & Submit
  page.on('dialog', async (dialog) => {
    try {
      await dialog.accept();
    } catch (e) {}
  });

  for (const b of await page.$$('button')) {
    const txt = await page.evaluate((el) => el.innerText, b);
    if (txt.includes('Finish & Submit') || txt.includes('Submit Assessment')) {
      await b.click();
      break;
    }
  }
  await wait(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_round1_result_screen.png') });

  // Click Return to Dashboard
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate((el) => el.innerText, b);
    if (txt.includes('Return to Dashboard') || txt.includes('Take Next Round')) {
      await b.click();
      break;
    }
  }
  await wait(1500);

  // 8. Capture Round 3 Coding Environment (login with Karthik who has Round 3 unlocked)
  console.log('8. Capturing Round 3 Coding Environment with Karthik...');
  const curLogout = await page.$('button[title="Logout"]');
  if (curLogout) await curLogout.click();
  await wait(1000);

  await page.type('input[type="email"]', 'karthik@example.com');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await wait(2000);

  for (const b of await page.$$('button')) {
    const txt = await page.evaluate((el) => el.innerText, b);
    if (txt.includes('Coding Assessment') || txt.includes('Launch Coding')) {
      await b.click();
      break;
    }
  }
  await wait(2000);

  for (const b of await page.$$('button')) {
    const txt = await page.evaluate((el) => el.innerText, b);
    if (txt.includes('Run Code')) {
      await b.click();
      break;
    }
  }
  await wait(3000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_round3_coding_environment.png') });

  // 9. Capture Proctoring Warning Modal
  console.log('9. Capturing Proctoring Warning Modal...');
  await page.evaluate(() => {
    window.dispatchEvent(new Event('blur'));
  });
  await wait(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_proctoring_violation_modal.png') });

  console.log('All screenshots captured successfully!');
  await browser.close();
  process.exit(0);
}

captureAll().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
