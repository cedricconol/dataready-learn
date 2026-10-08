// The SQL, Python, Terminal, and Git tracks moved to Menthoro. Their pages are
// no longer built, so an old lesson URL lands on the 404 page; this script runs
// in <head> before anything renders and sends the learner to the Menthoro course.
// Keep in sync with src/lib/menthoro.ts and vercel.json.
(function () {
  var courses = {
    sql: "https://app.menthoro.com/courses/sql-for-data-analysts-d2a5d8190d",
    python: "https://app.menthoro.com/courses/python-for-data-analysts-403dc3923b",
    terminal: "https://app.menthoro.com/courses/terminal-for-data-analysts-b5ed82c1a3",
    git: "https://app.menthoro.com/courses/git-for-data-analysts-6f4a321330",
  };
  var match = window.location.pathname.match(/^\/(sql|python|terminal|git)(\/|$)/);
  if (match) window.location.replace(courses[match[1]]);
})();
