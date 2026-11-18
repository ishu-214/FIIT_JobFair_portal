// Round 1: Candidate Selection & Screening Question Bank
// Comprehensive pool covering:
// 1. Computer-based Knowledge
// 2. Quantitative Aptitude
// 3. Logical Reasoning
// 4. Number Series & Pattern Recognition
// Exactly 25 questions are sampled & shuffled per candidate.

const round1Questions = [
  // ==========================================
  // 1. COMPUTER-BASED KNOWLEDGE (15 Questions)
  // ==========================================
  {
    id: 1,
    category: "Computer Knowledge",
    question: "What does DNS stand for in computer networking?",
    options: ["Domain Name System", "Data Network Service", "Digital Name Server", "Direct Network Serial"],
    correctAnswer: "Domain Name System"
  },
  {
    id: 2,
    category: "Computer Knowledge",
    question: "What is the primary function of an Operating System?",
    options: [
      "To manage computer hardware and software resources and provide common services",
      "To exclusively design websites and web graphics",
      "To act as a physical power supply unit for the motherboard",
      "To write compiler code in assembly language"
    ],
    correctAnswer: "To manage computer hardware and software resources and provide common services"
  },
  {
    id: 3,
    category: "Computer Knowledge",
    question: "What is the standard bit length of an IPv4 address?",
    options: ["32 bits", "64 bits", "128 bits", "16 bits"],
    correctAnswer: "32 bits"
  },
  {
    id: 4,
    category: "Computer Knowledge",
    question: "Which of the following computer memories is volatile (loses data when power is turned off)?",
    options: ["RAM (Random Access Memory)", "ROM (Read Only Memory)", "Hard Disk Drive", "Flash SSD Drive"],
    correctAnswer: "RAM (Random Access Memory)"
  },
  {
    id: 5,
    category: "Computer Knowledge",
    question: "What is the primary difference between a Compiler and an Interpreter?",
    options: [
      "A Compiler translates entire source code into machine code at once; an Interpreter translates line-by-line",
      "An Interpreter produces standalone executable files, while a Compiler does not",
      "Compilers are used only for HTML, while Interpreters are used only for C++",
      "There is no difference between them"
    ],
    correctAnswer: "A Compiler translates entire source code into machine code at once; an Interpreter translates line-by-line"
  },
  {
    id: 6,
    category: "Computer Knowledge",
    question: "What is the standard port number used for secure web browsing (HTTPS)?",
    options: ["443", "80", "21", "22"],
    correctAnswer: "443"
  },
  {
    id: 7,
    category: "Computer Knowledge",
    question: "Which Windows shortcut key permanently deletes a selected file without moving it to the Recycle Bin?",
    options: ["Shift + Delete", "Ctrl + Delete", "Alt + Delete", "Ctrl + Shift + X"],
    correctAnswer: "Shift + Delete"
  },
  {
    id: 8,
    category: "Computer Knowledge",
    question: "What is the primary function of a Firewall in network security?",
    options: [
      "To monitor and filter incoming and outgoing network traffic based on predetermined security rules",
      "To increase internet download bandwidth and Wi-Fi speed",
      "To cool down the central processing unit during intensive processing",
      "To automatically defragment the computer's hard drive"
    ],
    correctAnswer: "To monitor and filter incoming and outgoing network traffic based on predetermined security rules"
  },
  {
    id: 9,
    category: "Computer Knowledge",
    question: "In relational databases, what is the role of a 'Primary Key'?",
    options: [
      "Uniquely identifies each record/row in a database table",
      "Allows duplicate records across all columns",
      "Encrypts table data using SSL certificates",
      "Connects the database to external cloud storage"
    ],
    correctAnswer: "Uniquely identifies each record/row in a database table"
  },
  {
    id: 10,
    category: "Computer Knowledge",
    question: "What does HTTP stand for in web technology?",
    options: [
      "HyperText Transfer Protocol",
      "Hyperlink Text Terminal Program",
      "High Tech Transmission Path",
      "Host Text Translator Protocol"
    ],
    correctAnswer: "HyperText Transfer Protocol"
  },
  {
    id: 11,
    category: "Computer Knowledge",
    question: "Which storage technology has no moving mechanical parts, resulting in faster read/write speeds?",
    options: ["SSD (Solid State Drive)", "HDD (Hard Disk Drive)", "Floppy Disk", "Magnetic Tape Drive"],
    correctAnswer: "SSD (Solid State Drive)"
  },
  {
    id: 12,
    category: "Computer Knowledge",
    question: "What is the binary representation of the decimal number 10?",
    options: ["1010", "1100", "1001", "1110"],
    correctAnswer: "1010"
  },
  {
    id: 13,
    category: "Computer Knowledge",
    question: "Which computer bus connects the CPU to high-speed graphics cards and NVMe drives?",
    options: ["PCI Express (PCIe)", "SATA", "USB 2.0", "Parallel ATA"],
    correctAnswer: "PCI Express (PCIe)"
  },
  {
    id: 14,
    category: "Computer Knowledge",
    question: "What is a 'deadlock' in operating systems?",
    options: [
      "A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process",
      "When a computer hard drive is permanently corrupted",
      "When internet connectivity is disconnected by ISP",
      "When a CPU runs at 100% capacity"
    ],
    correctAnswer: "A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process"
  },
  {
    id: 15,
    category: "Computer Knowledge",
    question: "What does GUI stand for in software applications?",
    options: ["Graphical User Interface", "General Universal Instruction", "Global User Interaction", "Guided Utility Interface"],
    correctAnswer: "Graphical User Interface"
  },

  // ==========================================
  // 2. QUANTITATIVE APTITUDE (15 Questions)
  // ==========================================
  {
    id: 16,
    category: "Quantitative Aptitude",
    question: "A merchant buys an item for Rs. 400 and sells it for Rs. 500. What is his profit percentage?",
    options: ["25%", "20%", "30%", "15%"],
    correctAnswer: "25%"
  },
  {
    id: 17,
    category: "Quantitative Aptitude",
    question: "A car travels a distance of 180 km in 3 hours. What is its speed in meters per second (m/s)?",
    options: ["16.67 m/s", "20 m/s", "15 m/s", "25 m/s"],
    correctAnswer: "16.67 m/s"
  },
  {
    id: 18,
    category: "Quantitative Aptitude",
    question: "If a quantity is increased by 20% and then decreased by 20%, what is the net percentage change?",
    options: ["4% decrease", "No change (0%)", "4% increase", "2% decrease"],
    correctAnswer: "4% decrease"
  },
  {
    id: 19,
    category: "Quantitative Aptitude",
    question: "A bag contains 5 red balls and 15 blue balls. What is the ratio of red balls to the total number of balls?",
    options: ["1 : 4", "1 : 3", "3 : 4", "1 : 5"],
    correctAnswer: "1 : 4"
  },
  {
    id: 20,
    category: "Quantitative Aptitude",
    question: "The average score of 5 test matches is 40 runs. If a 6th match score of 70 is added, what is the new average score?",
    options: ["45", "42", "48", "50"],
    correctAnswer: "45"
  },
  {
    id: 21,
    category: "Quantitative Aptitude",
    question: "What is the Simple Interest on a principal sum of Rs. 2,000 at an annual interest rate of 5% for 3 years?",
    options: ["Rs. 300", "Rs. 250", "Rs. 350", "Rs. 200"],
    correctAnswer: "Rs. 300"
  },
  {
    id: 22,
    category: "Quantitative Aptitude",
    question: "Person A can finish a project in 10 days, and Person B can finish the same project in 15 days. Working together, in how many days can they complete it?",
    options: ["6 days", "5 days", "7.5 days", "8 days"],
    correctAnswer: "6 days"
  },
  {
    id: 23,
    category: "Quantitative Aptitude",
    question: "In a class of 60 students, 45% are girls. What is the total number of boys in the class?",
    options: ["33", "27", "35", "30"],
    correctAnswer: "33"
  },
  {
    id: 24,
    category: "Quantitative Aptitude",
    question: "A train 120 meters long crosses a pole in 6 seconds. What is the speed of the train in km/h?",
    options: ["72 km/h", "60 km/h", "54 km/h", "80 km/h"],
    correctAnswer: "72 km/h"
  },
  {
    id: 25,
    category: "Quantitative Aptitude",
    question: "The ratio of two numbers is 3:5. If the sum of the two numbers is 64, what is the larger number?",
    options: ["40", "36", "44", "48"],
    correctAnswer: "40"
  },
  {
    id: 26,
    category: "Quantitative Aptitude",
    question: "If 12 pens cost Rs. 180, what is the cost of 8 pens at the same rate?",
    options: ["Rs. 120", "Rs. 110", "Rs. 130", "Rs. 140"],
    correctAnswer: "Rs. 120"
  },
  {
    id: 27,
    category: "Quantitative Aptitude",
    question: "The average of four consecutive even numbers is 27. What is the largest of these four numbers?",
    options: ["30", "28", "32", "26"],
    correctAnswer: "30"
  },
  {
    id: 28,
    category: "Quantitative Aptitude",
    question: "A discount of 15% on an article marked at Rs. 800 reduces its selling price to how much?",
    options: ["Rs. 680", "Rs. 700", "Rs. 650", "Rs. 720"],
    correctAnswer: "Rs. 680"
  },
  {
    id: 29,
    category: "Quantitative Aptitude",
    question: "If a pipe fills a water tank in 4 hours and another pipe empties it in 6 hours, how long will it take to fill the tank if both are opened together?",
    options: ["12 hours", "10 hours", "8 hours", "14 hours"],
    correctAnswer: "12 hours"
  },
  {
    id: 30,
    category: "Quantitative Aptitude",
    question: "What is 35% of 240?",
    options: ["84", "82", "86", "80"],
    correctAnswer: "84"
  },

  // ==========================================
  // 3. LOGICAL REASONING (15 Questions)
  // ==========================================
  {
    id: 31,
    category: "Logical Reasoning",
    question: "A person walks 5 km North, turns right and walks 4 km, then turns right again and walks 5 km. In which direction is he now from his starting position?",
    options: ["East", "West", "North", "South"],
    correctAnswer: "East"
  },
  {
    id: 32,
    category: "Logical Reasoning",
    question: "In a certain code language, if 'CAT' is coded as 'DBU', how will the word 'DOG' be coded?",
    options: ["EPH", "EPI", "FPH", "EOH"],
    correctAnswer: "EPH"
  },
  {
    id: 33,
    category: "Logical Reasoning",
    question: "Find the odd one out among the following items: [Apple, Orange, Potato, Banana]",
    options: ["Potato (Vegetable, others are fruits)", "Apple", "Orange", "Banana"],
    correctAnswer: "Potato (Vegetable, others are fruits)"
  },
  {
    id: 34,
    category: "Logical Reasoning",
    question: "Complete the analogy: Clock : Time :: Thermometer : ?",
    options: ["Temperature", "Heat", "Weather", "Energy"],
    correctAnswer: "Temperature"
  },
  {
    id: 35,
    category: "Logical Reasoning",
    question: "Pointing to a man in a photograph, a woman said: 'His mother is the only daughter of my mother.' How is the woman related to the man?",
    options: ["Mother", "Sister", "Aunt", "Grandmother"],
    correctAnswer: "Mother"
  },
  {
    id: 36,
    category: "Logical Reasoning",
    question: "In a row of 30 students, Rahul is 12th from the left end. What is his position from the right end?",
    options: ["19th", "18th", "20th", "17th"],
    correctAnswer: "19th"
  },
  {
    id: 37,
    category: "Logical Reasoning",
    question: "Complete the analogy: Doctor : Hospital :: Teacher : ?",
    options: ["School", "College", "Book", "Classroom"],
    correctAnswer: "School"
  },
  {
    id: 38,
    category: "Logical Reasoning",
    question: "If SOUTH-EAST becomes NORTH, and NORTH-EAST becomes WEST, what will WEST become?",
    options: ["SOUTH-EAST", "NORTH-WEST", "SOUTH-WEST", "NORTH"],
    correctAnswer: "SOUTH-EAST"
  },
  {
    id: 39,
    category: "Logical Reasoning",
    question: "Find the odd one out among the numbers: [13, 17, 23, 27, 31]",
    options: ["27 (Composite number divisible by 3 and 9, others are prime)", "13", "17", "23"],
    correctAnswer: "27 (Composite number divisible by 3 and 9, others are prime)"
  },
  {
    id: 40,
    category: "Logical Reasoning",
    question: "If 'A' is the brother of 'B', and 'B' is the sister of 'C', how is 'A' related to 'C'?",
    options: ["Brother", "Cousin", "Father", "Nephew"],
    correctAnswer: "Brother"
  },
  {
    id: 41,
    category: "Logical Reasoning",
    question: "In a code language, if 'WATER' is written as 'YCVGT', how is 'FIRE' written?",
    options: ["HKTG", "GJSF", "HLTH", "HKTF"],
    correctAnswer: "HKTG"
  },
  {
    id: 42,
    category: "Logical Reasoning",
    question: "Which word best expresses the opposite (antonym) of 'TRANSPARENT'?",
    options: ["Opaque", "Clear", "Lucid", "Bright"],
    correctAnswer: "Opaque"
  },
  {
    id: 43,
    category: "Logical Reasoning",
    question: "Statements: All cars are vehicles. All vehicles have wheels. Conclusion: Do all cars have wheels?",
    options: ["Yes, true", "No, false", "Cannot be determined", "Only some cars"],
    correctAnswer: "Yes, true"
  },
  {
    id: 44,
    category: "Logical Reasoning",
    question: "Complete the analogy: Bird : Nest :: Bee : ?",
    options: ["Hive", "Tree", "Honey", "Flower"],
    correctAnswer: "Hive"
  },
  {
    id: 45,
    category: "Logical Reasoning",
    question: "If today is Wednesday, what day of the week will it be after 65 days?",
    options: ["Friday", "Thursday", "Saturday", "Sunday"],
    correctAnswer: "Friday"
  },

  // ==========================================
  // 4. NUMBER SERIES & PATTERNS (15 Questions)
  // ==========================================
  {
    id: 46,
    category: "Number Series",
    question: "Find the next number in the series: 3, 6, 12, 24, ?",
    options: ["48", "36", "42", "54"],
    correctAnswer: "48"
  },
  {
    id: 47,
    category: "Number Series",
    question: "Find the next square in the series: 1, 4, 9, 16, 25, ?",
    options: ["36", "30", "49", "32"],
    correctAnswer: "36"
  },
  {
    id: 48,
    category: "Number Series",
    question: "Find the missing number in the difference series: 2, 5, 10, 17, 26, ?",
    options: ["37", "35", "36", "38"],
    correctAnswer: "37"
  },
  {
    id: 49,
    category: "Number Series",
    question: "Find the next prime number in the sequence: 2, 3, 5, 7, 11, ?",
    options: ["13", "12", "15", "17"],
    correctAnswer: "13"
  },
  {
    id: 50,
    category: "Number Series",
    question: "Find the next number in the descending arithmetic series: 100, 93, 86, 79, ?",
    options: ["72", "70", "74", "71"],
    correctAnswer: "72"
  },
  {
    id: 51,
    category: "Number Series",
    question: "Find the next Fibonacci number: 0, 1, 1, 2, 3, 5, 8, ?",
    options: ["13", "11", "12", "14"],
    correctAnswer: "13"
  },
  {
    id: 52,
    category: "Number Series",
    question: "Find the next number in the cube series: 1, 8, 27, 64, ?",
    options: ["125", "100", "128", "216"],
    correctAnswer: "125"
  },
  {
    id: 53,
    category: "Number Series",
    question: "Find the missing number in the sequence: 7, 14, 28, 56, ?",
    options: ["112", "108", "98", "124"],
    correctAnswer: "112"
  },
  {
    id: 54,
    category: "Number Series",
    question: "Find the next number in the series: 5, 11, 23, 47, ? (Pattern: * 2 + 1)",
    options: ["95", "92", "94", "96"],
    correctAnswer: "95"
  },
  {
    id: 55,
    category: "Number Series",
    question: "Find the next number in the alternating series: 10, 20, 15, 25, 20, ?",
    options: ["30", "25", "35", "22"],
    correctAnswer: "30"
  },
  {
    id: 56,
    category: "Number Series",
    question: "Find the missing number in the series: 4, 9, 19, 39, ? (Pattern: * 2 + 1)",
    options: ["79", "78", "81", "85"],
    correctAnswer: "79"
  },
  {
    id: 57,
    category: "Number Series",
    question: "Find the next term in the arithmetic sequence: 12, 19, 26, 33, ?",
    options: ["40", "39", "41", "42"],
    correctAnswer: "40"
  },
  {
    id: 58,
    category: "Number Series",
    question: "Find the missing term: 1, 3, 7, 15, 31, ? (Difference doubles: +2, +4, +8, +16, +32)",
    options: ["63", "61", "59", "65"],
    correctAnswer: "63"
  },
  {
    id: 59,
    category: "Number Series",
    question: "Find the next number: 500, 250, 125, ? (Halving each step)",
    options: ["62.5", "60", "65", "50"],
    correctAnswer: "62.5"
  },
  {
    id: 60,
    category: "Number Series",
    question: "Find the missing number in the series: 6, 12, 20, 30, ? (Pattern: n * (n+1) starting at n=2)",
    options: ["42", "40", "44", "46"],
    correctAnswer: "42"
  }
];

module.exports = round1Questions;
