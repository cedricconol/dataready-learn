import type { FileSystemNode, DirectoryNode, FileNode, ChangedPath } from "./types";

export function normalize(path: string): string {
  const parts: string[] = [];
  for (const seg of path.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return "/" + parts.join("/");
}

export function resolvePath(cwd: string, input: string): string {
  if (!input || input === "~") return "/home/user";
  if (input.startsWith("~/")) return normalize("/home/user/" + input.slice(2));
  if (input.startsWith("/")) return normalize(input);
  return normalize(cwd + "/" + input);
}

export function getBasename(path: string): string {
  const norm = normalize(path);
  const parts = norm.split("/");
  return parts[parts.length - 1] || "/";
}

export function getDirname(path: string): string {
  const norm = normalize(path);
  const idx = norm.lastIndexOf("/");
  if (idx <= 0) return "/";
  return norm.slice(0, idx);
}

export function getNode(root: FileSystemNode, path: string): FileSystemNode | null {
  const norm = normalize(path);
  if (norm === "/") return root;
  const parts = norm.slice(1).split("/");
  let current: FileSystemNode = root;
  for (const part of parts) {
    if (current.type !== "dir") return null;
    const child = (current as DirectoryNode).children.find((c) => c.name === part);
    if (!child) return null;
    current = child;
  }
  return current;
}

export function cloneFs(node: FileSystemNode): FileSystemNode {
  if (node.type === "file") return { ...node };
  return { ...(node as DirectoryNode), children: (node as DirectoryNode).children.map(cloneFs) };
}

export function setNode(root: FileSystemNode, path: string, newNode: FileSystemNode): FileSystemNode {
  const norm = normalize(path);
  if (norm === "/") return newNode;

  function insert(current: FileSystemNode, parts: string[]): FileSystemNode {
    if (current.type !== "dir") return current;
    const dir = current as DirectoryNode;
    const [head, ...rest] = parts;
    if (rest.length === 0) {
      const idx = dir.children.findIndex((c) => c.name === head);
      const next = [...dir.children];
      if (idx >= 0) {
        next[idx] = newNode;
      } else {
        next.push(newNode);
      }
      return { ...dir, children: next };
    }
    const childIdx = dir.children.findIndex((c) => c.name === head);
    if (childIdx < 0) return current;
    const next = [...dir.children];
    next[childIdx] = insert(dir.children[childIdx], rest);
    return { ...dir, children: next };
  }

  return insert(root, norm.slice(1).split("/"));
}

export function deleteNode(root: FileSystemNode, path: string): FileSystemNode {
  const norm = normalize(path);
  if (norm === "/") return root;

  function remove(current: FileSystemNode, parts: string[]): FileSystemNode {
    if (current.type !== "dir") return current;
    const dir = current as DirectoryNode;
    const [head, ...rest] = parts;
    if (rest.length === 0) {
      return { ...dir, children: dir.children.filter((c) => c.name !== head) };
    }
    const childIdx = dir.children.findIndex((c) => c.name === head);
    if (childIdx < 0) return current;
    const next = [...dir.children];
    next[childIdx] = remove(dir.children[childIdx], rest);
    return { ...dir, children: next };
  }

  return remove(root, norm.slice(1).split("/"));
}

export function pathExists(root: FileSystemNode, path: string): boolean {
  return getNode(root, path) !== null;
}

export function detectChanges(oldFs: FileSystemNode, newFs: FileSystemNode): ChangedPath[] {
  const changes: ChangedPath[] = [];
  const oldPaths = new Map<string, FileSystemNode>();
  const newPaths = new Map<string, FileSystemNode>();

  function walk(node: FileSystemNode, path: string, map: Map<string, FileSystemNode>) {
    map.set(path, node);
    if (node.type === "dir") {
      for (const child of (node as DirectoryNode).children) {
        const childPath = path === "/" ? "/" + child.name : path + "/" + child.name;
        walk(child, childPath, map);
      }
    }
  }

  walk(oldFs, "/", oldPaths);
  walk(newFs, "/", newPaths);

  for (const [path, oldNode] of oldPaths) {
    if (!newPaths.has(path)) {
      changes.push({ path, change: "deleted" });
    } else if (oldNode.type === "file" && newPaths.get(path)!.type === "file") {
      if ((oldNode as FileNode).content !== (newPaths.get(path) as FileNode).content) {
        changes.push({ path, change: "modified" });
      }
    }
  }

  for (const [path] of newPaths) {
    if (!oldPaths.has(path)) {
      changes.push({ path, change: "created" });
    }
  }

  return changes;
}
