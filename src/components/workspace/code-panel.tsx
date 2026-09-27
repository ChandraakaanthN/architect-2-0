"use client";

import { FileTree } from "@/components/workspace/file-tree";
import { highlight } from "@/lib/highlight";
import type { FileNode } from "@/lib/types";

export function CodePanel({
  files,
  activePath,
  onSelectPath,
}: {
  files: FileNode[];
  activePath: string | null;
  onSelectPath: (path: string) => void;
}) {
  const activeFile = files.find((f) => f.path === activePath) ?? files[0] ?? null;

  return (
    <div className="grid h-full min-h-0 grid-cols-[200px_1fr]">
      <div className="min-h-0 overflow-y-auto border-r">
        <FileTree files={files} activePath={activeFile?.path ?? null} onSelect={onSelectPath} />
      </div>
      <div className="min-h-0 overflow-auto">
        {activeFile ? (
          <>
            <div className="sticky top-0 border-b bg-background/95 px-4 py-2 font-mono text-xs text-muted-foreground backdrop-blur">
              {activeFile.path}
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed">
              <code
                dangerouslySetInnerHTML={{ __html: highlight(activeFile.content, activeFile.language) }}
              />
            </pre>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Files will appear here as they&apos;re generated.
          </div>
        )}
      </div>
    </div>
  );
}
