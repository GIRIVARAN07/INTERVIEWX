/**
 * Seed Data Script
 * ----------------
 * Populates the MongoDB database with 60+ sample interview questions
 * across HR, Technical, and Aptitude categories at Easy/Medium/Hard levels.
 *
 * Usage: npm run seed  (from the server directory)
 *
 * NOTE: This script will clear all existing questions before seeding.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Question = require('../models/Question');

// ─────────────────────────────────────────────────────────────────────────────
// HR Questions (Open-ended with keyword matching)
// ─────────────────────────────────────────────────────────────────────────────

const hrQuestions = [
  { type: 'HR', difficulty: 'Easy', company: 'General', question: 'Tell me about yourself.', correctAnswer: 'A brief introduction covering education, skills, interests, and career goals.', keywords: ['education', 'skills', 'experience', 'goal', 'passionate', 'career'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Easy', company: 'TCS', question: 'Why do you want to work at our company?', correctAnswer: 'Mention the company culture, growth opportunities, and how your skills align with their mission.', keywords: ['culture', 'growth', 'opportunity', 'skills', 'mission', 'values', 'learn'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Easy', company: 'Infosys', question: 'What are your strengths?', correctAnswer: 'Highlight relevant strengths like problem-solving, teamwork, communication, and adaptability.', keywords: ['problem-solving', 'teamwork', 'communication', 'adaptability', 'leadership', 'dedicated'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Easy', company: 'General', question: 'What are your hobbies and interests?', correctAnswer: 'Mention hobbies that show positive traits like reading, sports, coding, or volunteering.', keywords: ['reading', 'sports', 'coding', 'music', 'volunteer', 'travel', 'learn'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Easy', company: 'Wipro', question: 'Where do you see yourself in 5 years?', correctAnswer: 'Describe your career growth plans, learning goals, and desire to take on more responsibilities.', keywords: ['growth', 'leadership', 'learn', 'responsibility', 'skill', 'senior', 'expertise'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Easy', company: 'General', question: 'Why should we hire you?', correctAnswer: 'Explain how your skills, experience, and enthusiasm make you the ideal candidate.', keywords: ['skills', 'experience', 'value', 'contribute', 'team', 'dedicated', 'passionate'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Easy', company: 'TCS', question: 'What do you know about our company?', correctAnswer: 'Demonstrate research about the company history, products, culture, and recent achievements.', keywords: ['founded', 'product', 'service', 'innovation', 'global', 'technology', 'leader'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Easy', company: 'General', question: 'How do you handle stress and pressure?', correctAnswer: 'Discuss strategies like prioritization, time management, staying calm, and seeking support.', keywords: ['prioritize', 'calm', 'organize', 'time management', 'break', 'focus', 'plan'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Medium', company: 'Google', question: 'Describe a challenging situation you faced and how you overcame it.', correctAnswer: 'Use the STAR method: Situation, Task, Action, Result to describe a real challenge.', keywords: ['situation', 'challenge', 'action', 'result', 'learned', 'team', 'solution', 'overcome'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Medium', company: 'Amazon', question: 'Tell me about a time you showed leadership.', correctAnswer: 'Describe leading a project, organizing a team, or taking initiative to solve a problem.', keywords: ['led', 'team', 'initiative', 'organized', 'project', 'delegated', 'motivated', 'result'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Medium', company: 'Infosys', question: 'How do you handle conflicts with team members?', correctAnswer: 'Discuss open communication, understanding perspectives, finding compromise, and focusing on goals.', keywords: ['communication', 'listen', 'perspective', 'compromise', 'resolve', 'respect', 'collaborate'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Medium', company: 'General', question: 'What is your greatest weakness?', correctAnswer: 'Mention a genuine weakness and explain the steps you are taking to improve.', keywords: ['improve', 'working on', 'learning', 'overcome', 'aware', 'feedback', 'progress'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Medium', company: 'Wipro', question: 'Describe your ideal work environment.', correctAnswer: 'Describe a collaborative, growth-oriented, and innovative work culture.', keywords: ['collaborative', 'growth', 'innovative', 'team', 'supportive', 'learn', 'flexible'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Medium', company: 'Google', question: 'How do you prioritize multiple tasks with tight deadlines?', correctAnswer: 'Discuss prioritization frameworks, time management, and communication with stakeholders.', keywords: ['prioritize', 'urgent', 'important', 'deadline', 'organize', 'communicate', 'plan'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Medium', company: 'Amazon', question: 'Give an example of when you went above and beyond.', correctAnswer: 'Describe a specific situation where you exceeded expectations to deliver exceptional results.', keywords: ['exceeded', 'extra', 'initiative', 'beyond', 'result', 'impact', 'effort', 'volunteered'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Hard', company: 'Google', question: 'If you were to start a company, what problem would you solve and why?', correctAnswer: 'Demonstrate entrepreneurial thinking, market awareness, and problem-solving approach.', keywords: ['problem', 'solution', 'market', 'innovation', 'impact', 'user', 'technology', 'scale'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Hard', company: 'Amazon', question: 'Tell me about a time you had to make a decision with incomplete information.', correctAnswer: 'Discuss risk assessment, gathering available data, consulting experts, and making a judgment call.', keywords: ['risk', 'data', 'analyze', 'decision', 'uncertain', 'consulted', 'judgment', 'outcome'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Hard', company: 'General', question: 'How would you handle a situation where your manager disagrees with your approach?', correctAnswer: 'Discuss presenting your reasoning with data, being open to feedback, and finding common ground.', keywords: ['data', 'evidence', 'communicate', 'feedback', 'open', 'respect', 'compromise', 'professional'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Hard', company: 'Google', question: 'Describe a failure you experienced. What did you learn from it?', correctAnswer: 'Be honest about a real failure, focus on the lessons learned and how you grew from it.', keywords: ['failure', 'learned', 'mistake', 'improved', 'growth', 'resilience', 'changed', 'better'], isOpenEnded: true, options: [] },
  { type: 'HR', difficulty: 'Hard', company: 'Amazon', question: 'How do you measure success in your work?', correctAnswer: 'Discuss both quantitative metrics and qualitative impact, continuous improvement, and alignment with goals.', keywords: ['metrics', 'impact', 'goals', 'quality', 'improvement', 'feedback', 'outcome', 'deliver'], isOpenEnded: true, options: [] },
];

// ─────────────────────────────────────────────────────────────────────────────
// Technical Questions (MCQ)
// ─────────────────────────────────────────────────────────────────────────────

const technicalQuestions = [
  { type: 'Technical', difficulty: 'Easy', company: 'General', question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correctAnswer: 'Hyper Text Markup Language', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Easy', company: 'TCS', question: 'Which data structure uses FIFO (First In, First Out)?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correctAnswer: 'Queue', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Easy', company: 'General', question: 'What is the time complexity of accessing an element in an array by index?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 'O(1)', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Easy', company: 'Infosys', question: 'Which keyword is used to define a constant in JavaScript?', options: ['var', 'let', 'const', 'static'], correctAnswer: 'const', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Easy', company: 'General', question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], correctAnswer: 'Cascading Style Sheets', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Easy', company: 'Wipro', question: 'Which of the following is NOT a programming language?', options: ['Python', 'Java', 'HTML', 'C++'], correctAnswer: 'HTML', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Easy', company: 'TCS', question: 'What is the default port number for HTTP?', options: ['80', '443', '8080', '3000'], correctAnswer: '80', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Easy', company: 'General', question: 'Which symbol is used for single-line comments in JavaScript?', options: ['//', '/* */', '#', '--'], correctAnswer: '//', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Medium', company: 'Google', question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correctAnswer: 'O(log n)', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Medium', company: 'Amazon', question: 'Which design pattern ensures a class has only one instance?', options: ['Factory', 'Observer', 'Singleton', 'Strategy'], correctAnswer: 'Singleton', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Medium', company: 'General', question: 'What is the difference between == and === in JavaScript?', options: ['== checks type, === checks value', '== checks value only, === checks value and type', 'They are identical', '=== is used for assignment'], correctAnswer: '== checks value only, === checks value and type', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Medium', company: 'Infosys', question: 'Which HTTP method is used to update an existing resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctAnswer: 'PUT', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Medium', company: 'Google', question: 'What is a closure in JavaScript?', options: ['A function with no return value', 'A function that has access to its outer scope variables even after the outer function has returned', 'A method to close the browser', 'A loop that closes automatically'], correctAnswer: 'A function that has access to its outer scope variables even after the outer function has returned', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Medium', company: 'Amazon', question: 'Which sorting algorithm has the best average-case time complexity?', options: ['Bubble Sort – O(n²)', 'Merge Sort – O(n log n)', 'Selection Sort – O(n²)', 'Insertion Sort – O(n²)'], correctAnswer: 'Merge Sort – O(n log n)', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Medium', company: 'General', question: 'What does REST stand for in web development?', options: ['Representational State Transfer', 'Real-time Event Streaming Technology', 'Remote Execution Service Tool', 'Responsive Server Technology'], correctAnswer: 'Representational State Transfer', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Medium', company: 'Wipro', question: 'Which of the following is used for version control?', options: ['Docker', 'Git', 'Kubernetes', 'Jenkins'], correctAnswer: 'Git', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Hard', company: 'Google', question: "What is the time complexity of finding the shortest path using Dijkstra's algorithm with a binary heap?", options: ['O(V²)', 'O((V + E) log V)', 'O(V * E)', 'O(E log E)'], correctAnswer: 'O((V + E) log V)', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Hard', company: 'Amazon', question: 'Which data structure is best suited for implementing an LRU Cache?', options: ['Array + Stack', 'HashMap + Doubly Linked List', 'Binary Search Tree', 'Queue + Array'], correctAnswer: 'HashMap + Doubly Linked List', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Hard', company: 'Google', question: 'What is the CAP theorem in distributed systems?', options: ['Consistency, Availability, Partition Tolerance — you can only guarantee two out of three', 'Caching, Authentication, Performance — all three must be optimized', 'Concurrency, Atomicity, Persistence — database principles', 'Compression, Allocation, Processing — resource management'], correctAnswer: 'Consistency, Availability, Partition Tolerance — you can only guarantee two out of three', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Hard', company: 'Amazon', question: 'What is the purpose of the virtual DOM in React?', options: ['To directly manipulate the browser DOM', 'To create a lightweight copy of the DOM for efficient diffing and minimal re-renders', 'To store data in the browser', 'To handle server-side rendering'], correctAnswer: 'To create a lightweight copy of the DOM for efficient diffing and minimal re-renders', keywords: [], isOpenEnded: false },
  { type: 'Technical', difficulty: 'Hard', company: 'General', question: 'What is database normalization and what is 3NF?', options: ['3NF means all data is stored in a single table', '3NF means no transitive dependencies — every non-key column depends only on the primary key', '3NF means data is duplicated across 3 tables', '3NF means using 3 foreign keys per table'], correctAnswer: '3NF means no transitive dependencies — every non-key column depends only on the primary key', keywords: [], isOpenEnded: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// Aptitude Questions (MCQ)
// ─────────────────────────────────────────────────────────────────────────────

const aptitudeQuestions = [
  { type: 'Aptitude', difficulty: 'Easy', company: 'General', question: 'If a train travels 60 km in 1 hour, how far will it travel in 3.5 hours?', options: ['180 km', '200 km', '210 km', '240 km'], correctAnswer: '210 km', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Easy', company: 'TCS', question: 'What is 25% of 200?', options: ['40', '50', '55', '60'], correctAnswer: '50', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Easy', company: 'General', question: 'Find the next number in the series: 2, 4, 8, 16, __', options: ['24', '30', '32', '36'], correctAnswer: '32', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Easy', company: 'Infosys', question: 'A book costs ₹150 and is sold at ₹180. What is the profit percentage?', options: ['15%', '20%', '25%', '30%'], correctAnswer: '20%', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Easy', company: 'General', question: 'If 5 workers can complete a job in 10 days, how many days will 10 workers take?', options: ['3 days', '5 days', '7 days', '20 days'], correctAnswer: '5 days', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Easy', company: 'Wipro', question: 'What is the average of 10, 20, 30, 40, and 50?', options: ['25', '30', '35', '40'], correctAnswer: '30', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Easy', company: 'TCS', question: 'A clock shows 3:15. What is the angle between the hour and minute hands?', options: ['0°', '7.5°', '15°', '22.5°'], correctAnswer: '7.5°', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Easy', company: 'General', question: 'If a = 3 and b = 4, what is a² + b²?', options: ['7', '12', '25', '49'], correctAnswer: '25', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Medium', company: 'Google', question: 'A pipe fills a tank in 6 hours and another pipe empties it in 8 hours. If both are opened, how long to fill the tank?', options: ['12 hours', '14 hours', '24 hours', '48 hours'], correctAnswer: '24 hours', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Medium', company: 'Amazon', question: 'The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?', options: ['15', '18', '20', '25'], correctAnswer: '20', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Medium', company: 'General', question: 'A man invested ₹10,000 at 8% simple interest. What is the interest after 3 years?', options: ['₹2,000', '₹2,400', '₹2,800', '₹3,000'], correctAnswer: '₹2,400', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Medium', company: 'Infosys', question: 'In how many ways can 5 people be arranged in a line?', options: ['25', '60', '120', '720'], correctAnswer: '120', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Medium', company: 'Google', question: 'Two trains 150m and 200m long are moving towards each other at 30 km/h and 20 km/h. Time to cross each other?', options: ['25.2 sec', '20.5 sec', '18 sec', '15 sec'], correctAnswer: '25.2 sec', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Medium', company: 'Amazon', question: 'A shopkeeper marks a product 40% above cost price and gives 10% discount. What is the profit %?', options: ['20%', '26%', '30%', '36%'], correctAnswer: '26%', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Medium', company: 'General', question: 'What is the probability of getting exactly 2 heads when tossing 3 coins?', options: ['1/8', '2/8', '3/8', '4/8'], correctAnswer: '3/8', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Hard', company: 'Google', question: 'A boat goes 24 km upstream in 6 hours and 24 km downstream in 4 hours. What is the speed of the stream?', options: ['1 km/h', '2 km/h', '1.5 km/h', '3 km/h'], correctAnswer: '1 km/h', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Hard', company: 'Amazon', question: 'If log₂(x) + log₂(x-2) = 3, what is the value of x?', options: ['2', '4', '6', '8'], correctAnswer: '4', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Hard', company: 'General', question: 'A sum of money doubles itself in 8 years at simple interest. What is the rate of interest?', options: ['10%', '12.5%', '15%', '20%'], correctAnswer: '12.5%', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Hard', company: 'Infosys', question: 'How many 3-digit numbers are divisible by 7?', options: ['128', '129', '130', '131'], correctAnswer: '128', keywords: [], isOpenEnded: false },
  { type: 'Aptitude', difficulty: 'Hard', company: 'Google', question: 'A and B can do a piece of work in 12 days. B and C in 15 days. C and A in 20 days. How long will all three take together?', options: ['8 days', '10 days', '12 days', '15 days'], correctAnswer: '10 days', keywords: [], isOpenEnded: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// Seed Function
// ─────────────────────────────────────────────────────────────────────────────

const allQuestions = [...hrQuestions, ...technicalQuestions, ...aptitudeQuestions];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    const inserted = await Question.insertMany(allQuestions);
    console.log(`🌱 Successfully seeded ${inserted.length} questions!`);

    const summary = {};
    inserted.forEach((q) => {
      const key = `${q.type} - ${q.difficulty}`;
      summary[key] = (summary[key] || 0) + 1;
    });
    console.log('\n📊 Summary:');
    Object.entries(summary).sort().forEach(([key, count]) => {
      console.log(`   ${key}: ${count} questions`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
