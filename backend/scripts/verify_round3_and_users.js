const mongoose = require('mongoose');
const { fullStackRound3Questions, dataAnalystRound3Questions } = require('../data/round3Questions');
const { executePython } = require('../utils/codeRunner');
const User = require('../models/User');

async function testAll() {
  console.log('--- 1. Testing Round 3 Full Stack Questions Starter Code & Solutions ---');
  // Solutions to test
  const solutions = {
    // Problem 1: Word Order Inverter
    1: `import sys\n\ndef reverseWords(s: str) -> str:\n    words = s.strip().split()\n    return " ".join(reversed(words))\n\nif __name__ == "__main__":\n    line = sys.stdin.read().strip()\n    print(reverseWords(line))`,
    // Problem 2: Palindrome Word Checker
    2: `import sys\n\ndef isPalindrome(s: str) -> str:\n    cleaned = s.strip().lower()\n    return "true" if cleaned == cleaned[::-1] else "false"\n\nif __name__ == "__main__":\n    line = sys.stdin.read().strip()\n    print(isPalindrome(line))`,
    // Problem 3: Find Maximum Number in Array
    3: `import sys\n\ndef findMax(line: str) -> int:\n    nums = [int(x) for x in line.split()]\n    return max(nums)\n\nif __name__ == "__main__":\n    line = sys.stdin.read().strip()\n    print(findMax(line))`,
    // Problem 4: Count Vowels in String
    4: `import sys\n\ndef countVowels(s: str) -> int:\n    return sum(1 for c in s.lower() if c in 'aeiou')\n\nif __name__ == "__main__":\n    line = sys.stdin.read().strip()\n    print(countVowels(line))`
  };

  for (const q of fullStackRound3Questions) {
    console.log(`Checking Full Stack Q${q.id}: ${q.title}`);
    // Check starter code does NOT contain solution
    if (!q.starterCode.python.includes('pass')) {
      throw new Error(`Q${q.id} starter code should have pass!`);
    }
    // Run tests
    const sol = solutions[q.id];
    let passed = 0;
    for (const tc of q.testCases) {
      const res = await executePython(sol, tc.input);
      if (res.output === tc.expectedOutput) {
        passed++;
      } else {
        console.error(`FAIL Q${q.id} TC#${tc.id}: expected "${tc.expectedOutput}", got "${res.output}"`);
      }
    }
    console.log(`  Q${q.id} Passed ${passed}/${q.testCases.length} test cases.`);
  }

  console.log('\n--- 2. Testing Round 3 Data Analyst Questions Starter Code & Solutions ---');
  const daSolutions = {
    // Problem 5: Calculate Total Sales Sum
    5: `import sys\n\ndef calculate_total_sales(line: str) -> int:\n    return sum(int(x) for x in line.split())\n\nif __name__ == "__main__":\n    line = sys.stdin.read().strip()\n    print(calculate_total_sales(line))`,
    // Problem 6: Count Even and Odd Numbers
    6: `import sys\n\ndef count_even_odd(line: str) -> str:\n    nums = [int(x) for x in line.split()]\n    evens = sum(1 for x in nums if x % 2 == 0)\n    odds = len(nums) - evens\n    return f"Even: {evens}, Odd: {odds}"\n\nif __name__ == "__main__":\n    line = sys.stdin.read().strip()\n    print(count_even_odd(line))`,
    // Problem 7: Find Maximum and Minimum Values
    7: `import sys\n\ndef find_max_min(line: str) -> str:\n    nums = [int(x) for x in line.split()]\n    return f"Max: {max(nums)}, Min: {min(nums)}"\n\nif __name__ == "__main__":\n    line = sys.stdin.read().strip()\n    print(find_max_min(line))`,
    // Problem 8: Calculate Average Score
    8: `import sys\n\ndef calculate_average(line: str) -> int:\n    nums = [int(x) for x in line.split()]\n    return sum(nums) // len(nums)\n\nif __name__ == "__main__":\n    line = sys.stdin.read().strip()\n    print(calculate_average(line))`
  };

  for (const q of dataAnalystRound3Questions) {
    console.log(`Checking Data Analyst Q${q.id}: ${q.title}`);
    if (!q.starterCode.python.includes('pass')) {
      throw new Error(`Q${q.id} starter code should have pass!`);
    }
    const sol = daSolutions[q.id];
    let passed = 0;
    for (const tc of q.testCases) {
      const res = await executePython(sol, tc.input);
      if (res.output === tc.expectedOutput) {
        passed++;
      } else {
        console.error(`FAIL Q${q.id} TC#${tc.id}: expected "${tc.expectedOutput}", got "${res.output}"`);
      }
    }
    console.log(`  Q${q.id} Passed ${passed}/${q.testCases.length} test cases.`);
  }

  console.log('\n--- 3. Checking Test Users in Database ---');
  await mongoose.connect('mongodb://127.0.0.1:27017/fiit_recruitment');
  const count = await User.countDocuments();
  console.log(`Total users in DB: ${count}`);

  const testUsers = await User.find({ email: /@fiit\.edu$/ }).select('name email role interestedRole round1 round2');
  console.log(`Found ${testUsers.length} test accounts (@fiit.edu):`);
  testUsers.forEach(u => {
    console.log(`- ${u.email} | ${u.interestedRole || u.role} | R1: ${u.round1?.passed ? 'Cleared' : 'Pending'} | R2: ${u.round2?.passed ? 'Cleared' : 'Pending'}`);
  });

  await mongoose.disconnect();
  console.log('\nAll checks completed successfully!');
}

testAll().catch(err => {
  console.error(err);
  process.exit(1);
});
