const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun
} = require('docx');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\kaviy\\.gemini\\antigravity\\brain\\02f284ff-f2eb-4e0d-bae7-9af156f6e4d1';
const DOCX_PATH = path.join(ARTIFACT_DIR, 'FIIT_Job_Fair_Assessment_Project_Documentation.docx');
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

function makeHeading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    text: text,
    heading: level,
    spacing: { before: 240, after: 120 }
  });
}

function makeParagraph(text, isBold = false) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: isBold,
        size: 22,
        font: 'Segoe UI'
      })
    ],
    spacing: { after: 120, line: 276 }
  });
}

function makeBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix + ' ', bold: true, size: 22, font: 'Segoe UI' }));
  }
  children.push(new TextRun({ text: text, size: 22, font: 'Segoe UI' }));

  return new Paragraph({
    children: children,
    bullet: { level: 0 },
    spacing: { after: 80, line: 260 }
  });
}

function makeImageBlock(imageFileName, captionTitle, captionDesc) {
  const imgPath = path.join(SCREENSHOT_DIR, imageFileName);
  if (!fs.existsSync(imgPath)) {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: `[Image placeholder: ${captionTitle} - file not found]`,
            color: '888888',
            italics: true
          })
        ]
      })
    ];
  }

  const imageBuffer = fs.readFileSync(imgPath);

  return [
    new Paragraph({
      children: [
        new ImageRun({
          data: imageBuffer,
          transformation: {
            width: 600,
            height: 360
          }
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 80 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Figure: ${captionTitle}`,
          bold: true,
          size: 20,
          color: '2F2D7D',
          font: 'Segoe UI'
        }),
        new TextRun({
          text: ` — ${captionDesc}`,
          size: 19,
          color: '555555',
          font: 'Segoe UI'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 }
    })
  ];
}

async function generate() {
  console.log('Generating updated Word documentation with visual screenshots...');

  const doc = new Document({
    creator: 'FIIT Engineering & Recruitment Team',
    title: 'FIIT Job Fair Candidate Assessment Platform - Technical Architecture & Operation Manual',
    description: 'Complete technical documentation, workflow guides, brand specifications, and UI walkthrough.',
    sections: [
      {
        properties: {},
        children: [
          // Cover Header
          new Paragraph({
            children: [
              new TextRun({
                text: 'FIIT RECRUITMENT PORTAL 2026',
                bold: true,
                size: 32,
                color: '2F2D7D',
                font: 'Segoe UI'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 120 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Candidate Selection & Multi-Stage Technical Assessment Platform',
                bold: true,
                size: 26,
                color: '444444',
                font: 'Segoe UI'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Brand Palette: Purple/Navy (#2F2D7D, RGB: 47, 45, 125) & Pure White (#FFFFFF)',
                bold: true,
                size: 20,
                color: '2F2D7D',
                font: 'Segoe UI'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Executive Summary
          makeHeading('1. Executive Overview & Business Objective', HeadingLevel.HEADING_1),
          makeParagraph(
            'The FIIT Job Fair Assessment Web Application is an enterprise-grade recruitment and evaluation engine designed to screen, evaluate, and select top technical candidates during university campus recruitment drives and large-scale job fairs. The platform incorporates automated multi-stage evaluation, strict single-attempt candidate allocation, dynamic domain customization, real-time code execution with automated test cases, and military-grade AI proctoring enforcement.'
          ),
          makeBullet('Frontend Architecture: React.js (Vite + Tailwind CSS) styled strictly in #2F2D7D & White with responsive modern UI.', 'Frontend:'),
          makeBullet('Backend Architecture: Node.js (Express REST API) with modular route controllers and security middleware.', 'Backend:'),
          makeBullet('Database Layer: MongoDB Compass (fiit_recruitment database) with optimized Mongoose schema indexing.', 'Database:'),
          makeBullet('Code Execution Runtimes: Native Windows Python 3.14 and Java JDK 26 sandboxed process execution.', 'Compilers:'),

          // UI Brand Guidelines
          makeHeading('2. Visual Identity & Brand Design System', HeadingLevel.HEADING_1),
          makeParagraph(
            'The platform follows a strict, elegant corporate palette designed for high contrast, maximum legibility, and official branding:'
          ),
          makeBullet('Hex Code: #2F2D7D | RGB: (47, 45, 125). Used for primary headers, logos, primary action buttons, domain badges, active question pills, and status cards.', 'Primary Color (FIIT Purple/Navy):'),
          makeBullet('Hex Code: #FFFFFF | Soft Canvas: #F8F9FD. Used for all containers, input fields, test case drawers, and high-readability text elements.', 'Secondary Color (White & Light Canvas):'),
          makeBullet('Fullscreen Mode CSS Fix: Explicit :fullscreen and ::backdrop rules enforce #F8F9FD canvas and #2F2D7D typography, preventing browser-default black inversion.', 'Fullscreen Color Preservation:'),

          // Candidate Onboarding Workflow
          makeHeading('3. Candidate Registration & Onboarding Lifecycle', HeadingLevel.HEADING_1),
          makeParagraph(
            'To ensure rapid onboarding and maximum test integrity, the candidate lifecycle follows a strict sequence:'
          ),
          makeBullet('Form strictly requests Full Name, Email Address, and Password. Cross-role autofill is strictly disabled with explicit form state resetting and autoComplete="off" / "new-password" attributes.', 'Phase 1 - Streamlined Registration (3 Fields):'),
          makeBullet('Provides clean, high-level guidance: Round 1 (Computer Based Assessment), Round 2 (Technical MCQ Assessment), Round 3 (Technical Coding Round), fullscreen requirement, camera streaming, and strict single-attempt policy. Does not disclose internal syllabus or answer keys.', 'Phase 2 - Candidate Instructions Briefing:'),
          makeBullet('Candidate provides mandatory academic details: Full Name, 10-digit Phone Number (validated: cannot start with 0, digits only), Degree selection (B.E, B.Tech, B.Sc, BCA, etc.), Department, Specialization (CSE, IT, ECE, AI & DS, etc.), Year of Study, College Name, and Technical Domain. Email and Password are intentionally locked and read-only.', 'Phase 3 - Mandatory Profile Updation:'),
          makeBullet('Immediately following profile completion, candidates are prompted to allow camera access. A live camera feed verifies readiness before unlocking the Assessment Hub.', 'Phase 4 - Webcam Permission & Readiness Check:'),

          ...makeImageBlock(
            '01_auth_register_3fields.png',
            'Candidate Registration Interface',
            'Clean registration modal strictly requesting Full Name, Email Address, and Password.'
          ),
          ...makeImageBlock(
            '02_instructions_briefing.png',
            'Assessment Instructions & Anti-Cheating Protocol',
            'Candidate briefing detailing 3-stage progression, fullscreen mandates, camera streaming, and single-attempt policy.'
          ),
          ...makeImageBlock(
            '03_mandatory_profile_update.png',
            'Mandatory Candidate Profile Updation',
            'Academic profile completion form with Degree selection, Specialization options, 10-digit phone validation, and immutable email.'
          ),
          ...makeImageBlock(
            '03b_camera_permission_prompt.png',
            'Webcam Permission & Readiness Check',
            'Dedicated camera authorization step immediately after profile update, testing video feed before assessment entry.'
          ),

          // Anti-Cheat & Single-Attempt Policy
          makeHeading('4. AI Proctoring & Strict Single-Attempt Policy', HeadingLevel.HEADING_1),
          makeParagraph(
            'The assessment incorporates an active client-side proctoring harness with strict 2-strike penalty enforcement:'
          ),
          makeBullet('Every candidate receives strictly ONE attempt. Once initiated, exiting midway without submitting locks the assessment permanently by candidate email.', 'Single Attempt Enforced:'),
          makeBullet('Webcam feed runs continuously in a top-right floating badge (positioned at top-20 right-6), ensuring the bottom Next and Previous buttons remain completely visible and unobstructed.', 'Live Camera Bubble (No Overlap):'),
          makeBullet('Fullscreen mode is mandatory. Minimizing or switching tabs immediately flags a violation.', 'Fullscreen Enforcement:'),
          makeBullet('Clipboard copy (Ctrl+C), paste (Ctrl+V), cut (Ctrl+X), right-click context menu, and PrintScreen screenshot keys are intercepted and recorded.', 'Anti-Copy & Anti-Screenshot:'),
          makeBullet('Strike 1 displays an urgent violation warning popup. Strike 2 immediately terminates the assessment, records the exact exit reason (e.g., "Terminated: Copy & Paste Violation"), and locks the candidate session.', 'Two-Strike Disqualification:'),

          ...makeImageBlock(
            '04_candidate_dashboard.png',
            'Candidate Assessment Dashboard',
            'Candidate portal displaying selected domain badge, academic credentials, 3-round cards, and real-time cutoff thresholds.'
          ),
          ...makeImageBlock(
            '05_reentry_blocked_notice.png',
            'Single-Attempt Email Re-entry Restriction',
            'Assessment locked state showing Take Assessment button disabled with security notice when candidate exits midway.'
          ),

          // Three Evaluation Rounds
          makeHeading('5. Three-Stage Assessment Architecture', HeadingLevel.HEADING_1),

          makeHeading('Round 1: Computer Based Assessment (25 MCQs)', HeadingLevel.HEADING_2),
          makeParagraph(
            'All candidates undergo 25 core computer science questions. Cutoff is configured to 60% (15 marks). Passing Round 1 is required to unlock Round 2.'
          ),
          ...makeImageBlock(
            '06_round1_assessment.png',
            'Round 1 Assessment Interface',
            'MCQ interface with active timer, live webcam proctoring widget at top-right, unobstructed Next button, and #2F2D7D branding.'
          ),

          makeHeading('Round 2: Technical MCQ Assessment (50 MCQs)', HeadingLevel.HEADING_2),
          makeParagraph(
            'Questions in Round 2 are dynamically filtered based on the candidate\'s selected domain (Full Stack Developer, Data Analyst, Frontend Developer, Backend Developer, Python Developer, or Java Developer). Passing threshold is 70% (35 marks). Candidates scoring between 60% and 69% enter Borderline Review for Admin approval.'
          ),
          ...makeImageBlock(
            '07_round2_domain_mcqs.png',
            'Round 2 Domain-Based Technical MCQs',
            'Technical round dynamically mapped to selected domain with 50 questions and multi-topic categorization.'
          ),

          makeHeading('Round 3: Domain Technical Coding Assessment (4 Problems)', HeadingLevel.HEADING_2),
          makeParagraph(
            'Round 3 delivers a dual-pane coding environment featuring 4 Medium-difficulty algorithmic problems. Candidates can toggle between Python 3.14 and Java JDK 26. Each problem is evaluated against 5 automated test cases with live input, expected output, candidate output, execution time, and error tracebacks.'
          ),
          ...makeImageBlock(
            '08_round3_hackerrank_coding.png',
            'Round 3 Technical Coding Platform',
            'Split-pane IDE showing problem scenario, constraints, sample I/O on left; code editor, language selector, and 5 test cases on right.'
          ),

          // Admin Management Suite
          makeHeading('6. Comprehensive Recruiter / Admin Management Suite', HeadingLevel.HEADING_1),
          makeParagraph(
            'The Administrator Portal provides complete oversight and dynamic control over the recruitment drive:'
          ),
          makeBullet('View complete profiles, academic degrees, phone numbers, and scorecards of all candidates. Displays students who cleared all 3 rounds.', 'Candidate Evaluations Roster:'),
          makeBullet('When a candidate is terminated due to anti-cheating violations (e.g. Copy & Paste, Fullscreen exit), the Admin portal highlights the exact trigger reason with a red violation badge.', 'Violation & Exit Reason Transparency:'),
          makeBullet('Admins can review borderline candidates (score 30-34 in Round 2) and click "Approve Round 3" to grant clearance.', 'Borderline Clearance:'),
          makeBullet('Admins can locate any candidate blocked due to midway exit and click "Reset Candidate Access" to restore access.', 'Re-entry Reset:'),
          makeBullet('Adjust Round 1, Round 2, and Round 3 durations in minutes, set exam scheduling start/end windows, and configure passing cutoff percentages.', 'Timing, Scheduling & Cutoff Management:'),
          makeBullet('Complete Add, Edit, and Delete access for questions across Round 1, Round 2 (all domains), and Round 3.', 'Question Bank CRUD Engine:'),

          ...makeImageBlock(
            '09_admin_dashboard_candidates.png',
            'Admin Portal: Candidate Evaluations & Exit Reason Display',
            'Recruiter candidate roster showing academic degrees, cleared badges, copy-paste violation flags, borderline approvals, and re-entry resets.'
          ),
          ...makeImageBlock(
            '10_admin_timing_scheduling_cutoffs.png',
            'Admin Portal: Timing, Scheduling & Cutoff Controls',
            'Recruiter control panel to configure assessment durations, active exam windows, and passing cutoff percentages.'
          ),
          ...makeImageBlock(
            '11_admin_question_bank_crud.png',
            'Admin Portal: Question Bank CRUD Management',
            'Full management suite allowing recruiters to Add, Edit, and Delete questions across all rounds and domains.'
          ),

          // Conclusion
          makeHeading('7. Conclusion & Verification Summary', HeadingLevel.HEADING_1),
          makeParagraph(
            'All specified requirements have been fully developed, rigorously tested, and validated in the live local environment. The application is completely ready for deployment at university job fairs and enterprise recruitment events.'
          )
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(DOCX_PATH, buffer);
  console.log(`✅ Word Document successfully generated and written to: ${DOCX_PATH}`);
}

generate().catch(err => {
  console.error('❌ Failed to generate docx:', err);
  process.exit(1);
});
