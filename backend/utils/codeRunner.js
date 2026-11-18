const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '..', 'temp_code');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Locate Java binaries
const JDK26_JAVAC = 'C:\\Program Files\\Java\\jdk-26\\bin\\javac.exe';
const JDK26_JAVA = 'C:\\Program Files\\Java\\jdk-26\\bin\\java.exe';

const JAVAC_CMD = fs.existsSync(JDK26_JAVAC) ? JDK26_JAVAC : 'javac';
const JAVA_CMD = fs.existsSync(JDK26_JAVA) ? JDK26_JAVA : 'java';

// Executes Python code with given stdin input
function executePython(code, input, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const fileId = `py_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const filePath = path.join(TEMP_DIR, `${fileId}.py`);

    try {
      fs.writeFileSync(filePath, code, 'utf-8');
    } catch (err) {
      return resolve({ success: false, error: `File write error: ${err.message}` });
    }

    const pyProcess = spawn('python', [filePath], {
      windowsHide: true
    });

    let stdout = '';
    let stderr = '';
    let isTimedOut = false;

    const timer = setTimeout(() => {
      isTimedOut = true;
      try {
        pyProcess.kill('SIGKILL');
      } catch (e) {}
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {}
      resolve({
        success: false,
        error: 'Execution Time Limit Exceeded (Timeout > 5s)',
        stdout: '',
        stderr: 'Time Limit Exceeded'
      });
    }, timeoutMs);

    if (input !== undefined && input !== null) {
      try {
        pyProcess.stdin.write(input);
        pyProcess.stdin.end();
      } catch (e) {}
    } else {
      pyProcess.stdin.end();
    }

    pyProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pyProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pyProcess.on('close', (code) => {
      clearTimeout(timer);
      if (isTimedOut) return;

      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {}

      if (code !== 0 && stderr) {
        return resolve({
          success: false,
          error: stderr.trim(),
          stdout: stdout.trim(),
          stderr: stderr.trim()
        });
      }

      resolve({
        success: true,
        output: stdout.trim(),
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });

    pyProcess.on('error', (err) => {
      clearTimeout(timer);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {}
      resolve({
        success: false,
        error: `Process error: ${err.message}`
      });
    });
  });
}

// Executes a Java run in a precompiled directory
function runJavaSingle(runDir, input, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const java = spawn(JAVA_CMD, ['-cp', runDir, 'Solution'], { windowsHide: true });
    let stdout = '';
    let stderr = '';
    let isTimedOut = false;

    const timer = setTimeout(() => {
      isTimedOut = true;
      try {
        java.kill('SIGKILL');
      } catch (e) {}
      resolve({
        success: false,
        error: 'Execution Time Limit Exceeded (Timeout > 5s)',
        stdout: '',
        stderr: 'Time Limit Exceeded'
      });
    }, timeoutMs);

    if (input !== undefined && input !== null) {
      try {
        java.stdin.write(input);
        java.stdin.end();
      } catch (e) {}
    } else {
      java.stdin.end();
    }

    java.stdout.on('data', (d) => {
      stdout += d.toString();
    });

    java.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    java.on('close', (code) => {
      clearTimeout(timer);
      if (isTimedOut) return;

      if (code !== 0 && stderr) {
        return resolve({
          success: false,
          error: stderr.trim(),
          stdout: stdout.trim(),
          stderr: stderr.trim()
        });
      }

      resolve({
        success: true,
        output: stdout.trim(),
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });

    java.on('error', (err) => {
      clearTimeout(timer);
      resolve({ success: false, error: `Java run error: ${err.message}` });
    });
  });
}

// Compiles Java code once in a dedicated temp folder
function compileJava(code) {
  return new Promise((resolve) => {
    const dirId = `java_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const runDir = path.join(TEMP_DIR, dirId);

    try {
      fs.mkdirSync(runDir, { recursive: true });
      const filePath = path.join(runDir, 'Solution.java');
      fs.writeFileSync(filePath, code, 'utf-8');
    } catch (err) {
      return resolve({ success: false, error: `Directory creation error: ${err.message}` });
    }

    const javac = spawn(JAVAC_CMD, [path.join(runDir, 'Solution.java')], { windowsHide: true });
    let compileErr = '';

    javac.stderr.on('data', (d) => {
      compileErr += d.toString();
    });

    javac.on('close', (compileCode) => {
      if (compileCode !== 0) {
        try {
          fs.rmSync(runDir, { recursive: true, force: true });
        } catch (e) {}
        return resolve({
          success: false,
          error: `Compilation Error:\n${compileErr.trim()}`,
          isCompileError: true
        });
      }

      resolve({
        success: true,
        runDir
      });
    });

    javac.on('error', (err) => {
      try {
        fs.rmSync(runDir, { recursive: true, force: true });
      } catch (e) {}
      resolve({ success: false, error: `Compiler error: ${err.message}`, isCompileError: true });
    });
  });
}

// Runs code against a list of test cases
async function runAgainstTestCases(language, code, testCases) {
  const results = [];
  let passedCount = 0;
  const lang = (language || '').toLowerCase();

  if (lang === 'python') {
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const execution = await executePython(code, tc.input);

      if (!execution.success) {
        results.push({
          testCaseId: tc.id || i + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: execution.stdout || '',
          passed: false,
          error: execution.error || execution.stderr
        });
        continue;
      }

      const actual = (execution.output || '').trim();
      const expected = (tc.expectedOutput || '').trim();
      const passed = actual === expected;

      if (passed) passedCount++;

      results.push({
        testCaseId: tc.id || i + 1,
        input: tc.input,
        expectedOutput: expected,
        actualOutput: actual,
        passed,
        error: passed ? null : `Expected '${expected}' but received '${actual}'`
      });
    }
  } else if (lang === 'java') {
    // Compile once
    const comp = await compileJava(code);
    if (!comp.success) {
      return {
        success: false,
        totalTestCases: testCases.length,
        passedCount: 0,
        allPassed: false,
        error: comp.error,
        results: [
          {
            testCaseId: 1,
            input: testCases[0]?.input || '',
            expectedOutput: testCases[0]?.expectedOutput || '',
            actualOutput: '',
            passed: false,
            error: comp.error
          }
        ]
      };
    }

    const runDir = comp.runDir;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const execution = await runJavaSingle(runDir, tc.input);

      if (!execution.success) {
        results.push({
          testCaseId: tc.id || i + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: execution.stdout || '',
          passed: false,
          error: execution.error || execution.stderr
        });
        continue;
      }

      const actual = (execution.output || '').trim();
      const expected = (tc.expectedOutput || '').trim();
      const passed = actual === expected;

      if (passed) passedCount++;

      results.push({
        testCaseId: tc.id || i + 1,
        input: tc.input,
        expectedOutput: expected,
        actualOutput: actual,
        passed,
        error: passed ? null : `Expected '${expected}' but received '${actual}'`
      });
    }

    // Clean up compiled class files
    try {
      fs.rmSync(runDir, { recursive: true, force: true });
    } catch (e) {}
  } else {
    return {
      success: false,
      error: `Unsupported language: ${language}`
    };
  }

  return {
    success: true,
    totalTestCases: testCases.length,
    passedCount,
    allPassed: passedCount === testCases.length,
    results
  };
}

module.exports = {
  executePython,
  executeJava: async (code, input) => {
    const comp = await compileJava(code);
    if (!comp.success) return comp;
    const res = await runJavaSingle(comp.runDir, input);
    try {
      fs.rmSync(comp.runDir, { recursive: true, force: true });
    } catch (e) {}
    return res;
  },
  runAgainstTestCases
};
