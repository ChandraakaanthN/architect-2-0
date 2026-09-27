"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GithubMark } from "@/components/icons/github-mark";
import { backend } from "@/lib/backend";
import { MODELS } from "@/lib/demo-data";

const DETECTED_STACK = {
  framework: "Next.js 15 (App Router)",
  language: "TypeScript",
  packageManager: "pnpm",
  details: [
    "Tailwind CSS v4 for styling",
    "Prisma + PostgreSQL for data access",
    "3 API routes and 12 pages detected",
  ],
};

function parseRepoName(url: string) {
  const cleaned = url.trim().replace(/\.git$/, "").replace(/\/+$/, "");
  const parts = cleaned.split("/");
  return parts[parts.length - 1] || "imported-project";
}

type Stage = "input" | "analyzing" | "detected" | "importing";

interface ImportGithubDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportGithubDialog({ open, onOpenChange }: ImportGithubDialogProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<Stage>("input");

  function handleOpenChange(next: boolean) {
    if (!next) {
      setUrl("");
      setStage("input");
    }
    onOpenChange(next);
  }

  function handleAnalyze() {
    if (!url.trim() || stage === "analyzing") return;
    setStage("analyzing");
    setTimeout(() => setStage("detected"), 1200);
  }

  async function handleImport() {
    setStage("importing");
    const name = parseRepoName(url);
    const project = await backend.createProject({
      name,
      description: "Imported from GitHub",
      framework: "nextjs",
      template: "blank",
      model: MODELS[0].id,
    });
    await backend.updateProject(project.id, {
      github_repo: url.trim(),
      github_connected: true,
    });
    onOpenChange(false);
    router.push(`/projects/${project.id}`);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GithubMark className="size-4" />
            Import from GitHub
          </DialogTitle>
          <DialogDescription>
            Point us at a repository and we&apos;ll analyze the stack before importing it as a project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              placeholder="https://github.com/your-org/your-repo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={stage !== "input"}
            />
          </div>

          {stage === "analyzing" && (
            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Analyzing repository structure…
            </div>
          )}

          {(stage === "detected" || stage === "importing") && (
            <div className="space-y-2.5 rounded-lg border bg-muted/40 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Detected stack
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <dt className="text-muted-foreground">Framework</dt>
                <dd className="text-right font-medium">{DETECTED_STACK.framework}</dd>
                <dt className="text-muted-foreground">Language</dt>
                <dd className="text-right font-medium">{DETECTED_STACK.language}</dd>
                <dt className="text-muted-foreground">Package manager</dt>
                <dd className="text-right font-medium">{DETECTED_STACK.packageManager}</dd>
              </dl>
              <ul className="space-y-1 border-t pt-2 text-xs text-muted-foreground">
                {DETECTED_STACK.details.map((detail) => (
                  <li key={detail} className="flex items-center gap-1.5">
                    <span className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          {stage === "input" || stage === "analyzing" ? (
            <Button onClick={handleAnalyze} disabled={!url.trim() || stage === "analyzing"} className="gap-2">
              {stage === "analyzing" && <Loader2 className="size-4 animate-spin" />}
              Analyze repository
            </Button>
          ) : (
            <Button onClick={handleImport} disabled={stage === "importing"} className="gap-2">
              {stage === "importing" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Rocket className="size-4" />
              )}
              Import project
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
