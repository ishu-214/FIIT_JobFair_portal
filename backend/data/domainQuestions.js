// Domain-Specific Question Banks for Round 2 (50 MCQs per Domain)
// Candidates receive questions tailored EXCLUSIVELY to their selected interested domain:
// - Data Analyst / Data Scientist: Python for Data Analysis, Power BI, SQL for Analytics, Data Visualization & Statistics
// - Java Full Stack Developer: HTML, CSS, JavaScript, Java, React.js, SQL
// - Python Developer: Python Core, OOP, Data Structures & SQL
// - Java Developer: Core Java, OOP, Collections, JVM & SQL
// - Frontend Developer: HTML5, CSS3, JavaScript ES6+, React.js & UI APIs
// - Backend Developer: Node.js, Express, Java/Python Backend, REST APIs & SQL

const round2Questions = require('./round2Questions');

// =========================================================================
// 1. DATA ANALYST / DATA SCIENTIST QUESTION BANK (50 Questions)
// Topics: Python for Data Analysis, Power BI, SQL for Analytics, Statistics
// =========================================================================
const dataAnalystQuestions = [
  // --- Python for Data Analysis & Pandas / NumPy (15 Questions) ---
  {
    id: 301,
    topic: "Python Data Analysis",
    question: "Which Python library is primarily used for multidimensional array manipulation and numerical operations?",
    options: ["NumPy", "Flask", "Django", "BeautifulSoup"],
    correctAnswer: "NumPy"
  },
  {
    id: 302,
    topic: "Python Data Analysis",
    question: "In Pandas, which function is used to load data from a CSV file into a DataFrame?",
    options: ["pd.read_csv()", "pd.open_csv()", "pd.load_csv()", "pd.import_csv()"],
    correctAnswer: "pd.read_csv()"
  },
  {
    id: 303,
    topic: "Python Data Analysis",
    question: "In Pandas, which method returns summary statistics like count, mean, std, min, and quartiles for numeric columns?",
    options: ["df.describe()", "df.info()", "df.summary()", "df.stats()"],
    correctAnswer: "df.describe()"
  },
  {
    id: 304,
    topic: "Python Data Analysis",
    question: "In Pandas, which method is used to remove rows containing missing or NaN values from a DataFrame?",
    options: ["df.dropna()", "df.remove_null()", "df.clean()", "df.delete_na()"],
    correctAnswer: "df.dropna()"
  },
  {
    id: 305,
    topic: "Python Data Analysis",
    question: "In Pandas, which method displays the first 5 rows of a DataFrame by default?",
    options: ["df.head()", "df.tail()", "df.first()", "df.top()"],
    correctAnswer: "df.head()"
  },
  {
    id: 306,
    topic: "Python Data Analysis",
    question: "In NumPy, how do you create a 1D array containing numbers from 0 to 9?",
    options: ["np.arange(10)", "np.array(10)", "np.range(10)", "np.zeros(10)"],
    correctAnswer: "np.arange(10)"
  },
  {
    id: 307,
    topic: "Python Data Analysis",
    question: "Which Pandas method is used to group data based on one or more column categories for aggregation?",
    options: ["df.groupby()", "df.aggregate()", "df.categorize()", "df.partition()"],
    correctAnswer: "df.groupby()"
  },
  {
    id: 308,
    topic: "Python Data Analysis",
    question: "What does `df.shape` return in Pandas?",
    options: [
      "A tuple representing (number of rows, number of columns)",
      "The memory size of the DataFrame in bytes",
      "The datatype of each column",
      "The geometric layout of visual plots"
    ],
    correctAnswer: "A tuple representing (number of rows, number of columns)"
  },
  {
    id: 309,
    topic: "Python Data Analysis",
    question: "In Pandas, what is the difference between `loc` and `iloc`?",
    options: [
      "`loc` selects data by label/name, while `iloc` selects data by integer index position",
      "`loc` works only on rows, `iloc` works only on columns",
      "`iloc` is deprecated in Pandas 2.0",
      "There is no difference between them"
    ],
    correctAnswer: "`loc` selects data by label/name, while `iloc` selects data by integer index position"
  },
  {
    id: 310,
    topic: "Python Data Analysis",
    question: "Which Python data structure is immutable and enclosed in parentheses?",
    options: ["Tuple", "List", "Dictionary", "Set"],
    correctAnswer: "Tuple"
  },
  {
    id: 311,
    topic: "Python Data Analysis",
    question: "Which Pandas method is used to fill missing NaN values with a specific replacement value (e.g. 0 or mean)?",
    options: ["df.fillna()", "df.replace_na()", "df.clean_null()", "df.impute()"],
    correctAnswer: "df.fillna()"
  },
  {
    id: 312,
    topic: "Python Data Analysis",
    question: "How do you count duplicate rows in a Pandas DataFrame?",
    options: ["df.duplicated().sum()", "df.is_copy()", "df.count_duplicates()", "df.duplicates()"],
    correctAnswer: "df.duplicated().sum()"
  },
  {
    id: 313,
    topic: "Python Data Analysis",
    question: "Which keyword is used to create an anonymous inline function in Python?",
    options: ["lambda", "def", "inline", "func"],
    correctAnswer: "lambda"
  },
  {
    id: 314,
    topic: "Python Data Analysis",
    question: "Which method is used to combine two Pandas DataFrames based on a shared common column key?",
    options: ["pd.merge()", "pd.concat()", "pd.append()", "pd.join_tables()"],
    correctAnswer: "pd.merge()"
  },
  {
    id: 315,
    topic: "Python Data Analysis",
    question: "What does `df.dtypes` show in a Pandas DataFrame?",
    options: [
      "The data type of each column in the DataFrame",
      "The total disk space occupied by the dataset",
      "The column index names only",
      "The statistical variance of columns"
    ],
    correctAnswer: "The data type of each column in the DataFrame"
  },

  // --- Power BI & Business Intelligence (15 Questions) ---
  {
    id: 316,
    topic: "Power BI",
    question: "What does DAX stand for in Microsoft Power BI and Excel?",
    options: ["Data Analysis Expressions", "Digital Analytics XML", "Database Access Extension", "Direct Analytical Syntax"],
    correctAnswer: "Data Analysis Expressions"
  },
  {
    id: 317,
    topic: "Power BI",
    question: "In Power BI, what is the key difference between a 'Measure' and a 'Calculated Column'?",
    options: [
      "Measures are evaluated dynamically based on filter context; Calculated columns are computed row-by-row and stored in memory",
      "Measures can only produce text strings, while Calculated columns only produce numbers",
      "Calculated columns are not stored in memory",
      "There is no difference in Power BI"
    ],
    correctAnswer: "Measures are evaluated dynamically based on filter context; Calculated columns are computed row-by-row and stored in memory"
  },
  {
    id: 318,
    topic: "Power BI",
    question: "What tool inside Power BI Desktop is used for Data Extraction, Transformation, and Loading (ETL)?",
    options: ["Power Query Editor", "DAX Studio", "Power View", "Power Automate"],
    correctAnswer: "Power Query Editor"
  },
  {
    id: 319,
    topic: "Power BI",
    question: "Which DAX function in Power BI calculates an expression in a modified filter context?",
    options: ["CALCULATE()", "FILTER()", "RELATED()", "SUMX()"],
    correctAnswer: "CALCULATE()"
  },
  {
    id: 320,
    topic: "Power BI",
    question: "What is the primary language used behind Power Query transformations in Power BI?",
    options: ["M language", "DAX", "VBA", "Python"],
    correctAnswer: "M language"
  },
  {
    id: 321,
    topic: "Power BI",
    question: "In Power BI data modeling, which relationship cardinality is most commonly recommended for Star Schema models?",
    options: ["One-to-Many (1:*)", "Many-to-Many (*:*)", "One-to-One (1:1)", "Cross-Join"],
    correctAnswer: "One-to-Many (1:*)"
  },
  {
    id: 322,
    topic: "Power BI",
    question: "Which visual in Power BI is best suited for showing progress toward a defined target KPI value?",
    options: ["Gauge chart (or KPI Card)", "Treemap", "Scatter chart", "Waterfall chart"],
    correctAnswer: "Gauge chart (or KPI Card)"
  },
  {
    id: 323,
    topic: "Power BI",
    question: "What does the 'Unpivot Columns' feature do in Power Query?",
    options: [
      "Transforms column headers into attribute rows, normalizing wide tables into tall datasets",
      "Deletes empty columns permanently",
      "Splits a single column by delimiter",
      "Converts numeric numbers into text strings"
    ],
    correctAnswer: "Transforms column headers into attribute rows, normalizing wide tables into tall datasets"
  },
  {
    id: 324,
    topic: "Power BI",
    question: "In Power BI, what visual element allows users to interactively filter other report visuals on a page by selecting categories or dates?",
    options: ["Slicer", "Matrix", "Ribbon chart", "Decomposition tree"],
    correctAnswer: "Slicer"
  },
  {
    id: 325,
    topic: "Power BI",
    question: "Which DAX function returns values from a related dimension table in a relationship?",
    options: ["RELATED()", "LOOKUP()", "VLOOKUP()", "CONNECT()"],
    correctAnswer: "RELATED()"
  },
  {
    id: 326,
    topic: "Power BI",
    question: "What is the difference between Import Mode and DirectQuery Mode in Power BI?",
    options: [
      "Import Mode loads data into Power BI in-memory cache; DirectQuery queries the underlying source at report run-time",
      "DirectQuery is stored in Power BI RAM, while Import mode is not",
      "Import mode only works with Excel files",
      "DirectQuery does not support SQL databases"
    ],
    correctAnswer: "Import Mode loads data into Power BI in-memory cache; DirectQuery queries the underlying source at report run-time"
  },
  {
    id: 327,
    topic: "Power BI",
    question: "Which DAX function iterates through a table row-by-row and calculates the sum of an expression?",
    options: ["SUMX()", "SUM()", "TOTAL()", "AGGREGATE()"],
    correctAnswer: "SUMX()"
  },
  {
    id: 328,
    topic: "Power BI",
    question: "What type of schema design consists of a central Fact table connected directly to Dimension tables?",
    options: ["Star Schema", "Snowflake Schema", "Galaxy Schema", "Flat Schema"],
    correctAnswer: "Star Schema"
  },
  {
    id: 329,
    topic: "Power BI",
    question: "In Power BI, which feature allows you to drill down into root-cause hierarchies and explore dimensions interactively?",
    options: ["Decomposition Tree", "Gauge", "Card Visual", "Pie Chart"],
    correctAnswer: "Decomposition Tree"
  },
  {
    id: 330,
    topic: "Power BI",
    question: "What is Row-Level Security (RLS) in Power BI used for?",
    options: [
      "Restricting data access for specific users based on filter rules/roles",
      "Encrypting power cords connecting servers",
      "Limiting the number of charts on a page",
      "Automatically backing up the dashboard file"
    ],
    correctAnswer: "Restricting data access for specific users based on filter rules/roles"
  },

  // --- SQL for Analytics (12 Questions) ---
  {
    id: 331,
    topic: "SQL for Analytics",
    question: "Which SQL clause is used to filter grouped aggregated results produced by GROUP BY?",
    options: ["HAVING", "WHERE", "ORDER BY", "DISTINCT"],
    correctAnswer: "HAVING"
  },
  {
    id: 332,
    topic: "SQL for Analytics",
    question: "In SQL, which aggregate function calculates the average value of a numeric column?",
    options: ["AVG()", "MEAN()", "COUNT()", "TOTAL()"],
    correctAnswer: "AVG()"
  },
  {
    id: 333,
    topic: "SQL for Analytics",
    question: "Which SQL join returns all rows from the left table and matched records from the right table, with NULLs for unmatched right records?",
    options: ["LEFT OUTER JOIN", "INNER JOIN", "CROSS JOIN", "NATURAL JOIN"],
    correctAnswer: "LEFT OUTER JOIN"
  },
  {
    id: 334,
    topic: "SQL for Analytics",
    question: "Which SQL keyword eliminates duplicate rows from query results?",
    options: ["DISTINCT", "UNIQUE", "DIFFERENT", "FILTER"],
    correctAnswer: "DISTINCT"
  },
  {
    id: 335,
    topic: "SQL for Analytics",
    question: "What will `SELECT COUNT(*)` return when querying an empty table?",
    options: ["0", "NULL", "Error", "-1"],
    correctAnswer: "0"
  },
  {
    id: 336,
    topic: "SQL for Analytics",
    question: "Which SQL clause is used to sort the result records in descending order?",
    options: ["ORDER BY column_name DESC", "SORT BY column_name DOWN", "GROUP BY column_name DESC", "ARRANGE DESC"],
    correctAnswer: "ORDER BY column_name DESC"
  },
  {
    id: 337,
    topic: "SQL for Analytics",
    question: "What is the difference between `COUNT(*)` and `COUNT(column_name)` in SQL?",
    options: [
      "`COUNT(*)` counts all rows including NULLs; `COUNT(column_name)` ignores NULL values in that column",
      "`COUNT(*)` ignores NULLs; `COUNT(column_name)` includes NULLs",
      "They return identical results under all circumstances",
      "`COUNT(*)` causes an error if NULLs exist"
    ],
    correctAnswer: "`COUNT(*)` counts all rows including NULLs; `COUNT(column_name)` ignores NULL values in that column"
  },
  {
    id: 338,
    topic: "SQL for Analytics",
    question: "Which SQL operator is used to search for a specified pattern in a column using wildcards like '%'?",
    options: ["LIKE", "IN", "BETWEEN", "CONTAINS"],
    correctAnswer: "LIKE"
  },
  {
    id: 339,
    topic: "SQL for Analytics",
    question: "Which SQL function extracts the highest numeric value from a column?",
    options: ["MAX()", "TOP()", "HIGH()", "UPPER()"],
    correctAnswer: "MAX()"
  },
  {
    id: 340,
    topic: "SQL for Analytics",
    question: "What does the `BETWEEN 10 AND 50` operator in SQL include?",
    options: [
      "Values from 10 to 50 inclusively (both 10 and 50 are included)",
      "Values strictly greater than 10 and strictly less than 50",
      "Only the numbers 10 and 50",
      "Even numbers between 10 and 50 only"
    ],
    correctAnswer: "Values from 10 to 50 inclusively (both 10 and 50 are included)"
  },
  {
    id: 341,
    topic: "SQL for Analytics",
    question: "In SQL, what is the role of a Primary Key?",
    options: [
      "Uniquely identifies each record in a table and cannot contain NULL values",
      "Allows duplicate records for backup redundancy",
      "A key used exclusively for encrypting database passwords",
      "A foreign index referencing another table"
    ],
    correctAnswer: "Uniquely identifies each record in a table and cannot contain NULL values"
  },
  {
    id: 342,
    topic: "SQL for Analytics",
    question: "What is the result of `SELECT 10 + NULL` in standard SQL?",
    options: ["NULL", "10", "0", "Syntax Error"],
    correctAnswer: "NULL"
  },

  // --- Data Visualization & Statistics (8 Questions) ---
  {
    id: 343,
    topic: "Data Analytics & Statistics",
    question: "Which Python visualization library is built on top of Matplotlib and provides a high-level statistical interface?",
    options: ["Seaborn", "PyQt", "Tkinter", "Kivy"],
    correctAnswer: "Seaborn"
  },
  {
    id: 344,
    topic: "Data Analytics & Statistics",
    question: "What type of chart is best suited for visualizing the distribution of continuous numerical data through bins?",
    options: ["Histogram", "Pie Chart", "Line Chart", "Donut Chart"],
    correctAnswer: "Histogram"
  },
  {
    id: 345,
    topic: "Data Analytics & Statistics",
    question: "What is the key difference between Mean and Median when handling data with severe outliers?",
    options: [
      "Median is robust against extreme outliers, while Mean is significantly skewed by outliers",
      "Mean is never affected by extreme values",
      "Median and Mean are always identical in any dataset",
      "Outliers only affect the Median"
    ],
    correctAnswer: "Median is robust against extreme outliers, while Mean is significantly skewed by outliers"
  },
  {
    id: 346,
    topic: "Data Analytics & Statistics",
    question: "What chart is specifically designed to show quartiles, median, and outlier points of a dataset?",
    options: ["Box Plot (Box and Whisker)", "Scatter Plot", "Pie Chart", "Radar Chart"],
    correctAnswer: "Box Plot (Box and Whisker)"
  },
  {
    id: 347,
    topic: "Data Analytics & Statistics",
    question: "What statistical metric measures the strength and direction of a linear relationship between two continuous variables?",
    options: ["Correlation coefficient (r)", "Standard error", "Variance inflation factor", "Chi-square value"],
    correctAnswer: "Correlation coefficient (r)"
  },
  {
    id: 348,
    topic: "Data Analytics & Statistics",
    question: "In data analytics, what does 'Imputation' refer to?",
    options: [
      "Replacing missing or null data with estimated substituted values (mean, median, mode)",
      "Deleting the entire database table",
      "Compressing CSV files into ZIP archives",
      "Translating SQL into Python code"
    ],
    correctAnswer: "Replacing missing or null data with estimated substituted values (mean, median, mode)"
  },
  {
    id: 349,
    topic: "Data Analytics & Statistics",
    question: "What does a Scatter Plot primarily show in data exploration (EDA)?",
    options: [
      "Relationship and correlation between two numerical variables",
      "Hierarchical folder storage of files",
      "Percentage share of 3 categories",
      "Server CPU load over 24 hours"
    ],
    correctAnswer: "Relationship and correlation between two numerical variables"
  },
  {
    id: 350,
    topic: "Data Analytics & Statistics",
    question: "In statistics, what is the 'Mode' of a dataset?",
    options: [
      "The value that appears most frequently in the dataset",
      "The sum of all values divided by count",
      "The middle value when sorted",
      "The difference between maximum and minimum values"
    ],
    correctAnswer: "The value that appears most frequently in the dataset"
  }
];

// =========================================================================
// 2. JAVA FULL STACK DEVELOPER QUESTION BANK (50 Questions)
// Topics: Java, HTML, CSS, JavaScript, React.js, SQL
// =========================================================================
const javaFullStackQuestions = [
  ...round2Questions.filter(q => q.topic === 'Java').slice(0, 10),
  ...round2Questions.filter(q => q.topic === 'HTML').slice(0, 8),
  ...round2Questions.filter(q => q.topic === 'CSS').slice(0, 8),
  ...round2Questions.filter(q => q.topic === 'JavaScript').slice(0, 8),
  ...round2Questions.filter(q => q.topic === 'React.js').slice(0, 8),
  ...round2Questions.filter(q => q.topic === 'SQL').slice(0, 8)
];

// =========================================================================
// 3. PYTHON DEVELOPER QUESTION BANK (50 Questions)
// =========================================================================
const pythonQuestions = [
  ...round2Questions.filter(q => q.topic === 'Python'),
  ...dataAnalystQuestions.filter(q => q.topic === 'Python Data Analysis'),
  ...round2Questions.filter(q => q.topic === 'SQL')
];

// =========================================================================
// 4. JAVA DEVELOPER QUESTION BANK (50 Questions)
// =========================================================================
const javaQuestions = [
  ...round2Questions.filter(q => q.topic === 'Java'),
  ...round2Questions.filter(q => q.topic === 'SQL')
];

// Pad Java to 50 if needed
while (javaQuestions.length < 50) {
  javaQuestions.push(...round2Questions.filter(q => q.topic === 'Java' || q.topic === 'SQL'));
}

// =========================================================================
// 5. FRONTEND DEVELOPER QUESTION BANK (50 Questions)
// =========================================================================
const frontendQuestions = [
  ...round2Questions.filter(q => ['HTML', 'CSS', 'JavaScript', 'React.js'].includes(q.topic))
];

// Pad frontend to 50 if needed
while (frontendQuestions.length < 50) {
  frontendQuestions.push(...round2Questions.filter(q => ['HTML', 'CSS', 'JavaScript', 'React.js'].includes(q.topic)));
}

// =========================================================================
// 6. BACKEND DEVELOPER QUESTION BANK (50 Questions)
// =========================================================================
const backendQuestions = [
  ...round2Questions.filter(q => ['Java', 'Python', 'SQL', 'JavaScript'].includes(q.topic))
];

while (backendQuestions.length < 50) {
  backendQuestions.push(...round2Questions.filter(q => ['Java', 'SQL', 'JavaScript'].includes(q.topic)));
}

// Mapping of domain name to question bank
const domainQuestionsMap = {
  'Data Analyst / Data Scientist': dataAnalystQuestions,
  'Data Analyst': dataAnalystQuestions,
  'Data Scientist': dataAnalystQuestions,
  'Java Full Stack Developer': javaFullStackQuestions,
  'Full Stack Developer': javaFullStackQuestions,
  'Python Developer': pythonQuestions,
  'Java Developer': javaQuestions,
  'Frontend Developer': frontendQuestions,
  'Backend Developer': backendQuestions
};

// Return randomized domain questions ensuring 50 questions
function getQuestionsForDomain(domainName, count = 50) {
  let pool = domainQuestionsMap[domainName] || javaFullStackQuestions;
  if (!pool || pool.length === 0) pool = javaFullStackQuestions;

  // Shuffle pool
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

module.exports = {
  domainQuestionsMap,
  dataAnalystQuestions,
  javaFullStackQuestions,
  getQuestionsForDomain
};
