// Round 2: Technical Assessment Question Bank (Medium Level)
// Covers: Java, Python, HTML, CSS, JavaScript, React.js, SQL
// Total 75 questions bank, 50 questions sampled and shuffled per student. Pass mark: 35.

const round2Questions = [
  // --- JAVA (11 Questions) ---
  {
    id: 101,
    topic: "Java",
    question: "What is the key difference between JVM, JRE, and JDK in Java?",
    options: [
      "JDK contains JRE and development tools; JRE contains JVM and libraries; JVM executes bytecode",
      "JVM is for writing code, JRE is for compiling code, and JDK is for running code",
      "JDK and JRE are identical, while JVM is only used for Android",
      "JVM contains JDK and JRE"
    ],
    correctAnswer: "JDK contains JRE and development tools; JRE contains JVM and libraries; JVM executes bytecode"
  },
  {
    id: 102,
    topic: "Java",
    question: "Why are String objects immutable in Java?",
    options: [
      "For security, synchronization, caching in the String Constant Pool, and hashcode caching",
      "Because Java does not support pointers",
      "To prevent inheritance of primitive types",
      "Because String extends the FinalInterface class"
    ],
    correctAnswer: "For security, synchronization, caching in the String Constant Pool, and hashcode caching"
  },
  {
    id: 103,
    topic: "Java",
    question: "What happens if a class implements an interface but does not provide implementations for all abstract methods?",
    options: [
      "The class must be declared as abstract, otherwise a compilation error occurs",
      "The code compiles successfully and automatically returns null for unimplemented methods",
      "A runtime NoSuchMethodException is thrown",
      "The compiler creates default empty bodies automatically"
    ],
    correctAnswer: "The class must be declared as abstract, otherwise a compilation error occurs"
  },
  {
    id: 104,
    topic: "Java",
    question: "What is the difference between '==' and '.equals()' method when comparing two non-primitive objects in Java?",
    options: [
      "'==' checks memory reference equality, whereas '.equals()' can be overridden to check content equality",
      "'==' checks value equality, whereas '.equals()' checks memory address",
      "There is no difference between them",
      "'.equals()' only works with primitive types"
    ],
    correctAnswer: "'==' checks memory reference equality, whereas '.equals()' can be overridden to check content equality"
  },
  {
    id: 105,
    topic: "Java",
    question: "In Java Collections, which class is synchronized and thread-safe by default?",
    options: ["Vector", "ArrayList", "LinkedList", "HashSet"],
    correctAnswer: "Vector"
  },
  {
    id: 106,
    topic: "Java",
    question: "Which Object-Oriented concept allows a subclass to provide its own specific implementation of a method defined in its parent class?",
    options: [
      "Method Overriding (Runtime Polymorphism)",
      "Method Overloading (Compile-time Polymorphism)",
      "Data Encapsulation",
      "Multiple Inheritance"
    ],
    correctAnswer: "Method Overriding (Runtime Polymorphism)"
  },
  {
    id: 107,
    topic: "Java",
    question: "Can an abstract class in Java have a constructor?",
    options: [
      "Yes, and it is called when an instance of a subclass is created",
      "No, abstract classes cannot have constructors because they cannot be instantiated",
      "Yes, but it can only be invoked using static methods",
      "No, constructors are strictly forbidden in abstract classes"
    ],
    correctAnswer: "Yes, and it is called when an instance of a subclass is created"
  },
  {
    id: 108,
    topic: "Java",
    question: "What is the purpose of the 'finally' block in Java exception handling?",
    options: [
      "To execute clean-up code regardless of whether an exception was thrown or caught",
      "To handle only fatal unchecked exceptions",
      "To re-throw the caught exception to the caller method",
      "To execute only when no exception occurs"
    ],
    correctAnswer: "To execute clean-up code regardless of whether an exception was thrown or caught"
  },
  {
    id: 109,
    topic: "Java",
    question: "What is a primary difference between a standard Array and an ArrayList in Java?",
    options: [
      "An Array has a fixed size upon creation, while an ArrayList can dynamically resize as elements are added",
      "An Array can store primitive types, whereas an ArrayList can never store objects",
      "An ArrayList is always faster than a standard Array for random index access",
      "There is no difference; ArrayList is simply an alias for Array"
    ],
    correctAnswer: "An Array has a fixed size upon creation, while an ArrayList can dynamically resize as elements are added"
  },
  {
    id: 110,
    topic: "Java",
    question: "Which of the following is true regarding method overloading and method overriding in Java?",
    options: [
      "Overloading occurs at compile-time within the same class; overriding occurs at runtime in a subclass",
      "Overloading requires inheritance; overriding does not",
      "Overriding occurs at compile-time; overloading occurs at runtime",
      "Return types must be different for method overriding"
    ],
    correctAnswer: "Overloading occurs at compile-time within the same class; overriding occurs at runtime in a subclass"
  },
  {
    id: 111,
    topic: "Java",
    question: "What is the output of `System.out.println(10 + 20 + \"Hello\" + 10 + 20);` in Java?",
    options: [
      "30Hello1020",
      "30Hello30",
      "1020Hello1020",
      "Compilation error"
    ],
    correctAnswer: "30Hello1020"
  },

  // --- PYTHON (11 Questions) ---
  {
    id: 112,
    topic: "Python",
    question: "Which keyword is used to define a function in Python?",
    options: ["def", "function", "func", "define"],
    correctAnswer: "def"
  },
  {
    id: 113,
    topic: "Python",
    question: "What is the difference between a Python List and a Tuple?",
    options: [
      "Lists are mutable and enclosed in square brackets; Tuples are immutable and enclosed in parentheses",
      "Lists can only store numbers; Tuples store any datatype",
      "Tuples are mutable; Lists are immutable",
      "There is no functional difference; only syntax differs"
    ],
    correctAnswer: "Lists are mutable and enclosed in square brackets; Tuples are immutable and enclosed in parentheses"
  },
  {
    id: 114,
    topic: "Python",
    question: "What will `print([i * 2 for i in range(5) if i % 2 == 0])` output?",
    options: [
      "[0, 4, 8]",
      "[0, 2, 4]",
      "[0, 2, 4, 6, 8]",
      "[4, 8]"
    ],
    correctAnswer: "[0, 4, 8]"
  },
  {
    id: 115,
    topic: "Python",
    question: "How does a Python generator function differ from a regular function?",
    options: [
      "It uses the `yield` keyword to return an iterator that produces values lazily one at a time",
      "It executes asynchronously on GPU cores",
      "It cannot take any arguments",
      "It automatically runs in a background thread"
    ],
    correctAnswer: "It uses the `yield` keyword to return an iterator that produces values lazily one at a time"
  },
  {
    id: 116,
    topic: "Python",
    question: "What does the `*args` and `**kwargs` syntax in a Python function definition allow?",
    options: [
      "`*args` accepts variable positional arguments as a tuple, `**kwargs` accepts variable keyword arguments as a dictionary",
      "`*args` accepts dictionary arguments and `**kwargs` accepts tuple arguments",
      "They enforce strict type checking on function parameters",
      "They are pointers similar to C pointers"
    ],
    correctAnswer: "`*args` accepts variable positional arguments as a tuple, `**kwargs` accepts variable keyword arguments as a dictionary"
  },
  {
    id: 117,
    topic: "Python",
    question: "Which built-in Python list method is used to append a new element to the end of an existing list?",
    options: ["append()", "insert()", "push()", "add()"],
    correctAnswer: "append()"
  },
  {
    id: 118,
    topic: "Python",
    question: "What is the result of `bool([])`, `bool({})`, and `bool('False')` in Python?",
    options: [
      "False, False, True",
      "False, False, False",
      "True, True, False",
      "False, True, True"
    ],
    correctAnswer: "False, False, True"
  },
  {
    id: 119,
    topic: "Python",
    question: "What is a Python decorator?",
    options: [
      "A callable that takes another function as an argument and extends its behavior without explicitly modifying it",
      "A graphical theme applied to Tkinter windows",
      "A special comment formatted with HTML tags",
      "A type of class that cannot be inherited"
    ],
    correctAnswer: "A callable that takes another function as an argument and extends its behavior without explicitly modifying it"
  },
  {
    id: 120,
    topic: "Python",
    question: "Which built-in Python function returns the total number of items in a list, tuple, dictionary, or string?",
    options: ["len()", "length()", "size()", "count()"],
    correctAnswer: "len()"
  },
  {
    id: 121,
    topic: "Python",
    question: "What will `type(lambda x: x + 1)` return in Python?",
    options: ["<class 'function'>", "<class 'lambda'>", "<class 'method'>", "<class 'object'>"],
    correctAnswer: "<class 'function'>"
  },
  {
    id: 122,
    topic: "Python",
    question: "What is the output of `print(type({}))` vs `print(type({1}))` in Python?",
    options: [
      "<class 'dict'> and <class 'set'>",
      "<class 'set'> and <class 'dict'>",
      "<class 'dict'> and <class 'dict'>",
      "<class 'set'> and <class 'set'>"
    ],
    correctAnswer: "<class 'dict'> and <class 'set'>"
  },

  // --- HTML (10 Questions) ---
  {
    id: 123,
    topic: "HTML",
    question: "What is semantic HTML and why is it important?",
    options: [
      "Using tags that convey the meaning of the content (e.g. <article>, <nav>, <header>), improving accessibility and SEO",
      "Writing HTML without any closing tags to save bandwidth",
      "Using inline CSS styles inside HTML tags",
      "Writing HTML using XML namespaces only"
    ],
    correctAnswer: "Using tags that convey the meaning of the content (e.g. <article>, <nav>, <header>), improving accessibility and SEO"
  },
  {
    id: 124,
    topic: "HTML",
    question: "What is the difference between `localStorage`, `sessionStorage`, and `cookies` in web browsers?",
    options: [
      "`localStorage` persists until cleared, `sessionStorage` lasts for the tab session, cookies are sent with HTTP requests and have expiry",
      "`localStorage` clears on page reload, while `sessionStorage` never expires",
      "Cookies can store up to 50MB, whereas `localStorage` is limited to 4KB",
      "`sessionStorage` is shared across all browser windows permanently"
    ],
    correctAnswer: "`localStorage` persists until cleared, `sessionStorage` lasts for the tab session, cookies are sent with HTTP requests and have expiry"
  },
  {
    id: 125,
    topic: "HTML",
    question: "What does the `async` attribute do when loading a `<script>` tag in HTML5?",
    options: [
      "Downloads the script in parallel with HTML parsing and executes it as soon as it is downloaded",
      "Delays execution until the entire DOM is parsed and loaded",
      "Forces synchronous download blocking HTML parsing",
      "Executes the script on a Web Worker thread automatically"
    ],
    correctAnswer: "Downloads the script in parallel with HTML parsing and executes it as soon as it is downloaded"
  },
  {
    id: 126,
    topic: "HTML",
    question: "How does `defer` attribute differ from `async` attribute in a `<script>` tag?",
    options: [
      "`defer` scripts execute in order after DOM parsing completes, whereas `async` executes as soon as downloaded regardless of order",
      "`defer` blocks DOM rendering until loaded",
      "`defer` is only supported in Internet Explorer",
      "`async` guarantees execution order of scripts"
    ],
    correctAnswer: "`defer` scripts execute in order after DOM parsing completes, whereas `async` executes as soon as downloaded regardless of order"
  },
  {
    id: 127,
    topic: "HTML",
    question: "Which HTML5 element is used to specify independent, self-contained content such as a blog post or news story?",
    options: ["<article>", "<section>", "<aside>", "<div>"],
    correctAnswer: "<article>"
  },
  {
    id: 128,
    topic: "HTML",
    question: "What is the purpose of the `alt` attribute on an `<img>` tag?",
    options: [
      "Provides alternative text for screen readers and when the image fails to load",
      "Specifies the image tooltip shown on mouse hover",
      "Defines the fallback image URL",
      "Sets the image alignment on the page"
    ],
    correctAnswer: "Provides alternative text for screen readers and when the image fails to load"
  },
  {
    id: 129,
    topic: "HTML",
    question: "What is the purpose of `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">`?",
    options: [
      "Ensures responsive page layout adapts to different mobile and desktop device screen widths",
      "Forces high-definition zoom mode on desktop screens",
      "Increases website loading speed by compressing images",
      "Enables webcam permissions in modern browsers"
    ],
    correctAnswer: "Ensures responsive page layout adapts to different mobile and desktop device screen widths"
  },
  {
    id: 130,
    topic: "HTML",
    question: "Which input type in HTML5 includes built-in email format validation when submitted within a form?",
    options: ["<input type=\"email\">", "<input type=\"mail\">", "<input type=\"text\" validate=\"email\">", "<input type=\"address\">"],
    correctAnswer: "<input type=\"email\">"
  },
  {
    id: 131,
    topic: "HTML",
    question: "What does the `target=\"_blank\"` attribute on an `<a>` anchor tag do?",
    options: [
      "Opens the linked document in a new tab or browser window",
      "Downloads the linked file directly",
      "Opens the link in the same parent frame",
      "Opens the link in full screen modal"
    ],
    correctAnswer: "Opens the linked document in a new tab or browser window"
  },
  {
    id: 132,
    topic: "HTML",
    question: "Which HTML element is used to define a hyperlink that connects to another webpage or document?",
    options: ["<a>", "<link>", "<href>", "<navigate>"],
    correctAnswer: "<a>"
  },

  // --- CSS (10 Questions) ---
  {
    id: 133,
    topic: "CSS",
    question: "What is the CSS Box Model composed of, from inside to outside?",
    options: [
      "Content, Padding, Border, Margin",
      "Content, Margin, Border, Padding",
      "Border, Margin, Padding, Content",
      "Content, Border, Padding, Outline"
    ],
    correctAnswer: "Content, Padding, Border, Margin"
  },
  {
    id: 134,
    topic: "CSS",
    question: "What does `box-sizing: border-box;` do?",
    options: [
      "Includes padding and border in the element's total specified width and height",
      "Removes margins from the element",
      "Forces borders to be solid black",
      "Excludes padding and border, adding them outside width"
    ],
    correctAnswer: "Includes padding and border in the element's total specified width and height"
  },
  {
    id: 135,
    topic: "CSS",
    question: "In CSS Flexbox, what is the default value of `flex-direction`?",
    options: ["row", "column", "row-reverse", "initial"],
    correctAnswer: "row"
  },
  {
    id: 136,
    topic: "CSS",
    question: "What is the difference between `justify-content` and `align-items` in Flexbox?",
    options: [
      "`justify-content` aligns items along the main axis, while `align-items` aligns along the cross axis",
      "`justify-content` aligns vertically, while `align-items` aligns horizontally",
      "`justify-content` only affects text, while `align-items` affects child divs",
      "They are interchangeable synonyms"
    ],
    correctAnswer: "`justify-content` aligns items along the main axis, while `align-items` aligns along the cross axis"
  },
  {
    id: 137,
    topic: "CSS",
    question: "In CSS, which selector prefix is used to target an HTML element by its 'id' attribute?",
    options: ["# (Hash symbol)", ". (Period / Dot)", "* (Asterisk)", "@ (At symbol)"],
    correctAnswer: "# (Hash symbol)"
  },
  {
    id: 138,
    topic: "CSS",
    question: "How does `position: absolute;` behave in CSS?",
    options: [
      "Positions the element relative to its nearest positioned (non-static) ancestor",
      "Positions the element strictly relative to the browser viewport at all times",
      "Keeps the element in the normal document flow but adds offsets",
      "Positions the element relative to the nearest block-level sibling"
    ],
    correctAnswer: "Positions the element relative to its nearest positioned (non-static) ancestor"
  },
  {
    id: 139,
    topic: "CSS",
    question: "What is the difference between `display: none;` and `visibility: hidden;`?",
    options: [
      "`display: none;` removes element from document flow; `visibility: hidden;` hides element but preserves its space",
      "`display: none;` makes the element translucent; `visibility: hidden;` deletes it completely",
      "`visibility: hidden;` triggers reflow; `display: none;` does not",
      "There is no difference in rendering"
    ],
    correctAnswer: "`display: none;` removes element from document flow; `visibility: hidden;` hides element but preserves its space"
  },
  {
    id: 140,
    topic: "CSS",
    question: "In CSS Grid, what does `grid-template-columns: repeat(3, 1fr);` achieve?",
    options: [
      "Creates 3 equal-width columns sharing the available grid track space",
      "Creates 3 rows of 1 pixel each",
      "Repeats the first column 3 times vertically",
      "Creates a responsive column that shrinks to minimum size"
    ],
    correctAnswer: "Creates 3 equal-width columns sharing the available grid track space"
  },
  {
    id: 141,
    topic: "CSS",
    question: "What does the `rem` unit in CSS measure relative to?",
    options: [
      "The font-size of the root `<html>` element",
      "The font-size of the immediate parent element",
      "The screen resolution in device pixels",
      "The width of the viewport divided by 100"
    ],
    correctAnswer: "The font-size of the root `<html>` element"
  },
  {
    id: 142,
    topic: "CSS",
    question: "Which CSS property is used to change the background color of an element?",
    options: ["background-color", "color", "bgcolor", "canvas-color"],
    correctAnswer: "background-color"
  },

  // --- JAVASCRIPT (11 Questions) ---
  {
    id: 143,
    topic: "JavaScript",
    question: "What is a Closure in JavaScript?",
    options: [
      "A function that retains access to its lexical scope even when executed outside that scope",
      "A method that closes browser tabs automatically",
      "A syntax error caused by unclosed curly brackets",
      "A variable that is destroyed as soon as the function returns"
    ],
    correctAnswer: "A function that retains access to its lexical scope even when executed outside that scope"
  },
  {
    id: 144,
    topic: "JavaScript",
    question: "What will `console.log(typeof NaN)` output in JavaScript?",
    options: ["number", "NaN", "undefined", "object"],
    correctAnswer: "number"
  },
  {
    id: 145,
    topic: "JavaScript",
    question: "What is the difference between `==` and `===` in JavaScript?",
    options: [
      "`==` performs type coercion before comparison, whereas `===` checks both value and type without coercion",
      "`===` converts strings to numbers automatically",
      "`==` is used for objects, while `===` is only for primitives",
      "They are completely identical in ES6+"
    ],
    correctAnswer: "`==` performs type coercion before comparison, whereas `===` checks both value and type without coercion"
  },
  {
    id: 146,
    topic: "JavaScript",
    question: "Which JavaScript array method creates a new array filled with elements that pass a given test condition?",
    options: ["filter()", "map()", "forEach()", "reduce()"],
    correctAnswer: "filter()"
  },
  {
    id: 147,
    topic: "JavaScript",
    question: "What will be the output of `console.log(1 + '2' + 3)` and `console.log(1 - '2' + 3)`?",
    options: [
      "'123' and 2",
      "'15' and 2",
      "'123' and NaN",
      "6 and 2"
    ],
    correctAnswer: "'123' and 2"
  },
  {
    id: 148,
    topic: "JavaScript",
    question: "What is the key difference between `var`, `let`, and `const` in JavaScript?",
    options: [
      "`var` is function-scoped and hoisted; `let` and `const` are block-scoped and subject to Temporal Dead Zone",
      "`let` is global scoped, `var` is block scoped",
      "`const` values can never have their internal object properties modified",
      "`var` does not allow reassignment"
    ],
    correctAnswer: "`var` is function-scoped and hoisted; `let` and `const` are block-scoped and subject to Temporal Dead Zone"
  },
  {
    id: 149,
    topic: "JavaScript",
    question: "What does `Promise.all([p1, p2, p3])` do when one of the promises rejects?",
    options: [
      "Immediately rejects with the reason of the first rejected promise",
      "Waits for all other promises to resolve and ignores the rejection",
      "Returns an array containing null for the failed promise",
      "Retries the rejected promise 3 times"
    ],
    correctAnswer: "Immediately rejects with the reason of the first rejected promise"
  },
  {
    id: 150,
    topic: "JavaScript",
    question: "Which JavaScript method is used to convert a JavaScript object into a JSON formatted string?",
    options: ["JSON.stringify()", "JSON.parse()", "Object.toJSON()", "JSON.encode()"],
    correctAnswer: "JSON.stringify()"
  },
  {
    id: 151,
    topic: "JavaScript",
    question: "What is Event Bubbling in JavaScript?",
    options: [
      "The event starts at the target element and propagates upwards through ancestors to the window",
      "The event starts at window and travels down to target element",
      "Events are executed in random asynchronous order",
      "Multiple events firing at the exact same millisecond"
    ],
    correctAnswer: "The event starts at the target element and propagates upwards through ancestors to the window"
  },
  {
    id: 152,
    topic: "JavaScript",
    question: "What does the `Array.prototype.reduce()` method do in JavaScript?",
    options: [
      "Executes a reducer callback on each element, resulting in a single cumulative output value",
      "Shrinks the length of the array by removing duplicate elements",
      "Filters out negative numbers",
      "Sorts the array in descending order"
    ],
    correctAnswer: "Executes a reducer callback on each element, resulting in a single cumulative output value"
  },
  {
    id: 153,
    topic: "JavaScript",
    question: "Which keyword in JavaScript declares a block-scoped variable whose value cannot be reassigned?",
    options: ["const", "let", "var", "immutable"],
    correctAnswer: "const"
  },

  // --- REACT.JS (11 Questions) ---
  {
    id: 154,
    topic: "React.js",
    question: "What is the Virtual DOM in React and how does it optimize performance?",
    options: [
      "A lightweight in-memory representation of real DOM; React diffs it and batches minimal updates to real DOM",
      "A separate browser plugin that accelerates HTML rendering",
      "A shadow DOM used only for styling CSS isolation",
      "Direct direct manipulation of browser memory buffers"
    ],
    correctAnswer: "A lightweight in-memory representation of real DOM; React diffs it and batches minimal updates to real DOM"
  },
  {
    id: 155,
    topic: "React.js",
    question: "Why should `key` prop be provided when rendering lists in React?",
    options: [
      "Helps React identify which items have changed, been added, or removed during reconciliation",
      "Sets the CSS z-index order of list items",
      "Assigns a unique HTML id attribute to each DOM node",
      "Prevents memory leaks in React garbage collection"
    ],
    correctAnswer: "Helps React identify which items have changed, been added, or removed during reconciliation"
  },
  {
    id: 156,
    topic: "React.js",
    question: "What is the purpose of the `useEffect` cleanup function in React?",
    options: [
      "To unsubscribe from event listeners, clear timers, or cancel network requests before component unmounts or re-runs effect",
      "To delete components from Redux store",
      "To clear browser cookies when closing the website",
      "To reset component state to initial values automatically"
    ],
    correctAnswer: "To unsubscribe from event listeners, clear timers, or cancel network requests before component unmounts or re-runs effect"
  },
  {
    id: 157,
    topic: "React.js",
    question: "What is the primary purpose of 'props' in React components?",
    options: [
      "To pass data and event handlers from a parent component down to a child component",
      "To manage local state that changes within a single component",
      "To directly modify browser window cookies",
      "To query the SQL database directly from the component"
    ],
    correctAnswer: "To pass data and event handlers from a parent component down to a child component"
  },
  {
    id: 158,
    topic: "React.js",
    question: "What happens when you update state in React using `setState` or `useState` updater?",
    options: [
      "State updates are asynchronous/batched; React schedules a re-render of the component",
      "The real DOM is updated immediately before any JavaScript execution continues",
      "The entire browser window is refreshed",
      "The component constructor is executed again"
    ],
    correctAnswer: "State updates are asynchronous/batched; React schedules a re-render of the component"
  },
  {
    id: 159,
    topic: "React.js",
    question: "What is 'prop drilling' in React and how can it be avoided?",
    options: [
      "Passing props down multiple nested component layers; solved using Context API or state management libraries (Redux, Zustand)",
      "A bug where props are mutated accidentally inside child components",
      "A technique for accelerating prop passing using Web Workers",
      "Converting class props into JSON objects"
    ],
    correctAnswer: "Passing props down multiple nested component layers; solved using Context API or state management libraries (Redux, Zustand)"
  },
  {
    id: 160,
    topic: "React.js",
    question: "What is a React PureComponent or `React.memo`?",
    options: [
      "It prevents re-rendering if props and state haven't changed using a shallow comparison",
      "A component that has no JSX return statement",
      "A component that cannot receive any props",
      "A component rendered directly on server side only"
    ],
    correctAnswer: "It prevents re-rendering if props and state haven't changed using a shallow comparison"
  },
  {
    id: 161,
    topic: "React.js",
    question: "What is the rule of React Hooks?",
    options: [
      "Hooks must be called at top level only (not inside loops, conditions, or nested functions) and only inside React functions",
      "Hooks must be called inside class constructor methods",
      "Hooks can only be used in production mode",
      "Hooks must always take at least two arguments"
    ],
    correctAnswer: "Hooks must be called at top level only (not inside loops, conditions, or nested functions) and only inside React functions"
  },
  {
    id: 162,
    topic: "React.js",
    question: "What is the purpose of `useRef` hook in React?",
    options: [
      "To persist a mutable value across renders without causing re-render, or to access DOM elements directly",
      "To trigger re-renders whenever reference value changes",
      "To connect with external SQL databases",
      "To create reactive CSS variables"
    ],
    correctAnswer: "To persist a mutable value across renders without causing re-render, or to access DOM elements directly"
  },
  {
    id: 163,
    topic: "React.js",
    question: "Which React hook is used to declare and update state variables inside a functional component?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: "useState"
  },
  {
    id: 164,
    topic: "React.js",
    question: "What will happen if an empty dependency array `[]` is passed to `useEffect`?",
    options: [
      "The effect will run only once after the initial render (component mount)",
      "The effect will run after every single re-render",
      "The effect will never run",
      "It will trigger an infinite loop"
    ],
    correctAnswer: "The effect will run only once after the initial render (component mount)"
  },

  // --- SQL (11 Questions) ---
  {
    id: 165,
    topic: "SQL",
    question: "What is the difference between `WHERE` and `HAVING` clauses in SQL?",
    options: [
      "`WHERE` filters rows before grouping/aggregation; `HAVING` filters groups after `GROUP BY` aggregation",
      "`WHERE` can only be used with numeric data; `HAVING` works with strings",
      "`HAVING` filters rows before `WHERE` is applied",
      "There is no difference; they are interchangeable"
    ],
    correctAnswer: "`WHERE` filters rows before grouping/aggregation; `HAVING` filters groups after `GROUP BY` aggregation"
  },
  {
    id: 166,
    topic: "SQL",
    question: "What is the difference between `LEFT JOIN` and `INNER JOIN` in SQL?",
    options: [
      "`INNER JOIN` returns only matching rows from both tables; `LEFT JOIN` returns all rows from left table and matched rows from right",
      "`LEFT JOIN` returns only rows that have no match in the right table",
      "`INNER JOIN` returns all records from both tables regardless of match",
      "`LEFT JOIN` is significantly faster because it avoids foreign key checks"
    ],
    correctAnswer: "`INNER JOIN` returns only matching rows from both tables; `LEFT JOIN` returns all rows from left table and matched rows from right"
  },
  {
    id: 167,
    topic: "SQL",
    question: "What does ACID stand for in relational database management systems (RDBMS)?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Accuracy, Concurrency, Integrity, Durability",
      "Access, Control, Identification, Data",
      "Atomicity, Centralization, Indexing, Distribution"
    ],
    correctAnswer: "Atomicity, Consistency, Isolation, Durability"
  },
  {
    id: 168,
    topic: "SQL",
    question: "What is the difference between `DELETE`, `TRUNCATE`, and `DROP` in SQL?",
    options: [
      "`DELETE` is DML (can rollback, row-by-row); `TRUNCATE` is DDL (fast, removes all rows); `DROP` deletes table schema and data completely",
      "`TRUNCATE` deletes table structure; `DELETE` removes column names",
      "`DROP` only clears row values leaving schema intact",
      "`DELETE` cannot use a WHERE clause"
    ],
    correctAnswer: "`DELETE` is DML (can rollback, row-by-row); `TRUNCATE` is DDL (fast, removes all rows); `DROP` deletes table schema and data completely"
  },
  {
    id: 169,
    topic: "SQL",
    question: "What is a Database Index and what is its primary trade-off?",
    options: [
      "A data structure (usually B-Tree) that speeds up SELECT queries but slows down INSERT/UPDATE/DELETE operations and consumes disk space",
      "A primary key constraint that prevents duplicate records with no performance impact",
      "A cache stored in RAM that speeds up writes but slows down reads",
      "An automated backup of the database taken every hour"
    ],
    correctAnswer: "A data structure (usually B-Tree) that speeds up SELECT queries but slows down INSERT/UPDATE/DELETE operations and consumes disk space"
  },
  {
    id: 170,
    topic: "SQL",
    question: "How do you find the second highest salary from an `Employee` table in SQL?",
    options: [
      "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
      "SELECT salary FROM Employee ORDER BY salary ASC LIMIT 2;",
      "SELECT SECOND_HIGHEST(salary) FROM Employee;",
      "SELECT salary FROM Employee WHERE ROWNUM = 2;"
    ],
    correctAnswer: "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);"
  },
  {
    id: 171,
    topic: "SQL",
    question: "What is a Foreign Key constraint in SQL?",
    options: [
      "A key that references the primary key of another table, ensuring referential integrity",
      "A key used for encrypting database tables",
      "A primary key from an external database server",
      "A field that allows only unique international country codes"
    ],
    correctAnswer: "A key that references the primary key of another table, ensuring referential integrity"
  },
  {
    id: 172,
    topic: "SQL",
    question: "What is the difference between `UNION` and `UNION ALL`?",
    options: [
      "`UNION` removes duplicate rows from the combined result sets; `UNION ALL` retains duplicates and is faster",
      "`UNION ALL` removes duplicates; `UNION` retains them",
      "`UNION` works only on numeric data; `UNION ALL` works on all types",
      "There is no difference in performance or output"
    ],
    correctAnswer: "`UNION` removes duplicate rows from the combined result sets; `UNION ALL` retains duplicates and is faster"
  },
  {
    id: 173,
    topic: "SQL",
    question: "Which SQL command is used to query and fetch records from a database table?",
    options: ["SELECT", "GET", "RETRIEVE", "FETCH"],
    correctAnswer: "SELECT"
  },
  {
    id: 174,
    topic: "SQL",
    question: "Which SQL clause is used to sort the query results in ascending (ASC) or descending (DESC) order?",
    options: ["ORDER BY", "SORT BY", "GROUP BY", "ARRANGE BY"],
    correctAnswer: "ORDER BY"
  },
  {
    id: 175,
    topic: "SQL",
    question: "What is the result of `SELECT COUNT(*)` vs `SELECT COUNT(column_name)` when the column contains NULL values?",
    options: [
      "`COUNT(*)` counts all rows including NULLs; `COUNT(column_name)` excludes NULL values in that column",
      "`COUNT(*)` returns error if any row is NULL; `COUNT(column_name)` works",
      "Both count identical number of rows ignoring NULLs",
      "`COUNT(column_name)` counts NULLs as 0"
    ],
    correctAnswer: "`COUNT(*)` counts all rows including NULLs; `COUNT(column_name)` excludes NULL values in that column"
  }
];

module.exports = round2Questions;
