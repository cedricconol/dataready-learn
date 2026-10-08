/**
 * The SQL, Python, Terminal, and Git tracks now live on Menthoro. Every entry
 * point on this site sends learners to the matching Menthoro course.
 *
 * Keep in sync with static/menthoro-redirect.js and vercel.json, which redirect
 * the old lesson URLs.
 */
export const MENTHORO_COURSES = {
  sql: "https://app.menthoro.com/courses/sql-for-data-analysts-d2a5d8190d",
  python: "https://app.menthoro.com/courses/python-for-data-analysts-403dc3923b",
  terminal: "https://app.menthoro.com/courses/terminal-for-data-analysts-b5ed82c1a3",
  git: "https://app.menthoro.com/courses/git-for-data-analysts-6f4a321330",
} as const;
