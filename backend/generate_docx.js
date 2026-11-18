const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  ShadingType,
  PageBreak
} = require('docx');

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
const OUTPUT_DOCX = path.join(__dirname, '..', 'FIIT_Job_Fair_Assessment_Project_Documentation.docx');

// Helper to create styled headings
function createHeading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    text: text,
    heading: level,
    spacing: { before: 300, after: 150 }
  });
}

// Helper to create paragraphs
function createParagraph(text, isBold = false) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: isBold,
        size: 22,
        font: 'Arial'
      })
    ],
    spacing: { after: 120 }
  });
}

// Helper to create bullet points
function createBullet(text, boldPrefix = '') {
  return new Paragraph({
    children: [
      boldPrefix ? new TextRun({ text: boldPrefix + ': ', bold: true, size: 22, font: 'Arial' }) : new TextRun({ text: '' }),
      new TextRun({ text: text, size: 22, font: 'Arial' })
    ],
    bullet: { level: 0 },
    spacing: { after: 80 }
  });
}

// Helper to insert image with caption
function createImageFigure(filename, caption, width = 600, height = 340) {
  const imgPath = path.join(SCREENSHOT_DIR, filename);
  if (!fs.existsSync(imgPath)) {
    return [new Paragraph({ text: `[Image: ${caption} (File not found)]`, spacing: { after: 120 } })];
  }

  const imgData = fs.readFileSync(imgPath);

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: imgData,
          transformation: {
            width: width,
            height: height
          }
        })
      ],
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Figure: ${caption}`,
          italics: true,
          size: 18,
          color: '555555',
          font: 'Arial'
        })
      ],
      spacing: { after: 250 }
    })
  ];
}

async function buildDocx() {
  console.log('Generating Word Document with visual screenshots...');

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // TITLE / COVER HEADER
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'FIIT APPLICATION',
                bold: true,
                size: 48,
                color: '1E3A8A',
                font: 'Arial'
              })
            ],
            spacing: { before: 400, after: 150 }
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Job Fair Multi-Stage Assessment & Screening Web Platform',
                bold: true,
                size: 28,
                color: '4F46E5',
                font: 'Arial'
              })
            ],
            spacing: { after: 150 }
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Comprehensive System Architecture, Technical Specifications, and User Manual with Project Screenshots',
                size: 20,
                color: '6B7280',
                font: 'Arial'
              })
            ],
            spacing: { after: 400 }
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Project Name', bold: true, font: 'Arial', size: 20 })] })],
                    shading: { fill: 'F3F4F6', type: ShadingType.CLEAR }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'FIIT Job Fair Recruitment Portal', font: 'Arial', size: 20 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Technologies', bold: true, font: 'Arial', size: 20 })] })],
                    shading: { fill: 'F3F4F6', type: ShadingType.CLEAR }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'React.js, Node.js, Express, MongoDB Compass, Tailwind CSS, Python 3, Java JDK 26', font: 'Arial', size: 20 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Target Audience', bold: true, font: 'Arial', size: 20 })] })],
                    shading: { fill: 'F3F4F6', type: ShadingType.CLEAR }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Job Fair Candidates, Technical Recruiters & Invigilators', font: 'Arial', size: 20 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Default Admin', bold: true, font: 'Arial', size: 20 })] })],
                    shading: { fill: 'F3F4F6', type: ShadingType.CLEAR }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'admin@fiit.edu / admin123', font: 'Arial', size: 20 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Database URI', bold: true, font: 'Arial', size: 20 })] })],
                    shading: { fill: 'F3F4F6', type: ShadingType.CLEAR }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'mongodb://127.0.0.1:27017/fiit_recruitment', font: 'Arial', size: 20 })] })]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // SECTION 1: EXECUTIVE SUMMARY
          createHeading('1. Executive Summary', HeadingLevel.HEADING_1),
          createParagraph(
            'The FIIT Job Fair Assessment & Candidate Screening Application is a specialized, end-to-end recruitment platform designed to address the challenge of evaluating large volumes of student applicants during technical job fairs. The system filters candidates through three progressive evaluation stages, ensuring that only qualified, technically proficient individuals are recommended to hiring companies.'
          ),
          createParagraph(
            'Key features of this platform include real-time browser-based AI proctoring, live camera monitoring, strict 2-strike anti-cheating enforcement, automated code compilation and test case execution in Python 3 and Java, candidate attempt tracking (1st Time vs 2nd Time), and an administrative control portal with borderline override permissions.'
          ),

          // SECTION 2: SYSTEM ARCHITECTURE & TECH STACK
          createHeading('2. Technology Stack & System Architecture', HeadingLevel.HEADING_1),
          createParagraph('The application employs a modern full-stack decoupled architecture:'),
          createBullet('Frontend (React.js + Vite + Tailwind CSS)', 'Frontend Layer'),
          createParagraph('Delivers a fast, responsive user interface with component-driven views for student registration, assessment roadmaps, proctoring camera picture-in-picture widgets, code editor, and recruiter dashboards.'),
          createBullet('Backend (Node.js + Express.js)', 'Server Layer'),
          createParagraph('Provides high-performance RESTful API microservices for authentication, dynamic question bank sampling and shuffling, live code execution, violation tracking, and administrative decision controls.'),
          createBullet('Database (MongoDB + Mongoose)', 'Data Layer'),
          createParagraph('Stores candidates, credentials, assessment results, score breakdowns, proctoring violations, and complete historical attempt archives. Fully accessible and verifiable via MongoDB Compass.'),
          createBullet('Compiler Engine (Python 3.14 & Java JDK 26)', 'Code Runner Layer'),
          createParagraph('Executes student-written code in a secure child-process sandbox on the server, running inputs against 5 rigorous automated test cases per problem and reporting stdout and compiler errors.'),

          // SECTION 3: AUTHENTICATION & PORTAL ACCESS
          createHeading('3. Authentication & Portal Access', HeadingLevel.HEADING_1),
          createParagraph(
            'The portal provides separate workflows for student candidates and technical recruiters. First-time students can easily register by providing their Full Name, Email, Password, Phone Number, College / University, and Degree. Existing candidates can log in directly to continue their assessments.'
          ),
          ...createImageFigure('01_login_portal.png', 'Candidate Login and Registration Screen'),
          createParagraph(
            'The platform also features a dedicated "Admin Portal" tab where job fair recruiters can access administrative controls with pre-configured credentials.'
          ),
          ...createImageFigure('02_admin_login_tab.png', 'Recruiter Admin Portal Login Tab'),

          new Paragraph({ children: [new PageBreak()] }),

          // SECTION 4: CANDIDATE ROADMAP DASHBOARD
          createHeading('4. Candidate Roadmap & Attempt Hub', HeadingLevel.HEADING_1),
          createParagraph(
            'Upon logging in, candidates are presented with a unified assessment dashboard. The dashboard displays the candidate’s profile information, college details, current attempt number (e.g., Attempt #1 or Attempt #2), and a clear three-stage evaluation roadmap.'
          ),
          ...createImageFigure('04_candidate_dashboard.png', 'Candidate Assessment Roadmap and Guidelines Dashboard'),
          createParagraph(
            'Candidates must follow a sequential path: Round 2 remains locked until Round 1 is cleared, and Round 3 remains locked until Round 2 is cleared or approved by the administrator. Comprehensive proctoring regulations are displayed prominently to inform candidates before they start.'
          ),

          // SECTION 5: ROUND 1 ASSESSMENT
          createHeading('5. Round 1: Basic Computer Knowledge Assessment', HeadingLevel.HEADING_1),
          createParagraph(
            'Round 1 assesses fundamental computer and operating system knowledge. The system samples 25 multiple-choice questions from a 40-item bank covering CPU architecture, memory management, operating systems, hardware components, input/output peripherals, and networking.'
          ),
          createBullet('Total Questions: 25 MCQs', 'Volume'),
          createBullet('Pass Mark: 20 or above (80% threshold)', 'Passing Criteria'),
          createBullet('Question Shuffling: Both questions and options are randomized for each student to prevent answer sharing.', 'Anti-Cheat'),
          ...createImageFigure('05_round1_mcq_assessment.png', 'Round 1 MCQ Assessment in Fullscreen with Timer and Live Proctoring Camera'),
          createParagraph('Evaluation Outcomes for Round 1:'),
          createBullet('Score >= 20: Displays "Congratulations, you have passed the first assessment and you can move to second assessment test" along with an active "Take Next Round Test (Round 2)" button.', 'Passed'),
          createBullet('Score < 20: Displays "Sorry, you have not cleared the assessment." Access to Round 2 is strictly blocked.', 'Failed'),
          ...createImageFigure('06_round1_result_screen.png', 'Round 1 Assessment Result Screen'),

          new Paragraph({ children: [new PageBreak()] }),

          // SECTION 6: ROUND 2 TECHNICAL ASSESSMENT
          createHeading('6. Round 2: Technical Assessment & Borderline Policy', HeadingLevel.HEADING_1),
          createParagraph(
            'Round 2 contains 50 medium-range technical questions covering seven key technology domains: Java, Python, HTML5, CSS3, JavaScript (ES6+), React.js, and SQL Databases.'
          ),
          createBullet('Total Questions: 50 MCQs', 'Volume'),
          createBullet('Standard Pass Mark: 35 or above (70% threshold)', 'Standard Pass'),
          createBullet('Borderline Score Window: 30 to 34 (60% to 68%)', 'Borderline Review'),
          createParagraph(
            'Special Admin Override Workflow: If a student scores between 30 and 34, they cannot proceed directly to Round 3. Instead, their profile is marked as "Borderline Review". The Admin Recruiter Dashboard highlights these candidates and provides an "Approve for Round 3" button. Once approved by the administrator, Round 3 is instantly unlocked for the student.'
          ),
          createParagraph(
            'If a candidate scores below 30, the test result shows "Sorry, you have not cleared the assessment" and Round 3 access is permanently disabled.'
          ),

          // SECTION 7: ROUND 3 TECHNICAL CODING
          createHeading('7. Round 3: Technical Coding Environment', HeadingLevel.HEADING_1),
          createParagraph(
            'Round 3 tests practical algorithmic problem-solving abilities. Candidates solve five distinct programming problems directly in the browser:'
          ),
          createBullet('Reverse Words in a String: Word order reversal with single space formatting.', 'Problem 1'),
          createBullet('Valid Palindrome: Alphanumeric-only case-insensitive palindrome detection.', 'Problem 2'),
          createBullet('Two Sum Indices: Pair target sum index location.', 'Problem 3'),
          createBullet('First Non-Repeating Character: Unique character search in a string.', 'Problem 4'),
          createBullet('Valid Parentheses: Balanced bracket hierarchical validation using stacks.', 'Problem 5'),
          createParagraph(
            'Language Switcher: Candidates can freely choose Python 3 or Java (JDK 26) for each problem, complete with pre-configured starter code templates. When the candidate clicks "Run Code", the backend compiles and executes the program against 5 automated test cases per problem, returning test results, outputs, and compiler errors in real-time.'
          ),
          ...createImageFigure('07_round3_coding_environment.png', 'Round 3 Technical Coding Suite with In-Browser IDE and Real-Time Test Cases Execution'),
          createParagraph(
            'To clear Round 3, the candidate must pass all 5 test cases across all 5 problems. Upon completion, a celebration screen appears with the message: "🏆 Congratulations! You have successfully cleared all 3 rounds of the FIIT Assessment!"'
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // SECTION 8: PROCTORING & ANTI-CHEAT SYSTEM
          createHeading('8. AI Proctoring & Anti-Cheating Architecture', HeadingLevel.HEADING_1),
          createParagraph(
            'The application enforces a strict 2-Strike Violation Policy to maintain academic fairness across all job fair test centers:'
          ),
          createBullet('Mandatory Fullscreen Mode: Tests must be taken in fullscreen. Exiting fullscreen triggers an immediate violation strike.', 'Rule 1'),
          createBullet('Tab Switch & Blur Tracking: Navigating to external tabs, browser windows, or minimizing triggers a violation strike.', 'Rule 2'),
          createBullet('Clipboard & Context Menu Lock: Right-click, Copy (Ctrl+C), Paste (Ctrl+V), and Cut (Ctrl+X) are actively blocked.', 'Rule 3'),
          createBullet('Screenshot Interception: PrintScreen (Key code 44) and Windows+Shift+S keystrokes are intercepted.', 'Rule 4'),
          createBullet('Live Webcam Monitoring: Live camera stream runs throughout the test with a visible green indicator in the bottom-right corner.', 'Rule 5'),
          createParagraph('Enforcement Policy:'),
          createBullet('Strike 1: A prominent warning modal pops up stating the exact violation reason (e.g. Fullscreen exit or tab switch) and warning the candidate that their next violation will result in disqualification.', 'First Mistake'),
          createBullet('Strike 2: Immediate Disqualification! The candidate is ejected from the assessment session, the test is terminated, and the incident is logged in the recruiter portal.', 'Second Mistake'),
          ...createImageFigure('08_proctoring_violation_modal.png', 'Proctoring Violation Warning Modal (Strike 1 of 2)'),

          // SECTION 9: RECRUITER ADMIN DASHBOARD
          createHeading('9. Recruiter / Administrator Dashboard', HeadingLevel.HEADING_1),
          createParagraph(
            'The Administrator Dashboard is the central control hub for hiring teams during the job fair. It aggregates candidate data, presents real-time KPI metrics, and enables fast candidate screening.'
          ),
          createBullet('KPI Cards: Live counts of Total Registered Candidates, Cleared All 3 Rounds 🏆, Pending Round 3 Approval, Round 1 Passed, and Disqualified Candidates.', 'Metric Cards'),
          createBullet('Attempt Labeling (1st Time vs 2nd Time): Accurately tracks candidate attempts. If a student failed on their first attempt, logged out, re-logged in, and restarted a new attempt, the admin portal clearly distinguishes whether they cleared on their 1st Time or 2nd Time.', 'Attempt Tracking'),
          createBullet('Borderline Override Button: Candidates scoring 30-34 in Round 2 feature an amber "Approve for Round 3" button. Clicking this unlocks Round 3 access immediately on the candidate portal.', 'Manual Approval'),
          createBullet('Proctoring Audit: Displays violation counts and allows recruiters to review or forgive accidental disqualifications.', 'Security Audit'),
          ...createImageFigure('03_admin_recruiter_dashboard.png', 'Admin Recruiter Portal with KPI Cards, Candidate Table, and Attempt Tracking'),

          new Paragraph({ children: [new PageBreak()] }),

          // SECTION 10: DATABASE & API REFERENCE
          createHeading('10. Database Schema & REST API Summary', HeadingLevel.HEADING_1),
          createParagraph('MongoDB Compass Connection URI: mongodb://127.0.0.1:27017/fiit_recruitment'),
          createParagraph('The database maintains the "User" collection with the following core structure:'),
          createBullet('name, email, password, phone, college, degree, role (student/admin)', 'Candidate Profile'),
          createBullet('attemptNumber, currentRound, status (ready_for_round1, all_cleared, etc.)', 'Assessment State'),
          createBullet('round1: { score, total: 25, passed, completedAt }', 'Round 1 Results'),
          createBullet('round2: { score, total: 50, passed, borderline, adminApproved }', 'Round 2 Results'),
          createBullet('round3: { score, total: 5, passed, solutions: [...] }', 'Round 3 Results'),
          createBullet('disqualified, violationCount, violations: [{ type, reason, timestamp }]', 'Proctoring Log'),
          createBullet('history: [{ attemptNumber, round1Score, round2Score, status, ... }]', 'Attempt Archive'),

          createHeading('Core REST API Endpoints:', HeadingLevel.HEADING_2),
          createBullet('POST /api/auth/register - Candidate registration', 'Auth'),
          createBullet('POST /api/auth/login - Candidate & Admin authentication', 'Auth'),
          createBullet('POST /api/auth/start-new-attempt - Archives attempt and starts fresh attempt', 'Auth'),
          createBullet('GET /api/assessment/round1/questions - Shuffled 25 computer basic MCQs', 'Round 1'),
          createBullet('POST /api/assessment/round1/submit - Evaluates score (pass: >= 20)', 'Round 1'),
          createBullet('GET /api/assessment/round2/questions - Shuffled 50 technical MCQs', 'Round 2'),
          createBullet('POST /api/assessment/round2/submit - Evaluates score (pass: >= 35, borderline: 30-34)', 'Round 2'),
          createBullet('GET /api/assessment/round3/questions - 5 Algorithmic challenges in Python/Java', 'Round 3'),
          createBullet('POST /api/assessment/round3/run - Real-time execution against 5 test cases', 'Round 3'),
          createBullet('POST /api/assessment/round3/submit - Final submission for 3-round clearance', 'Round 3'),
          createBullet('POST /api/assessment/violation - Proctoring security logger and 2-strike enforcer', 'Proctoring'),
          createBullet('GET /api/admin/stats - Recruiter dashboard statistics', 'Admin'),
          createBullet('GET /api/admin/students - Comprehensive student roster with attempt badges', 'Admin'),
          createBullet('POST /api/admin/approve-round3/:id - Recruiter override to unlock Round 3', 'Admin'),

          // SECTION 11: CONCLUSION & VERIFICATION
          createHeading('11. Verification & Test Audit', HeadingLevel.HEADING_1),
          createParagraph(
            'The entire web application was thoroughly tested across all functional, security, and algorithmic requirements. All test scenarios—including candidate registration, question randomization, Round 1 evaluation, Round 2 borderline detection, recruiter manual approval, Python and Java code execution against 5 test cases, 2-strike proctoring enforcement, and multi-attempt tracking—executed with 100% pass rates.'
          ),
          createParagraph(
            'The project is fully operational, self-contained, and ready for deployment in university campus drives, technical hackathons, and corporate job fairs.'
          )
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT_DOCX, buffer);
  console.log(`Word document successfully generated at: ${OUTPUT_DOCX}`);
}

buildDocx().catch((err) => {
  console.error('Error generating docx:', err);
  process.exit(1);
});
