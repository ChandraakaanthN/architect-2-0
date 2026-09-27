"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  DownloadIcon,
  FileCodeIcon,
  Loader2Icon,
  SearchIcon,
  TerminalIcon,
  TriangleAlertIcon,
} from "lucide-react";
import type { ToolCall } from "@/lib/types";

const KIND_ICON: Record<ToolCall["kind"], typeof TerminalIcon> = {
  run_command: TerminalIcon,
  write_file: FileCodeIcon,
  read_file: FileCodeIcon,
  install_package: DownloadIcon,
  search: SearchIcon,
};

function StatusDot({ status }: { status: ToolCall["status"] }) {
  if (status === "running") return <Loader2Icon className="size-3.5 animate-spin text-sky-500" />;
  if (status === "error") return <TriangleAlertIcon className="size-3.5 text-destructive" />;
  return <span className="size-2 rounded-full bg-emerald-500" />;
}

function ToolCallRow({ call }: { call: ToolCall }) {
  const [open, setOpen] = useState(false);
  const Icon = KIND_ICON[call.kind];
  const hasOutput = Boolean(call.output);

  return (
    <div className="rounded-lg border bg-card/50">
      <button
        onClick={() => hasOutput && setOpen((o) => !o)}
        className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left ${hasOutput ? "cursor-pointer" : "cursor-default"}`}
      >
        <Icon className="size-3.5 shrink-0 text-muted-foreground" />
        <code className="min-w-0 flex-1 truncate font-mono text-xs">{call.target}</code>
        <StatusDot status={call.status} />
        {hasOutput && (
          <ChevronDownIcon className={`size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>
      {open && hasOutput && (
        <pre className="overflow-x-auto border-t px-2.5 py-2 font-mono text-xs text-muted-foreground">
          {call.output}
        </pre>
      )}
    </div>
  );
}

export function ToolCallLog({ calls }: { calls: ToolCall[] }) {
  if (calls.length === 0) {
    return <p className="text-xs text-muted-foreground">No tool calls yet.</p>;
  }
  return (
    <div className="space-y-1.5">
      {calls.map((call) => (
        <ToolCallRow key={call.id} call={call} />
      ))}
    </div>
  );
}
