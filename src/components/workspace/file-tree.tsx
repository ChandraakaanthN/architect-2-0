import { FileIcon, FolderIcon } from "lucide-react";
import type { FileNode } from "@/lib/types";

interface TreeDir {
  type: "dir";
  name: string;
  children: Map<string, TreeDir | TreeLeaf>;
}
interface TreeLeaf {
  type: "file";
  name: string;
  path: string;
}

function buildTree(files: FileNode[]): TreeDir {
  const root: TreeDir = { type: "dir", name: "", children: new Map() };
  for (const file of files) {
    const parts = file.path.split("/");
    let node = root;
    parts.forEach((part, i) => {
      const isLast = i === parts.length - 1;
      if (isLast) {
        node.children.set(part, { type: "file", name: part, path: file.path });
        return;
      }
      const existing = node.children.get(part);
      if (existing && existing.type === "dir") {
        node = existing;
      } else {
        const dir: TreeDir = { type: "dir", name: part, children: new Map() };
        node.children.set(part, dir);
        node = dir;
      }
    });
  }
  return root;
}

function Entries({
  dir,
  depth,
  activePath,
  onSelect,
}: {
  dir: TreeDir;
  depth: number;
  activePath: string | null;
  onSelect: (path: string) => void;
}) {
  const entries = [...dir.children.values()].sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      {entries.map((entry) =>
        entry.type === "dir" ? (
          <div key={entry.name}>
            <div
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground"
              style={{ paddingLeft: 8 + depth * 14 }}
            >
              <FolderIcon className="size-3.5" />
              {entry.name}
            </div>
            <Entries dir={entry} depth={depth + 1} activePath={activePath} onSelect={onSelect} />
          </div>
        ) : (
          <button
            key={entry.path}
            onClick={() => onSelect(entry.path)}
            style={{ paddingLeft: 8 + depth * 14 }}
            className={`flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left text-xs transition-colors ${
              activePath === entry.path
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <FileIcon className="size-3.5 shrink-0" />
            <span className="truncate">{entry.name}</span>
          </button>
        ),
      )}
    </>
  );
}

export function FileTree({
  files,
  activePath,
  onSelect,
}: {
  files: FileNode[];
  activePath: string | null;
  onSelect: (path: string) => void;
}) {
  if (files.length === 0) {
    return <p className="p-3 text-xs text-muted-foreground">No files generated yet.</p>;
  }
  const tree = buildTree(files);
  return (
    <div className="py-1.5">
      <Entries dir={tree} depth={0} activePath={activePath} onSelect={onSelect} />
    </div>
  );
}
