/**
 * Mock LeetCode data for demo/offline mode.
 * Used when API calls fail or for showcasing the app.
 */
export const MOCK_USER_DATA = {
  user: {
    username: 'leetropolis_demo',
    profile: {
      ranking: 42137,
      realName: 'Alex Chen',
      userAvatar: null,
      countryName: 'United States',
      company: 'Google',
      jobTitle: 'Software Engineer',
      skillTags: ['Dynamic Programming', 'Graph Theory', 'System Design'],
      reputation: 8420,
    },
    submitStats: {
      acSubmissionNum: [
        { difficulty: 'All', count: 487, submissions: 720 },
        { difficulty: 'Easy', count: 210, submissions: 240 },
        { difficulty: 'Medium', count: 220, submissions: 380 },
        { difficulty: 'Hard', count: 57, submissions: 100 },
      ],
    },
    badges: [
      { id: '1', displayName: '50 Days Badge', name: '50-days', category: 'STREAK' },
      { id: '2', displayName: '100 Days Badge', name: '100-days', category: 'STREAK' },
      { id: '3', displayName: 'Guardian', name: 'guardian', category: 'CONTEST' },
    ],
    activeBadge: { id: '3', displayName: 'Guardian' },
    userCalendar: {
      activeYears: [2023, 2024],
      streak: 47,
      totalActiveDays: 284,
      submissionCalendar: JSON.stringify(generateCalendar()),
      dccBadges: [],
    },
  },
  contestRanking: {
    attendedContestsCount: 34,
    rating: 1892,
    globalRanking: 18400,
    totalParticipants: 600000,
    topPercentage: 3.07,
    badge: { name: 'Guardian' },
  },
  topics: {
    advanced: [
      { tagName: 'Dynamic Programming', tagSlug: 'dynamic-programming', problemsSolved: 68 },
      { tagName: 'Graph', tagSlug: 'graph', problemsSolved: 42 },
      { tagName: 'Backtracking', tagSlug: 'backtracking', problemsSolved: 28 },
      { tagName: 'Segment Tree', tagSlug: 'segment-tree', problemsSolved: 15 },
    ],
    intermediate: [
      { tagName: 'Binary Search', tagSlug: 'binary-search', problemsSolved: 55 },
      { tagName: 'Tree', tagSlug: 'tree', problemsSolved: 61 },
      { tagName: 'Heap', tagSlug: 'heap-priority-queue', problemsSolved: 30 },
      { tagName: 'Trie', tagSlug: 'trie', problemsSolved: 18 },
      { tagName: 'Sliding Window', tagSlug: 'sliding-window', problemsSolved: 22 },
    ],
    fundamental: [
      { tagName: 'Array', tagSlug: 'array', problemsSolved: 95 },
      { tagName: 'String', tagSlug: 'string', problemsSolved: 78 },
      { tagName: 'Hash Table', tagSlug: 'hash-table', problemsSolved: 64 },
      { tagName: 'Two Pointers', tagSlug: 'two-pointers', problemsSolved: 40 },
      { tagName: 'Sorting', tagSlug: 'sorting', problemsSolved: 35 },
      { tagName: 'Math', tagSlug: 'math', problemsSolved: 48 },
      { tagName: 'Greedy', tagSlug: 'greedy', problemsSolved: 38 },
    ],
  },
  recentSubmissions: [
    { id: '1', title: 'LRU Cache', titleSlug: 'lru-cache', timestamp: Date.now() / 1000 - 3600, lang: 'python3', runtime: '152ms', memory: '78.4MB' },
    { id: '2', title: 'Trapping Rain Water', titleSlug: 'trapping-rain-water', timestamp: Date.now() / 1000 - 7200, lang: 'cpp', runtime: '4ms', memory: '17.2MB' },
    { id: '3', title: 'Word Ladder', titleSlug: 'word-ladder', timestamp: Date.now() / 1000 - 86400, lang: 'java', runtime: '28ms', memory: '42.1MB' },
    { id: '4', title: 'Merge k Sorted Lists', titleSlug: 'merge-k-sorted-lists', timestamp: Date.now() / 1000 - 172800, lang: 'python3', runtime: '68ms', memory: '19.8MB' },
    { id: '5', title: 'Longest Palindromic Substring', titleSlug: 'longest-palindromic-substring', timestamp: Date.now() / 1000 - 259200, lang: 'cpp', runtime: '8ms', memory: '8.9MB' },
  ],
}

function generateCalendar() {
  const cal = {}
  const now = Math.floor(Date.now() / 1000)
  for (let i = 0; i < 365; i++) {
    if (Math.random() > 0.4) {
      const ts = now - i * 86400
      cal[ts] = Math.floor(Math.random() * 8) + 1
    }
  }
  return cal
}
