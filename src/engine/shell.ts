import type {
  CommandFn,
  CommandResult,
  FileSystemNode,
  Pipeline,
  PipelineStage,
  ShellState,
  Token,
} from "./types";
import {
  cloneFs,
  deleteNode,
  getDirname,
  getBasename,
  getNode,
  normalize,
  resolvePath,
  setNode,
  detectChanges,
} from "./filesystem";
import type { ChangedPath } from "./types";
import type { DirectoryNode, FileNode } from "./types";

// ── Helpers ───────────────────────────────────────────────────────

function ok(stdout: string, overrides?: Partial<CommandResult>): CommandResult {
  return { stdout, stderr: "", exitCode: 0, ...overrides };
}

function err(stderr: string): CommandResult {
  return { stdout: "", stderr, exitCode: 1 };
}

// ── Commands ──────────────────────────────────────────────────────

const pwd: CommandFn = (_args, state) => ok(state.cwd);

const ls: CommandFn = (args, state, stdin) => {
  const flagStr = args
    .filter((a) => a.startsWith("-"))
    .map((a) => a.slice(1))
    .join("");
  const showHidden = flagStr.includes("a");
  const longFormat = flagStr.includes("l");
  const pathArgs = args.filter((a) => !a.startsWith("-"));

  const targets = pathArgs.length > 0 ? pathArgs : ["."];

  const lines: string[] = [];

  for (const target of targets) {
    const targetPath = resolvePath(state.cwd, target);
    const node = getNode(state.fs, targetPath);
    if (!node) {
      return err(`ls: ${target}: No such file or directory`);
    }

    if (node.type === "file") {
      lines.push(target);
      continue;
    }

    const dir = node as DirectoryNode;
    let entries: FileSystemNode[] = [...dir.children];
    if (!showHidden) entries = entries.filter((c) => !c.name.startsWith("."));
    entries.sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    if (targets.length > 1) lines.push(`${target}:`);

    if (!longFormat) {
      const row = entries
        .map((e) => (e.type === "dir" ? `\x1b[34m${e.name}\x1b[0m` : e.name))
        .join("  ");
      lines.push(row);
    } else {
      for (const e of entries) {
        const perms = e.perms ?? (e.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--");
        const size = e.type === "file" ? String((e as FileNode).content.length).padStart(6) : "  4096";
        const name = e.type === "dir" ? `\x1b[34m${e.name}\x1b[0m` : e.name;
        lines.push(`${perms} 1 user user ${size} Jan  1 00:00 ${name}`);
      }
    }
  }

  void stdin;
  return ok(lines.join("\n"));
};

const cd: CommandFn = (args, state) => {
  const target = args[0] ?? "~";
  let newPath: string;

  if (target === "-") {
    newPath = state.prevCwd || state.cwd;
  } else {
    newPath = resolvePath(state.cwd, target);
  }

  const node = getNode(state.fs, newPath);
  if (!node) return err(`cd: ${args[0] ?? "~"}: No such file or directory`);
  if (node.type !== "dir") return err(`cd: ${args[0]}: Not a directory`);

  return ok("", { cwd: newPath, prevCwd: state.cwd });
};

const touch: CommandFn = (args, state) => {
  if (args.length === 0) return err("touch: missing file operand");

  let fs = state.fs;
  for (const arg of args) {
    const path = resolvePath(state.cwd, arg);
    const existing = getNode(fs, path);
    if (existing) continue; // already exists, do nothing
    const parentPath = getDirname(path);
    const parent = getNode(fs, parentPath);
    if (!parent || parent.type !== "dir") {
      return err(`touch: cannot touch '${arg}': No such file or directory`);
    }
    const newFile: FileNode = { type: "file", name: getBasename(path), content: "" };
    fs = setNode(fs, path, newFile);
  }

  return ok("", { fs });
};

const mkdir: CommandFn = (args, state) => {
  const flags = args.filter((a) => a.startsWith("-")).map((a) => a.slice(1)).join("");
  const parents = flags.includes("p");
  const pathArgs = args.filter((a) => !a.startsWith("-"));

  if (pathArgs.length === 0) return err("mkdir: missing operand");

  let fs = state.fs;
  for (const arg of pathArgs) {
    const path = normalize(resolvePath(state.cwd, arg));

    if (parents) {
      const parts = path.slice(1).split("/");
      let current = "/";
      for (const part of parts) {
        current = current === "/" ? "/" + part : current + "/" + part;
        const existing = getNode(fs, current);
        if (!existing) {
          const newDir: DirectoryNode = { type: "dir", name: part, children: [] };
          fs = setNode(fs, current, newDir);
        } else if (existing.type !== "dir") {
          return err(`mkdir: cannot create directory '${current}': File exists`);
        }
      }
    } else {
      const existing = getNode(fs, path);
      if (existing) return err(`mkdir: cannot create directory '${arg}': File exists`);
      const parentPath = getDirname(path);
      const parent = getNode(fs, parentPath);
      if (!parent || parent.type !== "dir") {
        return err(`mkdir: cannot create directory '${arg}': No such file or directory`);
      }
      const newDir: DirectoryNode = { type: "dir", name: getBasename(path), children: [] };
      fs = setNode(fs, path, newDir);
    }
  }

  return ok("", { fs });
};

const cat: CommandFn = (args, state, stdin) => {
  if (args.length === 0) return ok(stdin);

  const lines: string[] = [];
  for (const arg of args) {
    const path = resolvePath(state.cwd, arg);
    const node = getNode(state.fs, path);
    if (!node) return err(`cat: ${arg}: No such file or directory`);
    if (node.type !== "file") return err(`cat: ${arg}: Is a directory`);
    lines.push((node as FileNode).content);
  }

  return ok(lines.join("\n"));
};

const echoCmd: CommandFn = (args) => {
  let noNewline = false;
  const rest = [...args];
  if (rest[0] === "-n") { noNewline = true; rest.shift(); }
  const out = rest.join(" ") + (noNewline ? "" : "");
  return ok(out);
};

const rm: CommandFn = (args, state) => {
  const flags = args.filter((a) => a.startsWith("-")).map((a) => a.slice(1)).join("");
  const recursive = flags.includes("r") || flags.includes("f");
  const force = flags.includes("f");
  const pathArgs = args.filter((a) => !a.startsWith("-"));

  if (pathArgs.length === 0) return err("rm: missing operand");

  let fs = state.fs;
  for (const arg of pathArgs) {
    const path = resolvePath(state.cwd, arg);
    const node = getNode(fs, path);
    if (!node) {
      if (force) continue;
      return err(`rm: cannot remove '${arg}': No such file or directory`);
    }
    if (node.type === "dir" && !recursive) {
      return err(`rm: cannot remove '${arg}': Is a directory`);
    }
    if (path === "/" || path === "/home" || path === "/home/user") {
      return err(`rm: cannot remove '${arg}': Permission denied`);
    }
    fs = deleteNode(fs, path);
  }

  return ok("", { fs });
};

const cp: CommandFn = (args, state) => {
  const flags = args.filter((a) => a.startsWith("-")).map((a) => a.slice(1)).join("");
  const recursive = flags.includes("r") || flags.includes("R");
  const pathArgs = args.filter((a) => !a.startsWith("-"));

  if (pathArgs.length < 2) return err("cp: missing destination file operand");

  const destArg = pathArgs[pathArgs.length - 1];
  const srcs = pathArgs.slice(0, -1);
  const destPath = resolvePath(state.cwd, destArg);
  const destNode = getNode(state.fs, destPath);

  let fs = state.fs;

  for (const srcArg of srcs) {
    const srcPath = resolvePath(state.cwd, srcArg);
    const srcNode = getNode(fs, srcPath);
    if (!srcNode) return err(`cp: ${srcArg}: No such file or directory`);
    if (srcNode.type === "dir" && !recursive) {
      return err(`cp: -r not specified; omitting directory '${srcArg}'`);
    }

    let targetPath: string;
    if (destNode && destNode.type === "dir") {
      targetPath = destPath + "/" + getBasename(srcPath);
    } else {
      targetPath = destPath;
    }

    const cloned = cloneFs(srcNode);
    (cloned as { name: string }).name = getBasename(targetPath);
    fs = setNode(fs, targetPath, cloned);
  }

  return ok("", { fs });
};

const mv: CommandFn = (args, state) => {
  const pathArgs = args.filter((a) => !a.startsWith("-"));
  if (pathArgs.length < 2) return err("mv: missing destination file operand");

  const destArg = pathArgs[pathArgs.length - 1];
  const srcs = pathArgs.slice(0, -1);
  const destPath = resolvePath(state.cwd, destArg);
  const destNode = getNode(state.fs, destPath);

  let fs = state.fs;

  for (const srcArg of srcs) {
    const srcPath = resolvePath(state.cwd, srcArg);
    const srcNode = getNode(fs, srcPath);
    if (!srcNode) return err(`mv: cannot stat '${srcArg}': No such file or directory`);

    let targetPath: string;
    if (destNode && destNode.type === "dir") {
      targetPath = destPath + "/" + getBasename(srcPath);
    } else {
      targetPath = destPath;
    }

    const cloned = cloneFs(srcNode);
    (cloned as { name: string }).name = getBasename(targetPath);
    fs = setNode(fs, targetPath, cloned);
    fs = deleteNode(fs, srcPath);
  }

  return ok("", { fs });
};

const head: CommandFn = (args, state, stdin) => {
  let n = 10;
  const rest = [...args];
  const nIdx = rest.findIndex((a) => a === "-n");
  if (nIdx >= 0) {
    n = parseInt(rest[nIdx + 1] ?? "10", 10) || 10;
    rest.splice(nIdx, 2);
  } else {
    const numFlag = rest.find((a) => /^-\d+$/.test(a));
    if (numFlag) { n = parseInt(numFlag.slice(1), 10); rest.splice(rest.indexOf(numFlag), 1); }
  }
  const pathArg = rest.find((a) => !a.startsWith("-"));

  let content: string;
  if (pathArg) {
    const path = resolvePath(state.cwd, pathArg);
    const node = getNode(state.fs, path);
    if (!node) return err(`head: cannot open '${pathArg}': No such file or directory`);
    if (node.type !== "file") return err(`head: error reading '${pathArg}': Is a directory`);
    content = (node as FileNode).content;
  } else {
    content = stdin;
  }

  const lines = content.split("\n").slice(0, n).join("\n");
  return ok(lines);
};

const tail: CommandFn = (args, state, stdin) => {
  let n = 10;
  const rest = [...args];
  const nIdx = rest.findIndex((a) => a === "-n");
  if (nIdx >= 0) {
    n = parseInt(rest[nIdx + 1] ?? "10", 10) || 10;
    rest.splice(nIdx, 2);
  } else {
    const numFlag = rest.find((a) => /^-\d+$/.test(a));
    if (numFlag) { n = parseInt(numFlag.slice(1), 10); rest.splice(rest.indexOf(numFlag), 1); }
  }
  const pathArg = rest.find((a) => !a.startsWith("-"));

  let content: string;
  if (pathArg) {
    const path = resolvePath(state.cwd, pathArg);
    const node = getNode(state.fs, path);
    if (!node) return err(`tail: cannot open '${pathArg}': No such file or directory`);
    if (node.type !== "file") return err(`tail: error reading '${pathArg}': Is a directory`);
    content = (node as FileNode).content;
  } else {
    content = stdin;
  }

  const lines = content.split("\n").slice(-n).join("\n");
  return ok(lines);
};

const wc: CommandFn = (args, state, stdin) => {
  const flags = args.filter((a) => a.startsWith("-")).map((a) => a.slice(1)).join("");
  const pathArgs = args.filter((a) => !a.startsWith("-"));

  const showLines = flags.includes("l") || flags === "";
  const showWords = flags.includes("w") || flags === "";
  const showChars = flags.includes("c") || flags === "";

  let content: string;
  let label = "";

  if (pathArgs.length > 0) {
    const path = resolvePath(state.cwd, pathArgs[0]);
    const node = getNode(state.fs, path);
    if (!node) return err(`wc: ${pathArgs[0]}: No such file or directory`);
    if (node.type !== "file") return err(`wc: ${pathArgs[0]}: Is a directory`);
    content = (node as FileNode).content;
    label = " " + pathArgs[0];
  } else {
    content = stdin;
  }

  const lineCount = content ? content.split("\n").length : 0;
  const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 0;
  const charCount = content.length;

  const parts: string[] = [];
  if (showLines) parts.push(String(lineCount).padStart(8));
  if (showWords) parts.push(String(wordCount).padStart(8));
  if (showChars) parts.push(String(charCount).padStart(8));

  return ok(parts.join("") + label);
};

const grep: CommandFn = (args, state, stdin) => {
  const flags = args.filter((a) => a.startsWith("-")).map((a) => a.slice(1)).join("");
  const ignoreCase = flags.includes("i");
  const showLineNums = flags.includes("n");
  const invert = flags.includes("v");
  const recursive = flags.includes("r") || flags.includes("R");

  const rest = args.filter((a) => !a.startsWith("-"));
  if (rest.length === 0) return err("grep: missing pattern operand");

  const pattern = rest[0];
  const pathArgs = rest.slice(1);

  const regexFlags = ignoreCase ? "gi" : "g";
  let regex: RegExp;
  try {
    regex = new RegExp(pattern.replace(/\*/g, ".*"), regexFlags);
  } catch {
    return err(`grep: invalid regular expression: ${pattern}`);
  }

  function searchContent(content: string, label: string): string[] {
    return content.split("\n").reduce<string[]>((acc, line, idx) => {
      const matches = regex.test(line);
      regex.lastIndex = 0;
      if (matches !== invert) {
        let out = "";
        if (label) out += `\x1b[35m${label}\x1b[0m:`;
        if (showLineNums) out += `\x1b[32m${idx + 1}\x1b[0m:`;
        out += line;
        acc.push(out);
      }
      return acc;
    }, []);
  }

  const lines: string[] = [];

  if (pathArgs.length === 0) {
    lines.push(...searchContent(stdin, ""));
  } else if (recursive && pathArgs.length > 0) {
    function walkDir(node: FileSystemNode, basePath: string) {
      if (node.type === "file") {
        lines.push(...searchContent((node as FileNode).content, basePath));
      } else {
        for (const child of (node as DirectoryNode).children) {
          const childPath = basePath === "." ? child.name : basePath + "/" + child.name;
          walkDir(child, childPath);
        }
      }
    }
    for (const pathArg of pathArgs) {
      const path = resolvePath(state.cwd, pathArg);
      const node = getNode(state.fs, path);
      if (!node) return err(`grep: ${pathArg}: No such file or directory`);
      walkDir(node, pathArg);
    }
  } else {
    const useLabel = pathArgs.length > 1;
    for (const pathArg of pathArgs) {
      const path = resolvePath(state.cwd, pathArg);
      const node = getNode(state.fs, path);
      if (!node) return err(`grep: ${pathArg}: No such file or directory`);
      if (node.type !== "file") continue;
      lines.push(...searchContent((node as FileNode).content, useLabel ? pathArg : ""));
    }
  }

  return ok(lines.join("\n"));
};

const find: CommandFn = (args, state) => {
  const start = args[0] && !args[0].startsWith("-") ? args[0] : ".";
  const startPath = resolvePath(state.cwd, start);
  const rest = args[0] && !args[0].startsWith("-") ? args.slice(1) : args;

  let namePattern: string | null = null;
  let typeFilter: string | null = null;

  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === "-name") namePattern = rest[++i] ?? null;
    if (rest[i] === "-type") typeFilter = rest[++i] ?? null;
    if (rest[i] === "-mtime") ++i; // accept but ignore
  }

  const results: string[] = [];

  function walk(node: FileSystemNode, path: string) {
    const nameMatch = !namePattern || matchGlob(node.name, namePattern);
    const typeMatch =
      !typeFilter ||
      (typeFilter === "f" && node.type === "file") ||
      (typeFilter === "d" && node.type === "dir");

    if (nameMatch && typeMatch) results.push(path);

    if (node.type === "dir") {
      for (const child of (node as DirectoryNode).children) {
        const childPath = path === "." ? "./" + child.name : path + "/" + child.name;
        walk(child, childPath);
      }
    }
  }

  const startNode = getNode(state.fs, startPath);
  if (!startNode) return err(`find: '${start}': No such file or directory`);
  walk(startNode, start);

  return ok(results.join("\n"));
};

function matchGlob(name: string, pattern: string): boolean {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`).test(name);
}

const chmod: CommandFn = (args, state) => {
  if (args.length < 2) return err("chmod: missing operand");
  const [mode, ...pathArgs] = args;
  if (pathArgs.length === 0) return err("chmod: missing operand");

  let fs = state.fs;
  for (const pathArg of pathArgs) {
    const path = resolvePath(state.cwd, pathArg);
    const node = getNode(fs, path);
    if (!node) return err(`chmod: cannot access '${pathArg}': No such file or directory`);

    let perms: string;
    if (/^\d+$/.test(mode)) {
      perms = octalToPerms(parseInt(mode, 8), node.type === "dir");
    } else {
      perms = applySymbolicMode(
        node.perms ?? (node.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--"),
        mode
      );
    }
    const updated: FileSystemNode = { ...node, perms } as FileSystemNode;
    fs = setNode(fs, path, updated);
  }

  return ok("", { fs });
};

function octalToPerms(octal: number, isDir: boolean): string {
  const chars = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];
  const u = (octal >> 6) & 7;
  const g = (octal >> 3) & 7;
  const o = octal & 7;
  return (isDir ? "d" : "-") + chars[u] + chars[g] + chars[o];
}

function applySymbolicMode(current: string, mode: string): string {
  const addExec = mode.includes("+x");
  const removeExec = mode.includes("-x");
  let p = current.split("");
  if (addExec) { p[3] = "x"; p[6] = "x"; p[9] = "x"; }
  if (removeExec) { p[3] = "-"; p[6] = "-"; p[9] = "-"; }
  return p.join("");
}

const envCmd: CommandFn = (_args, state) => {
  const lines = Object.entries(state.env).map(([k, v]) => `${k}=${v}`);
  return ok(lines.join("\n"));
};

const exportCmd: CommandFn = (args, state) => {
  const env = { ...state.env };
  for (const arg of args) {
    const eqIdx = arg.indexOf("=");
    if (eqIdx < 0) continue;
    const key = arg.slice(0, eqIdx);
    const value = arg.slice(eqIdx + 1);
    env[key] = value;
  }
  return ok("", { env });
};

const sort: CommandFn = (args, state, stdin) => {
  const flags = args.filter((a) => a.startsWith("-")).map((a) => a.slice(1)).join("");
  const numeric = flags.includes("n");
  const reverse = flags.includes("r");
  const unique = flags.includes("u");
  const pathArg = args.find((a) => !a.startsWith("-"));

  let content: string;
  if (pathArg) {
    const path = resolvePath(state.cwd, pathArg);
    const node = getNode(state.fs, path);
    if (!node) return err(`sort: cannot read: ${pathArg}: No such file or directory`);
    if (node.type !== "file") return err(`sort: read failed: ${pathArg}: Is a directory`);
    content = (node as FileNode).content;
  } else {
    content = stdin;
  }

  let lines = content.split("\n");
  if (unique) lines = [...new Set(lines)];
  lines.sort((a, b) => {
    if (numeric) return parseFloat(a) - parseFloat(b);
    return a.localeCompare(b);
  });
  if (reverse) lines.reverse();
  return ok(lines.join("\n"));
};

const uniq: CommandFn = (args, _state, stdin) => {
  const flags = args.filter((a) => a.startsWith("-")).map((a) => a.slice(1)).join("");
  const count = flags.includes("c");

  const lines = stdin.split("\n");
  const result: string[] = [];
  let i = 0;
  while (i < lines.length) {
    let j = i + 1;
    while (j < lines.length && lines[j] === lines[i]) j++;
    const c = j - i;
    result.push(count ? `${String(c).padStart(7)} ${lines[i]}` : lines[i]);
    i = j;
  }
  return ok(result.join("\n"));
};

const cut: CommandFn = (args, _state, stdin) => {
  const dIdx = args.findIndex((a) => a === "-d");
  const fIdx = args.findIndex((a) => a === "-f");
  const delim = dIdx >= 0 ? args[dIdx + 1] ?? "\t" : "\t";
  const fieldSpec = fIdx >= 0 ? args[fIdx + 1] ?? "1" : "1";

  const fields = fieldSpec.split(",").flatMap((s) => {
    if (s.includes("-")) {
      const [a, b] = s.split("-").map(Number);
      return Array.from({ length: b - a + 1 }, (_, i) => a + i);
    }
    return [Number(s)];
  });

  const lines = stdin.split("\n").map((line) => {
    const parts = line.split(delim);
    return fields.map((f) => parts[f - 1] ?? "").join(delim);
  });

  return ok(lines.join("\n"));
};

const tr: CommandFn = (args, _state, stdin) => {
  const flags = args.filter((a) => a.startsWith("-")).map((a) => a.slice(1)).join("");
  const del = flags.includes("d");
  const rest = args.filter((a) => !a.startsWith("-"));

  if (rest.length === 0) return err("tr: missing operand");

  function expandRange(s: string): string {
    return s.replace(/(.)-(.)/g, (_m, a: string, b: string) => {
      let out = "";
      for (let c = a.charCodeAt(0); c <= b.charCodeAt(0); c++) out += String.fromCharCode(c);
      return out;
    });
  }

  const set1 = expandRange(rest[0]);
  const set2 = rest[1] ? expandRange(rest[1]) : "";

  let result = stdin;
  if (del) {
    result = result.split("").filter((c) => !set1.includes(c)).join("");
  } else {
    result = result
      .split("")
      .map((c) => {
        const idx = set1.indexOf(c);
        if (idx < 0) return c;
        return set2[Math.min(idx, set2.length - 1)] ?? c;
      })
      .join("");
  }

  return ok(result);
};

const help: CommandFn = () =>
  ok(
    [
      "\x1b[1mAvailable commands:\x1b[0m",
      "  pwd          Print working directory",
      "  ls           List directory contents",
      "  cd           Change directory",
      "  touch        Create empty file",
      "  mkdir        Create directory",
      "  cat          Print file contents",
      "  echo         Print arguments",
      "  rm           Remove files or directories",
      "  cp           Copy files or directories",
      "  mv           Move or rename files",
      "  head         Print first N lines",
      "  tail         Print last N lines",
      "  wc           Count lines, words, chars",
      "  grep         Search for pattern",
      "  find         Find files",
      "  sort         Sort lines",
      "  uniq         Remove duplicate lines",
      "  cut          Extract columns",
      "  tr           Translate characters",
      "  chmod        Change file permissions",
      "  env          Print environment variables",
      "  export       Set environment variable",
      "  help         Show this help",
    ].join("\n")
  );

// ── Command Registry ──────────────────────────────────────────────

const commandRegistry: Record<string, CommandFn> = {
  pwd,
  ls,
  cd,
  touch,
  mkdir,
  cat,
  echo: echoCmd,
  rm,
  cp,
  mv,
  head,
  tail,
  wc,
  grep,
  find,
  sort,
  uniq,
  cut,
  tr,
  chmod,
  env: envCmd,
  export: exportCmd,
  help,
};

// ── Tokenizer ─────────────────────────────────────────────────────

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    if (/\s/.test(input[i])) { i++; continue; }

    if (input[i] === "|") { tokens.push({ type: "pipe", value: "|" }); i++; continue; }

    if (input[i] === ">" && input[i + 1] === ">") {
      tokens.push({ type: "redirect_append", value: ">>" }); i += 2; continue;
    }
    if (input[i] === ">") { tokens.push({ type: "redirect_out", value: ">" }); i++; continue; }
    if (input[i] === "<") { tokens.push({ type: "redirect_in", value: "<" }); i++; continue; }
    if (input[i] === "2" && input[i + 1] === ">") {
      tokens.push({ type: "redirect_err", value: "2>" }); i += 2; continue;
    }

    if (input[i] === '"' || input[i] === "'") {
      const q = input[i];
      let val = "";
      i++;
      while (i < input.length && input[i] !== q) {
        if (input[i] === "\\" && q === '"' && i + 1 < input.length) { val += input[++i]; i++; }
        else { val += input[i++]; }
      }
      i++;
      tokens.push({ type: "word", value: val });
      continue;
    }

    let word = "";
    while (i < input.length && !/[\s|<>]/.test(input[i])) {
      if (input[i] === "\\" && i + 1 < input.length) { word += input[++i]; i++; }
      else { word += input[i++]; }
    }
    if (word) tokens.push({ type: "word", value: word });
  }

  return tokens;
}

// ── Parser ────────────────────────────────────────────────────────

function parse(tokens: Token[]): Pipeline {
  const stages: PipelineStage[] = [];
  let current: PipelineStage | null = null;
  let expectTarget: "out" | "append" | "in" | "err" | null = null;

  for (const tok of tokens) {
    if (tok.type === "pipe") {
      if (current) stages.push(current);
      current = null;
      expectTarget = null;
      continue;
    }

    if (expectTarget !== null) {
      if (tok.type === "word" && current) {
        if (expectTarget === "out") current.redirectOut = tok.value;
        else if (expectTarget === "append") { current.redirectOut = tok.value; current.redirectOutAppend = true; }
        else if (expectTarget === "in") current.redirectIn = tok.value;
        else if (expectTarget === "err") current.redirectErr = tok.value;
      }
      expectTarget = null;
      continue;
    }

    if (tok.type === "redirect_out") { expectTarget = "out"; continue; }
    if (tok.type === "redirect_append") { expectTarget = "append"; continue; }
    if (tok.type === "redirect_in") { expectTarget = "in"; continue; }
    if (tok.type === "redirect_err") { expectTarget = "err"; continue; }

    if (!current) {
      current = { name: tok.value, args: [] };
    } else {
      current.args.push(tok.value);
    }
  }

  if (current) stages.push(current);
  return { stages };
}

// ── Executor ──────────────────────────────────────────────────────

export interface ExecuteResult {
  newState: ShellState;
  output: string;
  changedPaths: ChangedPath[];
}

export function executeCommand(input: string, state: ShellState): ExecuteResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      newState: state,
      output: "",
      changedPaths: [],
    };
  }

  // Expand env vars like $HOME, $USER, $PATH in input
  const expanded = trimmed.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, name: string) => {
    const val = state.env[name];
    return val !== undefined ? val : `$${name}`;
  });

  const tokens = tokenize(expanded);
  const pipeline = parse(tokens);

  if (pipeline.stages.length === 0) {
    return { newState: state, output: "", changedPaths: [] };
  }

  let stdin = "";
  let currentState = state;
  let lastStdout = "";
  let lastStderr = "";

  for (const stage of pipeline.stages) {
    let stageStdin = stdin;

    if (stage.redirectIn) {
      const path = resolvePath(currentState.cwd, stage.redirectIn);
      const node = getNode(currentState.fs, path);
      if (!node || node.type !== "file") {
        lastStderr = `${stage.redirectIn}: No such file or directory`;
        lastStdout = "";
        break;
      }
      stageStdin = (node as FileNode).content;
    }

    const cmdFn = commandRegistry[stage.name];
    if (!cmdFn) {
      lastStderr = `${stage.name}: command not found`;
      lastStdout = "";
      break;
    }

    const result = cmdFn(stage.args, currentState, stageStdin);
    lastStdout = result.stdout;
    lastStderr = result.stderr;

    if (result.fs) currentState = { ...currentState, fs: result.fs };
    if (result.cwd !== undefined) currentState = { ...currentState, cwd: result.cwd };
    if (result.prevCwd !== undefined) currentState = { ...currentState, prevCwd: result.prevCwd };
    if (result.env) currentState = { ...currentState, env: result.env };

    if (stage.redirectOut) {
      const path = resolvePath(currentState.cwd, stage.redirectOut);
      const existing = getNode(currentState.fs, path);
      const prevContent = stage.redirectOutAppend && existing?.type === "file"
        ? (existing as FileNode).content
        : "";
      const newContent = prevContent + lastStdout;
      const newFile: FileNode = { type: "file", name: getBasename(path), content: newContent };
      const parentPath = getDirname(path);
      const parent = getNode(currentState.fs, parentPath);
      if (parent && parent.type === "dir") {
        currentState = { ...currentState, fs: setNode(currentState.fs, path, newFile) };
      }
      lastStdout = "";
    }

    stdin = lastStdout;
  }

  const output = lastStderr
    ? `\x1b[31m${lastStderr}\x1b[0m`
    : lastStdout;

  const changed = detectChanges(state.fs, currentState.fs);

  const newState: ShellState = {
    ...currentState,
    history: [...state.history, { command: trimmed, stdout: lastStdout, stderr: lastStderr }],
  };

  return { newState, output, changedPaths: changed };
}

export function getPrompt(cwd: string): string {
  const display = cwd.replace("/home/user", "~");
  return `\x1b[32m${display}\x1b[0m \x1b[1;34m$\x1b[0m `;
}

export function makeInitialState(lesson: { initialFs: FileSystemNode; initialCwd: string; initialEnv?: Record<string, string> }): ShellState {
  return {
    fs: cloneFs(lesson.initialFs),
    cwd: lesson.initialCwd,
    prevCwd: lesson.initialCwd,
    env: {
      HOME: "/home/user",
      USER: "user",
      PATH: "/usr/local/bin:/usr/bin:/bin",
      SHELL: "/bin/bash",
      ...lesson.initialEnv,
    },
    history: [],
  };
}
