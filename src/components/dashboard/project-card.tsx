"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { backend } from "@/lib/backend";
import { MODELS, TEMPLATES } from "@/lib/demo-data";
import { TemplateIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

const STATUS_LABELS: Record<Project["status"], string> = {
  generating: "Generating",
  ready: "Ready",
  error: "Error",
};

const STATUS_STYLES: Record<Project["status"], string> = {
  generating: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ready: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
};

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diffMs / 1000);
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  const month = Math.round(day / 30);
  if (month < 12) return `${month}mo ago`;
  const year = Math.round(month / 12);
  return `${year}y ago`;
}

interface ProjectCardProps {
  project: Project;
  onChanged: () => void;
}

export function ProjectCard({ project, onChanged }: ProjectCardProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const template =
    TEMPLATES.find((t) => t.id === project.template) ??
    TEMPLATES.find((t) => t.framework === project.framework) ??
    TEMPLATES[TEMPLATES.length - 1];
  const model = MODELS.find((m) => m.id === project.model);

  function openProject() {
    router.push(`/projects/${project.id}`);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await backend.deleteProject(project.id);
      toast.success("Project deleted");
      setDeleteOpen(false);
      onChanged();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={openProject}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openProject();
          }
        }}
        className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card ring-1 ring-foreground/5 transition-colors hover:border-foreground/20 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-start justify-between gap-2 p-4 pb-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <TemplateIcon icon={template.icon} className="size-4" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium">{project.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Updated {formatRelativeTime(project.updated_at)}
              </p>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="opacity-0 transition-opacity group-hover:opacity-100 data-[popup-open]:opacity-100"
                  >
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Project actions</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => toast.info("Rename is coming soon")}>
                  <Pencil className="size-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Duplicate is coming soon")}>
                  <Copy className="size-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="px-4 pb-4">
          <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
            {project.description?.trim() || "No description yet."}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="gap-1 text-muted-foreground">
              <TemplateIcon icon={template.icon} className="size-3" />
              {template.name}
            </Badge>
            <Badge variant="outline" className={cn(STATUS_STYLES[project.status])}>
              {STATUS_LABELS[project.status]}
            </Badge>
            {model && (
              <Badge variant="secondary" className="text-muted-foreground">
                {model.label}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete &ldquo;{project.name}&rdquo;?</DialogTitle>
            <DialogDescription>
              This permanently deletes the project and its chat history. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="gap-2">
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
