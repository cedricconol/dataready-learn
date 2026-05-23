import type { FileSystemNode, Lesson } from "./types";

// ── Shared filesystem snapshots ───────────────────────────────────

function baseFs(): FileSystemNode {
  return {
    type: "dir", name: "", children: [{
      type: "dir", name: "home", children: [{
        type: "dir", name: "user", children: [
          {
            type: "dir", name: "documents", children: [
              { type: "file", name: "notes.txt", content: "Remember to learn the terminal.\nPractice every day." },
              {
                type: "dir", name: "projects", children: [
                  { type: "file", name: "readme.md", content: "# My Projects\nA place for all my projects." },
                ],
              },
            ],
          },
          { type: "dir", name: "downloads", children: [
            { type: "file", name: "photo.jpg", content: "" },
          ]},
          { type: "file", name: ".secret_file", content: "You found me! 🎉" },
          { type: "file", name: ".bashrc", content: "# bash config\nexport PATH=$HOME/.local/bin:$PATH" },
        ],
      }],
    }],
  };
}

function filesFs(): FileSystemNode {
  return {
    type: "dir", name: "", children: [{
      type: "dir", name: "home", children: [{
        type: "dir", name: "user", children: [
          { type: "file", name: "notes.txt", content: "Remember to learn the terminal.\nPractice every day." },
          { type: "dir", name: "documents", children: [] },
          { type: "dir", name: "downloads", children: [
            { type: "file", name: "photo.jpg", content: "" },
          ]},
        ],
      }],
    }],
  };
}

function readingFs(): FileSystemNode {
  const logLines = [
    "2024-01-15 08:00:01 192.168.1.10 GET /index.html 200",
    "2024-01-15 08:00:03 10.0.0.5 POST /api/login 401",
    "2024-01-15 08:00:07 192.168.1.10 GET /dashboard 200",
    "2024-01-15 08:00:12 10.0.0.8 GET /api/data 200",
    "2024-01-15 08:00:15 192.168.1.10 DELETE /api/user/42 403",
    "2024-01-15 08:00:20 10.0.0.5 GET /index.html 200",
    "2024-01-15 08:00:25 10.0.0.8 POST /api/orders 201",
    "2024-01-15 08:00:30 192.168.1.11 GET /reports 200",
    "2024-01-15 08:00:35 10.0.0.5 GET /api/user/99 404",
    "2024-01-15 08:00:40 192.168.1.10 GET /admin 403",
    "2024-01-15 08:00:45 10.0.0.9 POST /api/login 200",
    "2024-01-15 08:00:50 10.0.0.8 GET /dashboard 200",
    "2024-01-15 08:01:00 10.0.0.5 GET /api/orders 200",
    "2024-01-15 08:01:05 192.168.1.12 GET /index.html 200",
    "2024-01-15 08:01:10 10.0.0.5 DELETE /api/orders/7 204",
    "2024-01-15 08:01:15 10.0.0.9 GET /reports 200",
    "2024-01-15 08:01:20 192.168.1.10 POST /api/data 500",
    "2024-01-15 08:01:25 10.0.0.8 GET /admin 403",
    "2024-01-15 08:01:30 10.0.0.5 GET /dashboard 200",
    "2024-01-15 08:01:35 192.168.1.11 PUT /api/user/5 200",
  ];

  return {
    type: "dir", name: "", children: [{
      type: "dir", name: "home", children: [{
        type: "dir", name: "user", children: [
          { type: "file", name: "access.log", content: logLines.join("\n") },
          { type: "file", name: "notes.txt", content: "Remember to learn the terminal.\nPractice every day.\nReview logs often." },
          { type: "dir", name: "documents", children: [
            { type: "file", name: "report.txt", content: "Monthly Report\n\nSection 1: Overview\nRevenue was up 12% this month.\n\nSection 2: Details\nSee attached spreadsheet for breakdown." },
          ]},
        ],
      }],
    }],
  };
}

// ── Introduction ─────────────────────────────────────────────────

const lesson_00_01: Lesson = {
  id: "00-01",
  module: 1,
  title: "Introduction to Terminal",
  intro:
    "Welcome to the terminal. This is a free-form sandbox — there is no right or wrong answer here. " +
    "Explore the filesystem, try any command, and get comfortable before the lessons begin.",
  goal: "Run any command to get started. Try `ls`, `pwd`, or `help`.",
  hints: [
    "Type `ls` and press Enter to list the files in the current directory.",
    "Type `help` to see all available commands.",
    "Type `pwd` to see your current location in the filesystem.",
  ],
  initialFs: {
    type: "dir", name: "", children: [{
      type: "dir", name: "home", children: [{
        type: "dir", name: "user", children: [
          {
            type: "dir", name: "documents", children: [
              { type: "file", name: "notes.txt", content: "Remember to learn the terminal.\nPractice every day." },
              {
                type: "dir", name: "projects", children: [
                  { type: "file", name: "readme.md", content: "# My Projects\nA place for all my projects." },
                ],
              },
            ],
          },
          { type: "dir", name: "downloads", children: [
            { type: "file", name: "photo.jpg", content: "" },
          ]},
          { type: "file", name: ".secret_file", content: "You found me! 🎉" },
          { type: "file", name: ".bashrc", content: "# bash config\nexport PATH=$HOME/.local/bin:$PATH" },
        ],
      }],
    }],
  },
  initialCwd: "/home/user",
  validate: ({ history }) => ({
    passed: history.length > 0,
    feedback: "Type any command and press Enter to begin.",
  }),
  successMessage: "You're in. The terminal is yours — let's start learning.",
};

// ── Module 1 — Orientation ────────────────────────────────────────

const lesson_01_01: Lesson = {
  id: "01-01",
  module: 1,
  title: "Hello, terminal — pwd",
  intro:
    "Welcome to the terminal playground. You are sitting inside a simulated filesystem. " +
    "The terminal is a place — and right now you are somewhere specific inside it.",
  goal: "Run `pwd` to print your current location.",
  hints: [
    "Type `pwd` and press Enter.",
    "`pwd` stands for Print Working Directory. It tells you where you are in the filesystem.",
  ],
  initialFs: baseFs(),
  initialCwd: "/home/user",
  validate: ({ history }) => {
    const ran = history.some((h) => /^\s*pwd\s*$/.test(h.command));
    return { passed: ran, feedback: "Type `pwd` and press Enter." };
  },
  successMessage: "You just ran your first terminal command. `pwd` shows you exactly where you are.",
};

const lesson_01_02: Lesson = {
  id: "01-02",
  module: 1,
  title: "Looking around — ls",
  intro:
    "You know where you are (`pwd`). Now let's see what's here. " +
    "The `ls` command lists the contents of a directory.",
  goal: "Use `ls` to list the contents of your home directory.",
  hints: [
    "Type `ls` and press Enter.",
    "`ls` shows everything in your current directory — files and folders.",
  ],
  initialFs: baseFs(),
  initialCwd: "/home/user",
  validate: ({ history }) => {
    const ran = history.some((h) => /^\s*ls(\s|$)/.test(h.command));
    return { passed: ran, feedback: "Type `ls` and press Enter." };
  },
  successMessage: "You listed your first directory. Notice how `ls` shows both files and folders.",
};

const lesson_01_03: Lesson = {
  id: "01-03",
  module: 1,
  title: "Seeing more — ls flags",
  intro:
    "Plain `ls` is useful, but flags unlock more detail. " +
    "`ls -l` shows permissions, owners, and sizes. `ls -a` shows hidden files (names starting with `.`). " +
    "Combine them: `ls -la`.",
  goal: "Find the hidden file in your home directory using `ls -a` or `ls -la`.",
  hints: [
    "Try `ls -a` — the `-a` flag shows hidden files.",
    "Hidden files start with a `.` — they are invisible to plain `ls`.",
    "You can combine flags: `ls -la` gives long format AND shows hidden files.",
  ],
  initialFs: baseFs(),
  initialCwd: "/home/user",
  validate: ({ history }) => {
    const ran = history.some((h) => /^\s*ls\s+.*-[^-]*a/.test(h.command) || /^\s*ls\s+-a/.test(h.command));
    return {
      passed: ran,
      feedback: "Use `ls -a` or `ls -la` to reveal hidden files.",
    };
  },
  successMessage: "Hidden files revealed! The `.secret_file` and `.bashrc` were always there — just hidden from plain `ls`.",
};

const lesson_01_04: Lesson = {
  id: "01-04",
  module: 1,
  title: "Moving in — cd",
  intro:
    "`cd` (change directory) moves you from one directory into another. " +
    "Think of it like double-clicking a folder — except you stay in the terminal.",
  goal: "Navigate into the `documents` directory.",
  hints: [
    "Type `cd documents` and press Enter.",
    "After `cd`, run `pwd` to confirm where you ended up.",
  ],
  initialFs: baseFs(),
  initialCwd: "/home/user",
  validate: ({ cwd }) => {
    const passed = cwd === "/home/user/documents";
    return { passed, feedback: "Run `cd documents` to move into the documents folder." };
  },
  successMessage: "You navigated into a directory. Run `ls` to see what's inside.",
};

const lesson_01_05: Lesson = {
  id: "01-05",
  module: 1,
  title: "Moving back — cd shortcuts",
  intro:
    "You can navigate back up the tree just as easily. " +
    "`cd ..` moves up one level. `cd ~` takes you straight home. " +
    "`cd -` takes you back to wherever you were last.",
  goal: "Start in `documents`, then use `cd ..` or `cd ~` to return to your home directory.",
  hints: [
    "First run `cd documents` to go into documents, then `cd ..` to come back.",
    "`cd ..` means 'go up one level'.",
    "`cd ~` always takes you to `/home/user` no matter where you are.",
  ],
  initialFs: baseFs(),
  initialCwd: "/home/user/documents",
  validate: ({ history }) => {
    const ran = history.some(
      (h) => /^\s*cd\s+\.\.\s*$/.test(h.command) || /^\s*cd\s+~\s*$/.test(h.command) || /^\s*cd\s*$/.test(h.command)
    );
    return { passed: ran, feedback: "Try `cd ..` to go up one level, or `cd ~` to jump straight home." };
  },
  successMessage: "Navigation mastered. `cd ..`, `cd ~`, and `cd -` are the three moves you'll use constantly.",
};

const lesson_01_06: Lesson = {
  id: "01-06",
  module: 1,
  title: "The full map — orientation capstone",
  intro:
    "Combine everything: `pwd`, `ls`, and `cd`. " +
    "Use them together to explore the filesystem and find a file buried two levels deep.",
  goal: "Navigate to `documents/projects` and list its contents.",
  hints: [
    "Start from home: `cd documents` then `cd projects`.",
    "Or go directly: `cd documents/projects` in one step.",
    "Once there, run `ls` to see what's inside.",
  ],
  initialFs: baseFs(),
  initialCwd: "/home/user",
  validate: ({ cwd, history }) => {
    const inProjects = cwd === "/home/user/documents/projects";
    const lsRan = history.some((h) => /^\s*ls/.test(h.command));
    const passed = inProjects && lsRan;
    return {
      passed,
      feedback: inProjects
        ? "You're in the right place. Now run `ls` to list the contents."
        : "Navigate to `documents/projects` using `cd`.",
    };
  },
  successMessage: "You can navigate anywhere in the filesystem and know what's around you. That's the foundation of everything.",
};

// ── Module 2 — Files and Directories ─────────────────────────────

const lesson_02_01: Lesson = {
  id: "02-01",
  module: 2,
  title: "Empty file — touch",
  intro:
    "`touch` creates an empty file. If the file already exists, it updates the timestamp. " +
    "It's the simplest way to create a file from the command line.",
  goal: "Create a file called `report.txt` in your home directory.",
  hints: [
    "Type `touch report.txt` and press Enter.",
    "Then run `ls` to confirm the file was created.",
  ],
  initialFs: filesFs(),
  initialCwd: "/home/user",
  validate: ({ fs }) => {
    const node = (() => {
      // walk to /home/user/report.txt
      let n = fs;
      for (const seg of ["home", "user"]) {
        if (n.type !== "dir") return null;
        const child = n.children.find((c) => c.name === seg);
        if (!child) return null;
        n = child;
      }
      if (n.type !== "dir") return null;
      return n.children.find((c) => c.name === "report.txt") ?? null;
    })();
    const passed = node !== null && node.type === "file";
    return { passed, feedback: "Run `touch report.txt` to create the file." };
  },
  successMessage: "`report.txt` exists. `touch` is your fastest way to create a placeholder file.",
};

const lesson_02_02: Lesson = {
  id: "02-02",
  module: 2,
  title: "New folder — mkdir",
  intro:
    "`mkdir` creates a new directory. " +
    "Directories (folders) are how you organize files into groups.",
  goal: "Create a directory called `archive` in your home directory.",
  hints: [
    "Type `mkdir archive` and press Enter.",
    "Run `ls` to confirm — directories appear in blue.",
  ],
  initialFs: filesFs(),
  initialCwd: "/home/user",
  validate: ({ fs }) => {
    let node: FileSystemNode | null = fs;
    for (const seg of ["home", "user"]) {
      if (!node || node.type !== "dir") { node = null; break; }
      node = node.children.find((c) => c.name === seg) ?? null;
    }
    const passed = node?.type === "dir" && (node as import("./types").DirectoryNode).children.some(
      (c) => c.name === "archive" && c.type === "dir"
    );
    return { passed: !!passed, feedback: "Run `mkdir archive` to create the directory." };
  },
  successMessage: "Directory created. Run `ls` to see it listed alongside your files.",
};

const lesson_02_03: Lesson = {
  id: "02-03",
  module: 2,
  title: "Nested folders — mkdir -p",
  intro:
    "Creating `a/b/c` normally requires three separate `mkdir` commands. " +
    "The `-p` flag (parents) does it in one shot, creating every missing level.",
  goal: "Create the nested path `data/raw/csv` in one command.",
  hints: [
    "Use `mkdir -p data/raw/csv`.",
    "The `-p` flag creates all intermediate directories automatically.",
    "Try `ls data/raw` afterward to confirm.",
  ],
  initialFs: filesFs(),
  initialCwd: "/home/user",
  validate: ({ fs }) => {
    function find(node: FileSystemNode, parts: string[]): boolean {
      if (parts.length === 0) return node.type === "dir";
      if (node.type !== "dir") return false;
      const child = node.children.find((c) => c.name === parts[0]);
      return child ? find(child, parts.slice(1)) : false;
    }
    const passed = find(fs, ["home", "user", "data", "raw", "csv"]);
    return { passed, feedback: "Use `mkdir -p data/raw/csv` to create the nested directories at once." };
  },
  successMessage: "`data/raw/csv` created in one command. `-p` is essential for building directory structures quickly.",
};

const lesson_02_04: Lesson = {
  id: "02-04",
  module: 2,
  title: "Copying — cp",
  intro:
    "`cp source destination` copies a file. The original stays intact; you get a new copy. " +
    "Use `cp -r` to copy entire directories.",
  goal: "Copy `notes.txt` to a new file called `backup.txt`.",
  hints: [
    "Type `cp notes.txt backup.txt`.",
    "Run `ls` to confirm both files exist.",
    "Run `cat backup.txt` to verify it has the same content.",
  ],
  initialFs: filesFs(),
  initialCwd: "/home/user",
  validate: ({ fs }) => {
    function getFile(node: FileSystemNode, parts: string[]): import("./types").FileNode | null {
      if (parts.length === 0) return node.type === "file" ? node as import("./types").FileNode : null;
      if (node.type !== "dir") return null;
      const child = node.children.find((c) => c.name === parts[0]);
      return child ? getFile(child, parts.slice(1)) : null;
    }
    const orig = getFile(fs, ["home", "user", "notes.txt"]);
    const copy = getFile(fs, ["home", "user", "backup.txt"]);
    const passed = orig !== null && copy !== null && orig.content === copy.content;
    return { passed, feedback: "Run `cp notes.txt backup.txt` to duplicate the file." };
  },
  successMessage: "File copied. Both `notes.txt` and `backup.txt` now exist with identical content.",
};

const lesson_02_05: Lesson = {
  id: "02-05",
  module: 2,
  title: "Moving and renaming — mv",
  intro:
    "`mv` does double duty: it moves files between directories AND renames them. " +
    "There is no separate rename command in the terminal.",
  goal: "Rename `notes.txt` to `journal.txt`.",
  hints: [
    "Type `mv notes.txt journal.txt`.",
    "Run `ls` to confirm — `notes.txt` should be gone, `journal.txt` should appear.",
  ],
  initialFs: filesFs(),
  initialCwd: "/home/user",
  validate: ({ fs }) => {
    function exists(node: FileSystemNode, parts: string[]): boolean {
      if (parts.length === 0) return true;
      if (node.type !== "dir") return false;
      const child = node.children.find((c) => c.name === parts[0]);
      return child ? exists(child, parts.slice(1)) : false;
    }
    const notesGone = !exists(fs, ["home", "user", "notes.txt"]);
    const journalExists = exists(fs, ["home", "user", "journal.txt"]);
    const passed = notesGone && journalExists;
    return {
      passed,
      feedback: journalExists
        ? "Done — but check that `notes.txt` is gone."
        : "Run `mv notes.txt journal.txt` to rename the file.",
    };
  },
  successMessage: "`notes.txt` is now `journal.txt`. `mv` is rename + move in a single command.",
};

const lesson_02_06: Lesson = {
  id: "02-06",
  module: 2,
  title: "Deletion — rm",
  intro:
    "`rm` removes files permanently. There is no trash can — once deleted, it is gone. " +
    "Use `rm -r` to remove a directory and everything inside it.",
  goal: "Delete `downloads/photo.jpg`.",
  hints: [
    "Type `rm downloads/photo.jpg`.",
    "Or `cd downloads` first, then `rm photo.jpg`.",
    "Run `ls downloads` to confirm it's gone.",
  ],
  initialFs: filesFs(),
  initialCwd: "/home/user",
  validate: ({ fs }) => {
    function exists(node: FileSystemNode, parts: string[]): boolean {
      if (parts.length === 0) return true;
      if (node.type !== "dir") return false;
      const child = node.children.find((c) => c.name === parts[0]);
      return child ? exists(child, parts.slice(1)) : false;
    }
    const passed = !exists(fs, ["home", "user", "downloads", "photo.jpg"]);
    return { passed, feedback: "Run `rm downloads/photo.jpg` to delete the file." };
  },
  successMessage: "Deleted. The terminal's `rm` is permanent — always double-check before you press Enter.",
};

const lesson_02_07: Lesson = {
  id: "02-07",
  module: 2,
  title: "The danger zone — rm -r",
  intro:
    "`rm -r` removes an entire directory tree recursively. Combined with `-f` (force), " +
    "`rm -rf` is one of the most powerful — and dangerous — commands in the terminal. " +
    "In this sandbox it's safe. In production, it is not.",
  goal: "Remove the `danger` directory and everything inside it.",
  hints: [
    "First look inside: `ls danger`.",
    "Then run `rm -r danger` to delete it recursively.",
    "Confirm with `ls` — the directory should be gone.",
  ],
  initialFs: (() => {
    const fs = filesFs() as import("./types").DirectoryNode;
    const userDir = ((fs.children[0] as import("./types").DirectoryNode).children[0] as import("./types").DirectoryNode);
    userDir.children.push({
      type: "dir", name: "danger", children: [
        { type: "file", name: "test.txt", content: "This file will be deleted." },
        { type: "dir", name: "subdir", children: [
          { type: "file", name: "also-gone.txt", content: "Gone too." },
        ]},
      ],
    });
    return fs;
  })(),
  initialCwd: "/home/user",
  validate: ({ fs }) => {
    function exists(node: FileSystemNode, parts: string[]): boolean {
      if (parts.length === 0) return true;
      if (node.type !== "dir") return false;
      const child = node.children.find((c) => c.name === parts[0]);
      return child ? exists(child, parts.slice(1)) : false;
    }
    const passed = !exists(fs, ["home", "user", "danger"]);
    return { passed, feedback: "Run `rm -r danger` to recursively delete the entire directory." };
  },
  successMessage: "Directory gone. `rm -rf` is permanent and instant — there is no undo.",
};

// ── Module 3 — Reading Files ──────────────────────────────────────

const lesson_03_01: Lesson = {
  id: "03-01",
  module: 3,
  title: "Show everything — cat",
  intro:
    "`cat` (concatenate) prints the full contents of a file to the screen. " +
    "It's your go-to for reading short files quickly.",
  goal: "Use `cat` to read the contents of `notes.txt`.",
  hints: [
    "Type `cat notes.txt` and press Enter.",
    "The file's contents will print to the screen.",
  ],
  initialFs: readingFs(),
  initialCwd: "/home/user",
  validate: ({ history }) => {
    const ran = history.some((h) => /^\s*cat\s+notes\.txt/.test(h.command));
    return { passed: ran, feedback: "Run `cat notes.txt` to print the file." };
  },
  successMessage: "`cat` printed the whole file. For large files, you'll want `head` or `tail` instead.",
};

const lesson_03_02: Lesson = {
  id: "03-02",
  module: 3,
  title: "Top of file — head",
  intro:
    "`head` shows the first lines of a file. By default it shows 10. " +
    "Use `head -n 5` to show exactly 5. Essential for peeking at large files without loading everything.",
  goal: "Show only the first 5 lines of `access.log`.",
  hints: [
    "Try `head access.log` to see the first 10 lines.",
    "Use `head -n 5 access.log` to see exactly 5 lines.",
  ],
  initialFs: readingFs(),
  initialCwd: "/home/user",
  validate: ({ history }) => {
    const ran = history.some((h) => /^\s*head\s+.*-n\s+5/.test(h.command) || /^\s*head\s+-5\s/.test(h.command));
    return { passed: ran, feedback: "Use `head -n 5 access.log` to show the first 5 lines." };
  },
  successMessage: "`head -n 5` — memorize this. You'll use it constantly when exploring new datasets.",
};

const lesson_03_03: Lesson = {
  id: "03-03",
  module: 3,
  title: "Bottom of file — tail",
  intro:
    "`tail` shows the last lines of a file — the mirror of `head`. " +
    "When reading logs, the most recent entries are at the bottom, " +
    "so `tail` is often more useful than `head`.",
  goal: "Show the last 5 lines of `access.log`.",
  hints: [
    "Try `tail access.log` to see the last 10 lines.",
    "Use `tail -n 5 access.log` to see exactly 5 lines.",
  ],
  initialFs: readingFs(),
  initialCwd: "/home/user",
  validate: ({ history }) => {
    const ran = history.some((h) => /^\s*tail\s+.*-n\s+5/.test(h.command) || /^\s*tail\s+-5\s/.test(h.command));
    return { passed: ran, feedback: "Use `tail -n 5 access.log` to show the last 5 lines." };
  },
  successMessage: "Logs grow at the bottom. `tail` puts you right at the newest entries.",
};

const lesson_03_04: Lesson = {
  id: "03-04",
  module: 3,
  title: "Count it — wc",
  intro:
    "`wc` (word count) counts lines, words, and characters. " +
    "`wc -l` counts only lines — which is the most common use. " +
    "It's how you quickly measure the size of a file or the output of a pipeline.",
  goal: "Count the number of lines in `access.log` using `wc -l`.",
  hints: [
    "Type `wc -l access.log`.",
    "`wc` alone shows lines, words, and chars. `-l` shows just lines.",
  ],
  initialFs: readingFs(),
  initialCwd: "/home/user",
  validate: ({ history }) => {
    const ran = history.some((h) => /^\s*wc\s+.*-[^-]*l/.test(h.command) || /^\s*wc\s+-l/.test(h.command));
    return { passed: ran, feedback: "Run `wc -l access.log` to count the lines." };
  },
  successMessage: "`wc -l` is the quickest way to see how many records are in a file.",
};

// ── Registry ──────────────────────────────────────────────────────

export const LESSONS: Lesson[] = [
  lesson_00_01,
  lesson_01_01, lesson_01_02, lesson_01_03, lesson_01_04, lesson_01_05, lesson_01_06,
  lesson_02_01, lesson_02_02, lesson_02_03, lesson_02_04, lesson_02_05, lesson_02_06, lesson_02_07,
  lesson_03_01, lesson_03_02, lesson_03_03, lesson_03_04,
];

export interface ModuleMeta {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export const MODULES: ModuleMeta[] = [
  {
    id: 1,
    title: "Orientation",
    description: "Learn where you are and how to look around.",
    lessons: LESSONS.filter((l) => l.module === 1),
  },
  {
    id: 2,
    title: "Files and Directories",
    description: "Create, copy, move, and delete files and folders.",
    lessons: LESSONS.filter((l) => l.module === 2),
  },
  {
    id: 3,
    title: "Reading Files",
    description: "Inspect file contents without opening a text editor.",
    lessons: LESSONS.filter((l) => l.module === 3),
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getNextLesson(id: string): Lesson | undefined {
  const idx = LESSONS.findIndex((l) => l.id === id);
  return idx >= 0 ? LESSONS[idx + 1] : undefined;
}

export function getPrevLesson(id: string): Lesson | undefined {
  const idx = LESSONS.findIndex((l) => l.id === id);
  return idx > 0 ? LESSONS[idx - 1] : undefined;
}
