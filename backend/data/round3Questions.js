// Round 3: Technical Coding Assessment
// Domain-Specific Coding Challenges (Medium Range):
// 1. Full Stack / Java / Software Development Challenges (Problems 1-4)
// 2. Data Analyst / Data Science Challenges (Problems 5-8)
// NOTE: Starter code contains boilerplate skeletons ONLY - Candidates must write the solution logic!

// =========================================================================
// 1. FULL STACK / JAVA / SOFTWARE DEVELOPER CODING CHALLENGES
// =========================================================================
const fullStackRound3Questions = [
  {
    id: 1,
    title: "Word Order Inverter",
    domain: "Full Stack",
    difficulty: "Medium",
    scenario: "A data pipeline at an e-commerce firm receives customer address log entries with scrambled word orders. Write a routine that reverses the order of words in a sentence while ensuring words are separated by exactly one space.",
    description: "Given an input string `s` containing words, reverse the order of the words. Return a string of the words in reverse order separated by a single space.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s contains English letters and spaces."
    ],
    sampleInput: "the sky is blue",
    sampleOutput: "blue is sky the",
    sampleExplanation: "The 4 words ['the', 'sky', 'is', 'blue'] reversed in order become ['blue', 'is', 'sky', 'the'].",
    examples: [
      { input: "the sky is blue", output: "blue is sky the" },
      { input: "hello world", output: "world hello" }
    ],
    starterCode: {
      python: `# Python 3
import sys

def reverseWords(s: str) -> str:
    # Write your solution here
    pass

if __name__ == "__main__":
    line = sys.stdin.read().strip()
    result = reverseWords(line)
    if result is not None:
        print(result)
`,
      java: `// Java (JDK 26)
import java.util.*;
import java.io.*;

public class Solution {
    public static String reverseWords(String s) {
        // Write your solution here
        return "";
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            System.out.print(reverseWords(line));
        }
    }
}
`
    },
    testCases: [
      { id: 1, input: "the sky is blue", expectedOutput: "blue is sky the" },
      { id: 2, input: "hello world", expectedOutput: "world hello" },
      { id: 3, input: "FIIT recruitment drive 2026", expectedOutput: "2026 drive recruitment FIIT" },
      { id: 4, input: "full stack web development", expectedOutput: "development web stack full" },
      { id: 5, input: "Antigravity", expectedOutput: "Antigravity" }
    ]
  },

  {
    id: 2,
    title: "Palindrome Word Checker",
    domain: "Full Stack",
    difficulty: "Medium",
    scenario: "An identity verification engine inspects verification token words. A token is valid if it reads identically forward and backward (case-insensitive). Return 'true' if the word is a palindrome, or 'false' otherwise.",
    description: "Given a single word string `s`, return 'true' if it is a palindrome ignoring case, or 'false' otherwise.",
    constraints: [
      "1 <= s.length <= 10^3",
      "s consists only of alphanumeric characters."
    ],
    sampleInput: "madam",
    sampleOutput: "true",
    sampleExplanation: "'madam' reversed is 'madam', so it is a palindrome.",
    examples: [
      { input: "madam", output: "true" },
      { input: "hello", output: "false" }
    ],
    starterCode: {
      python: `# Python 3
import sys

def isPalindrome(s: str) -> str:
    # Write your solution here
    pass

if __name__ == "__main__":
    line = sys.stdin.read().strip()
    result = isPalindrome(line)
    if result is not None:
        print(result)
`,
      java: `// Java (JDK 26)
import java.util.*;
import java.io.*;

public class Solution {
    public static String isPalindrome(String s) {
        // Write your solution here
        return "";
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            System.out.print(isPalindrome(line));
        }
    }
}
`
    },
    testCases: [
      { id: 1, input: "madam", expectedOutput: "true" },
      { id: 2, input: "hello", expectedOutput: "false" },
      { id: 3, input: "Racecar", expectedOutput: "true" },
      { id: 4, input: "level", expectedOutput: "true" },
      { id: 5, input: "world", expectedOutput: "false" }
    ]
  },

  {
    id: 3,
    title: "Find Maximum Number in Array",
    domain: "Full Stack",
    difficulty: "Medium",
    scenario: "An order processing system tracks shopping cart item prices. Write a routine to find and return the maximum value in an array of space-separated integers.",
    description: "Given a space-separated string of integers, find and return the maximum number.",
    constraints: [
      "1 <= count <= 10^4",
      "-10^4 <= value <= 10^4"
    ],
    sampleInput: "3 5 1 9 2",
    sampleOutput: "9",
    sampleExplanation: "The largest number among 3, 5, 1, 9, 2 is 9.",
    examples: [
      { input: "3 5 1 9 2", output: "9" },
      { input: "10 20 50 30", output: "50" }
    ],
    starterCode: {
      python: `# Python 3
import sys

def findMax(line: str) -> int:
    # Write your solution here
    pass

if __name__ == "__main__":
    line = sys.stdin.read().strip()
    result = findMax(line)
    if result is not None:
        print(result)
`,
      java: `// Java (JDK 26)
import java.util.*;
import java.io.*;

public class Solution {
    public static int findMax(String line) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            System.out.print(findMax(line));
        }
    }
}
`
    },
    testCases: [
      { id: 1, input: "3 5 1 9 2", expectedOutput: "9" },
      { id: 2, input: "10 20 50 30", expectedOutput: "50" },
      { id: 3, input: "-10 -5 -20 -1", expectedOutput: "-1" },
      { id: 4, input: "100 25 80", expectedOutput: "100" },
      { id: 5, input: "42", expectedOutput: "42" }
    ]
  },

  {
    id: 4,
    title: "Count Vowels in String",
    domain: "Full Stack",
    difficulty: "Medium",
    scenario: "A search query parser analyzes keywords by identifying vowel density. Write a function that counts the total number of vowels ('a', 'e', 'i', 'o', 'u', case-insensitive) in a given string.",
    description: "Given a string `s`, count and return the total number of vowels in `s`.",
    constraints: [
      "1 <= s.length <= 10^4"
    ],
    sampleInput: "hello world",
    sampleOutput: "3",
    sampleExplanation: "The vowels in 'hello world' are 'e', 'o', 'o' (3 vowels total).",
    examples: [
      { input: "hello world", output: "3" },
      { input: "python", output: "1" }
    ],
    starterCode: {
      python: `# Python 3
import sys

def countVowels(s: str) -> int:
    # Write your solution here
    pass

if __name__ == "__main__":
    line = sys.stdin.read().strip()
    result = countVowels(line)
    if result is not None:
        print(result)
`,
      java: `// Java (JDK 26)
import java.util.*;
import java.io.*;

public class Solution {
    public static int countVowels(String s) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            System.out.print(countVowels(line));
        }
    }
}
`
    },
    testCases: [
      { id: 1, input: "hello world", expectedOutput: "3" },
      { id: 2, input: "FIIT Job Fair 2026", expectedOutput: "5" },
      { id: 3, input: "python", expectedOutput: "1" },
      { id: 4, input: "rhythm", expectedOutput: "0" },
      { id: 5, input: "aeiou", expectedOutput: "5" }
    ]
  }
];

// =========================================================================
// 2. DATA ANALYST / DATA SCIENCE CODING CHALLENGES
// =========================================================================
const dataAnalystRound3Questions = [
  {
    id: 5,
    title: "Calculate Total Sales Sum",
    domain: "Data Analyst",
    difficulty: "Medium",
    scenario: "An analyst is aggregating transaction figures from a retail sales log. Given a space-separated series of integers representing daily sales amounts, calculate and return the total sum of all values.",
    description: "Given a space-separated string of integers, calculate and print their total sum.",
    constraints: [
      "1 <= count <= 10^4",
      "-10^4 <= amount <= 10^4"
    ],
    sampleInput: "10 20 30 40 50",
    sampleOutput: "150",
    sampleExplanation: "10 + 20 + 30 + 40 + 50 = 150.",
    examples: [
      { input: "10 20 30 40 50", output: "150" },
      { input: "5 15 25", output: "45" }
    ],
    starterCode: {
      python: `# Python 3
import sys

def calculate_total_sales(line: str) -> int:
    # Write your solution here
    pass

if __name__ == "__main__":
    line = sys.stdin.read().strip()
    result = calculate_total_sales(line)
    if result is not None:
        print(result)
`,
      java: `// Java (JDK 26)
import java.util.*;
import java.io.*;

public class Solution {
    public static int calculateTotalSales(String line) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            System.out.print(calculateTotalSales(line));
        }
    }
}
`
    },
    testCases: [
      { id: 1, input: "10 20 30 40 50", expectedOutput: "150" },
      { id: 2, input: "5 15 25", expectedOutput: "45" },
      { id: 3, input: "100 250 50", expectedOutput: "400" },
      { id: 4, input: "-10 20 -5 15", expectedOutput: "20" },
      { id: 5, input: "42", expectedOutput: "42" }
    ]
  },

  {
    id: 6,
    title: "Count Even and Odd Numbers in Dataset",
    domain: "Data Analyst",
    difficulty: "Medium",
    scenario: "A data quality team needs to inspect the parity distribution of transaction IDs in a database. Given a space-separated list of integers, count the number of even numbers and odd numbers and print formatted as 'Even: X, Odd: Y'.",
    description: "Given a space-separated string of integers, count the even and odd numbers. Output formatted as 'Even: <evenCount>, Odd: <oddCount>'.",
    constraints: [
      "1 <= total numbers <= 10^4"
    ],
    sampleInput: "1 2 3 4 5 6 7",
    sampleOutput: "Even: 3, Odd: 4",
    sampleExplanation: "Even numbers are [2, 4, 6] (3). Odd numbers are [1, 3, 5, 7] (4).",
    examples: [
      { input: "1 2 3 4 5 6 7", output: "Even: 3, Odd: 4" },
      { input: "2 4 6 8", output: "Even: 4, Odd: 0" }
    ],
    starterCode: {
      python: `# Python 3
import sys

def count_even_odd(line: str) -> str:
    # Write your solution here
    pass

if __name__ == "__main__":
    line = sys.stdin.read().strip()
    result = count_even_odd(line)
    if result is not None:
        print(result)
`,
      java: `// Java (JDK 26)
import java.util.*;
import java.io.*;

public class Solution {
    public static String countEvenOdd(String line) {
        // Write your solution here
        return "";
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            System.out.print(countEvenOdd(line));
        }
    }
}
`
    },
    testCases: [
      { id: 1, input: "1 2 3 4 5 6 7", expectedOutput: "Even: 3, Odd: 4" },
      { id: 2, input: "2 4 6 8", expectedOutput: "Even: 4, Odd: 0" },
      { id: 3, input: "1 3 5 7 9", expectedOutput: "Even: 0, Odd: 5" },
      { id: 4, input: "10 21 30 41 50", expectedOutput: "Even: 3, Odd: 2" },
      { id: 5, input: "0 2 3", expectedOutput: "Even: 2, Odd: 1" }
    ]
  },

  {
    id: 7,
    title: "Find Maximum and Minimum Values",
    domain: "Data Analyst",
    difficulty: "Medium",
    scenario: "An analyst monitoring temperature sensor telemetry needs to find the daily maximum and minimum readings. Given a space-separated series of integers, output the maximum and minimum values formatted as 'Max: X, Min: Y'.",
    description: "Given a space-separated list of integers, find the maximum and minimum values and return formatted as 'Max: <maxVal>, Min: <minVal>'.",
    constraints: [
      "1 <= numbers <= 10^4",
      "-10^4 <= value <= 10^4"
    ],
    sampleInput: "15 42 8 99 23",
    sampleOutput: "Max: 99, Min: 8",
    sampleExplanation: "Maximum value is 99 and minimum value is 8.",
    examples: [
      { input: "15 42 8 99 23", output: "Max: 99, Min: 8" },
      { input: "10 20 30 40", output: "Max: 40, Min: 10" }
    ],
    starterCode: {
      python: `# Python 3
import sys

def find_max_min(line: str) -> str:
    # Write your solution here
    pass

if __name__ == "__main__":
    line = sys.stdin.read().strip()
    result = find_max_min(line)
    if result is not None:
        print(result)
`,
      java: `// Java (JDK 26)
import java.util.*;
import java.io.*;

public class Solution {
    public static String findMaxMin(String line) {
        // Write your solution here
        return "";
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            System.out.print(findMaxMin(line));
        }
    }
}
`
    },
    testCases: [
      { id: 1, input: "15 42 8 99 23", expectedOutput: "Max: 99, Min: 8" },
      { id: 2, input: "10 20 30 40", expectedOutput: "Max: 40, Min: 10" },
      { id: 3, input: "-5 0 15 -20", expectedOutput: "Max: 15, Min: -20" },
      { id: 4, input: "100 50", expectedOutput: "Max: 100, Min: 50" },
      { id: 5, input: "7", expectedOutput: "Max: 7, Min: 7" }
    ]
  },

  {
    id: 8,
    title: "Calculate Average Score",
    domain: "Data Analyst",
    difficulty: "Medium",
    scenario: "An educational data analyst evaluates examination metrics. Given a space-separated series of student scores, calculate and return the integer floor average (sum / count).",
    description: "Given a space-separated string of integers, calculate their arithmetic mean and return the floor integer value.",
    constraints: [
      "1 <= scores <= 10^4",
      "0 <= score <= 1000"
    ],
    sampleInput: "80 90 70 60 100",
    sampleOutput: "80",
    sampleExplanation: "Sum is 400, count is 5. 400 / 5 = 80.",
    examples: [
      { input: "80 90 70 60 100", output: "80" },
      { input: "10 20 30", output: "20" }
    ],
    starterCode: {
      python: `# Python 3
import sys

def calculate_average(line: str) -> int:
    # Write your solution here
    pass

if __name__ == "__main__":
    line = sys.stdin.read().strip()
    result = calculate_average(line)
    if result is not None:
        print(result)
`,
      java: `// Java (JDK 26)
import java.util.*;
import java.io.*;

public class Solution {
    public static int calculateAverage(String line) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            System.out.print(calculateAverage(line));
        }
    }
}
`
    },
    testCases: [
      { id: 1, input: "80 90 70 60 100", expectedOutput: "80" },
      { id: 2, input: "10 20 30", expectedOutput: "20" },
      { id: 3, input: "50 55", expectedOutput: "52" },
      { id: 4, input: "100 200 300", expectedOutput: "200" },
      { id: 5, input: "75", expectedOutput: "75" }
    ]
  }
];

// Combined list of all 8 questions
const round3Questions = [
  ...fullStackRound3Questions,
  ...dataAnalystRound3Questions
];

function getRound3QuestionsForDomain(domainName) {
  if (domainName && (domainName.includes('Data Analyst') || domainName.includes('Data Scientist'))) {
    return dataAnalystRound3Questions;
  }
  // Default to Full Stack / Java / Web problems
  return fullStackRound3Questions;
}

function findRound3Question(id) {
  const numId = parseInt(id, 10);
  return round3Questions.find(q => q.id === numId);
}

module.exports = {
  round3Questions,
  fullStackRound3Questions,
  dataAnalystRound3Questions,
  getRound3QuestionsForDomain,
  findRound3Question
};
