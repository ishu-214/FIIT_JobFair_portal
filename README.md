# FIIT Job Fair Assessment & Screening Web Application

A full-stack, enterprise-grade assessment platform created specifically for the **FIIT Job Fair** to test, filter, and choose qualified students across three progressive evaluation rounds with real-time AI proctoring and an administrative control portal.

---

## 🛠️ Technology Stack

- **Frontend**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/) + Canvas Confetti
- **Backend**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) + Child Process Code Execution Engine
- **Database**: [MongoDB](https://www.mongodb.com/) (Connectable via **MongoDB Compass** at `mongodb://127.0.0.1:27017/fiit_recruitment`)
- **Compilers & Runtimes**: Python 3.14 & Java (JDK 26)

---

## 🚀 Live Services & Access URLs

- **Candidate & Admin Portal**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **MongoDB Compass Connection String**: `mongodb://127.0.0.1:27017/fiit_recruitment`

### 🔑 Default Credentials
- **Recruiter / Admin Account**:
  - Email: `admin@fiit.edu`
  - Password: `admin123`
- **Candidate Account**:
  - Create any new student account via the **Register** tab, or log in with existing candidates.

---

## 📋 Comprehensive Workflow & Assessment Stages

### 1. Student Authentication & Registration
- Candidates register with their Full Name, Email, Password, Phone Number, College / University, and Degree / Branch.
- If a candidate already has an account, they can simply log in.
- Supports **Attempt Tracking**: Candidates who retake after a previous attempt will have their attempts labeled as **1st Time**, **2nd Time**, etc. Admin can see candidate history and whether they cleared on their 1st or 2nd attempt.

---

### 2. Round 1: Basic Computer Knowledge Assessment
- **Questions**: **25 MCQs** sampled from a 40-question question bank covering CPU, Memory, Operating Systems, Computer Basics, Hardware, and Software.
- **Randomization**: Questions and option orders are **shuffled** for every student so each candidate gets a unique question order.
- **Passing Criteria**: Score **&ge; 20 / 25**.
- **Outcomes**:
  - **Passed (&ge; 20)**: Displays *"Congratulations, you have passed the first assessment and you can move to second assessment test"* along with a button **"Take Next Round Test (Round 2)"**.
  - **Failed (&lt; 20)**: Displays *"Sorry, you have not cleared the assessment."* Candidate cannot proceed to Round 2.

---

### 3. Round 2: Technical MCQ Assessment
- **Questions**: **50 MCQs** sampled from a 75-question bank covering medium-level questions in **Java, Python, HTML, CSS, JavaScript, React.js, and SQL**.
- **Randomization**: Questions and options shuffled per student.
- **Passing Criteria**: Score **&ge; 35 / 50**.
- **Outcomes**:
  - **Passed (&ge; 35)**: Displays *"Congratulations! You have passed the technical assessment with [score]/50. Move to Round 3."* Button enabled for Round 3 Coding.
  - **Borderline (30 to 34)**:
    - Candidate cannot immediately move to Round 3.
    - System flags profile for **Admin Review**: Shows *"You scored [score]/50. Standard pass mark is 35. Your profile has been sent to the Admin for review."*
    - In the **Admin Portal**, the recruiter sees this candidate with an amber **"Approve for Round 3"** button.
    - Once the Admin clicks **"Approve for Round 3"**, Round 3 is instantly unlocked on the student's dashboard!
  - **Failed (&lt; 30)**: Displays *"Sorry, you have not cleared the assessment."* The Round 3 button remains strictly disabled.

---

### 4. Round 3: Technical Coding Round
- **Questions**: **5 Algorithmic Challenges**:
  1. *Reverse Words in a Given Sentence*
  2. *Valid Palindrome (ignoring non-alphanumeric & case)*
  3. *Two Sum Indices*
  4. *First Non-Repeating Character*
  5. *Valid Parentheses Bracket Matching*
- **Language Selection**: Candidate can choose **Python 3** or **Java (JDK 26)** with starter templates for both languages.
- **Test Case Execution**:
  - Each challenge has **5 comprehensive test cases**.
  - Candidate clicks **"Run Code"**: Backend executes the code against test cases in real-time.
  - Displays runtime output, stdout, compiler/syntax errors, and passed test cases (e.g., 5/5 Passed).
- **Passing Criteria**: Must solve and pass **all 5 test cases across all 5 problems**.
- **Final Message**: *"🏆 Congratulations! You have successfully cleared all 3 rounds of the FIIT Assessment!"*

---

### 5. 🛡️ Real-Time Proctoring & Anti-Cheat Enforcement

The system implements a strict **2-Strike Rule**:
1. **Mandatory Fullscreen Mode**: The assessment forces fullscreen mode. Exiting fullscreen triggers a violation strike.
2. **Tab Switching & Blur Prevention**: Navigating away from the browser tab or minimizing the window triggers a strike.
3. **Clipboard & Anti-Copy Lock**:
   - `copy`, `cut`, `paste` events are disabled.
   - `Ctrl+C`, `Ctrl+V`, `Ctrl+X` shortcuts are intercepted and blocked.
   - Right-click context menu is blocked.
4. **Anti-Screenshot Detection**:
   - `PrintScreen` (KeyCode 44) and `Win+Shift+S` shortcuts are detected and trigger violation strikes.
5. **Live Webcam Monitoring**:
   - Live camera stream is requested on assessment entry.
   - Fixed picture-in-picture floating webcam bubble is displayed on screen with a live pulsing indicator.
6. **2-Strike Policy**:
   - **Strike 1**: Prominent warning modal pops up with exact reason (e.g. *"Warning (Strike 1 of 2): Proctoring violation detected [fullscreen exit / copy-paste / screenshot]. Next violation will result in immediate disqualification."*).
   - **Strike 2**: Candidate is **immediately disqualified** and ejected from the test session. Disqualification is saved in candidate record and visible to Admin.

---

### 6. 👑 Administrator Dashboard Features

- **KPI Cards**:
  - Total Registered Candidates
  - Cleared All 3 Rounds 🏆
  - Pending Round 3 Approval (Candidates with score 30-34 in Round 2)
  - Passed Round 1 & Round 2
  - Disqualified Candidates
- **Candidate Attempt Tracking**:
  - Shows candidate's attempt: **1st Time**, **2nd Time**, etc.
  - Displays whether candidate cleared 3 rounds on their **1st Attempt** or **2nd Attempt**.
  - Full history count of past attempts.
- **Borderline Approval Control**:
  - Students with score 30-34 in Round 2 show a prominent **"Approve for Round 3"** button.
  - Clicking this unlocks Round 3 access for that specific candidate immediately.
- **Proctoring Violation Oversight**:
  - Displays strike count and violation reasons.
  - Option to forgive and reinstate disqualified candidates if justified.
- **Search & Filter Controls**:
  - Filter by Cleared All 3 Rounds, Needs R3 Approval, 2nd Time Attempt, or Disqualified.
  - Instant search by candidate name, email, or college.

---

## 📂 Project Directory Structure

```
FIIT-web_Application/
├── backend/
│   ├── data/
│   │   ├── round1Questions.js    # 40 Basic Computer & OS MCQs
│   │   ├── round2Questions.js    # 75 Medium-level Tech MCQs (Java, Python, Web, SQL)
│   │   └── round3Questions.js    # 5 Coding problems with Python/Java & 5 test cases
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT & Admin protection middleware
│   ├── models/
│   │   └── User.js               # User schema with attempts, round scores, violations
│   ├── routes/
│   │   ├── admin.js              # Recruiter stats, students list & R3 approval
│   │   ├── assessment.js         # Round 1, 2, 3 questions, submit & code execution
│   │   └── auth.js               # Login, register, me & start-new-attempt
│   ├── utils/
│   │   └── codeRunner.js         # Python 3 and Java child-process test runner
│   ├── .env                      # MongoDB URI, JWT secret & Port configuration
│   ├── package.json
│   └── server.js                 # Express server & Admin seeder
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx                # Brand navigation & attempt badge
    │   │   ├── WebcamMonitor.jsx         # Live proctor webcam bubble
    │   │   ├── ViolationWarningModal.jsx # Strike 1 alert modal
    │   │   └── DisqualifiedModal.jsx     # Strike 2 termination modal
    │   ├── context/
    │   │   └── AuthContext.jsx           # Global authentication state
    │   ├── hooks/
    │   │   └── useProctoring.js          # Fullscreen, tab switch, anti-copy/screenshot
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx        # Recruiter management & R3 approval
    │   │   ├── AuthPage.jsx              # Student login/register & Admin login
    │   │   ├── Dashboard.jsx             # Candidate 3-stage roadmap & attempts
    │   │   ├── Round1Assessment.jsx      # Round 1 MCQ test
    │   │   ├── Round2Assessment.jsx      # Round 2 Technical test
    │   │   └── Round3Assessment.jsx      # Round 3 In-browser coding & test runner
    │   ├── services/
    │   │   └── api.js                    # Backend REST API client
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚡ Manual Server Start Guide (If Restarting Later)

### 1. Start MongoDB
If the MongoDB service is not already running, run:
```powershell
& "C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe" --dbpath "d:\entrykode\FIIT-web_Application\backend\data\db"
```

### 2. Start Backend Server
```powershell
cd d:\entrykode\FIIT-web_Application\backend
npm start
```

### 3. Start Frontend App
```powershell
cd d:\entrykode\FIIT-web_Application\frontend
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your web browser.
