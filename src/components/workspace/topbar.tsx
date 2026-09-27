"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeftIcon, Loader2Icon, ShareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { backend } from "@/lib/backend";
import { MODELS } from "@/lib/demo-data";
import type { Project } from "@/lib/types";

export function WorkspaceTopbar({
  project,
  isBuilding,
  mode,
  onModeChange,
}: {
  project: Project;
  isBuilding: boolean;
  mode: "guided" | "developer";
  onModeChange: (mode: "guided" | "developer") => void;
}) {
  const [name, setName] = useState(project.name);
  const [model, setModel] = useState(project.model);

  async function commitName() {
    const trimmed = name.trim() || project.name;
    setName(trimmed);
    if (trimmed !== project.name) await backend.updateProject(project.id, { name: trimmed });
  }

  async function changeModel(next: string | null) {
    if (!next) return;
    setModel(next);
    await backend.updateProject(project.id, { model: next });
    toast.success("Model updated for this project");
  }

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3">
      <Button variant="ghost" size="icon-sm" nativeButton={false} render={<Link href="/dashboard" />}>
        <ArrowLeftIcon />
      </Button>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={commitName}
        onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
        className="min-w-0 max-w-56 truncate rounded-md bg-transparent px-1.5 py-1 text-sm font-medium outline-none hover:bg-muted focus:bg-muted"
      />

      {isBuilding ? (
        <Badge variant="secondary" className="gap-1">
          <Loader2Icon className="size-3 animate-spin" />
          Building
        </Badge>
      ) : project.status === "ready" ? (
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
          Ready
        </Badge>
      ) : (
        <Badge variant="destructive">Error</Badge>
      )}

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center rounded-lg border p-0.5 sm:flex">
          <button
            onClick={() => onModeChange("guided")}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              mode === "guided" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Guided
          </button>
          <button
            onClick={() => onModeChange("developer")}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              mode === "developer" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Developer
          </button>
        </div>

        <Select value={model} onValueChange={changeModel}>
          <SelectTrigger size="sm" className="hidden md:flex">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast.info("Share link copied", {
              description: `architect2.app/p/${project.id.slice(0, 8)} (demo — not a live link)`,
            })
          }
        >
          <ShareIcon />
          Share
        </Button>
      </div>
    </header>
  );
}
