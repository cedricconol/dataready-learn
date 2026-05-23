export type FileSystemNode = DirectoryNode | FileNode;

export interface DirectoryNode {
  type: "dir";
  name: string;
  children: FileSystemNode[];
  perms?: string;
  owner?: string;
}

export interface FileNode {
  type: "file";
  name: string;
  content: string;
  perms?: string;
  owner?: string;
}

export interface HistoryEntry {
  command: string;
  stdout: string;
  stderr: string;
}

export interface ShellState {
  fs: FileSystemNode;
  cwd: string;
  prevCwd: string;
  env: Record<string, string>;
  history: HistoryEntry[];
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  fs?: FileSystemNode;
  cwd?: string;
  prevCwd?: string;
  env?: Record<string, string>;
  exitCode: number;
}

export interface CommandFn {
  (args: string[], state: ShellState, stdin: string): CommandResult;
}

export interface ValidationResult {
  passed: boolean;
  feedback?: string;
}

export interface Lesson {
  id: string;
  module: number;
  title: string;
  intro: string;
  goal: string;
  hints: string[];
  initialFs: FileSystemNode;
  initialCwd: string;
  initialEnv?: Record<string, string>;
  allowedCommands?: string[];
  validate: (state: ShellState) => ValidationResult;
  successMessage: string;
}

export interface ChangedPath {
  path: string;
  change: "created" | "deleted" | "modified";
}

export interface Token {
  type: "word" | "pipe" | "redirect_out" | "redirect_append" | "redirect_in" | "redirect_err";
  value: string;
}

export interface PipelineStage {
  name: string;
  args: string[];
  redirectOut?: string;
  redirectOutAppend?: boolean;
  redirectIn?: string;
  redirectErr?: string;
}

export interface Pipeline {
  stages: PipelineStage[];
}
