"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckIcon, Loader2Icon, UploadCloudIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubMark } from "@/components/icons/github-mark";
import { backend } from "@/lib/backend";
import { delay } from "@/lib/delay";
import type { Project } from "@/lib/types";

interface CommitEntry {
  sha: string;
  message: string;
}

function fakeSha() {
  return Array.from({ length: 7 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
}

export function GithubPanel({ project }: { project: Project }) {
  const [repo, setRepo] = useState(project.github_repo);
  const [connected, setConnected] = useState(project.github_connected);
  const [connecting, setConnecting] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [commits, setCommits] = useState<CommitEntry[]>([]);

  async function connect() {
    setConnecting(true);
    await delay(1100);
    const repoName = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;
    await backend.updateProject(project.id, { github_connected: true, github_repo: repoName });
    setRepo(repoName);
    setConnected(true);
    setConnecting(false);
    toast.success("GitHub connected");
  }

  async function push() {
    setPushing(true);
    await delay(1300);
    setCommits((prev) => [{ sha: fakeSha(), message: "Sync from Architect: latest agent build" }, ...prev]);
    setPushing(false);
    toast.success("Pushed to GitHub");
  }

  if (!connected) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <GithubMark className="size-8" />
        <div>
          <p className="text-sm font-medium">Connect a GitHub repository</p>
          <p className="mt-1 max-w-64 text-xs text-muted-foreground">
            Every change made here can be synced to a real repo you own.
          </p>
        </div>
        <Button onClick={connect} disabled={connecting}>
          {connecting ? <Loader2Icon className="animate-spin" /> : <GithubMark />}
          {connecting ? "Connecting…" : "Connect GitHub"}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-5 p-6">
      <div className="flex items-center gap-2 rounded-lg border p-3">
        <GithubMark className="size-5 shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{repo}</p>
          <p className="text-xs text-muted-foreground">Connected · main branch</p>
        </div>
        <CheckIcon className="ml-auto size-4 shrink-0 text-emerald-500" />
      </div>

      <Button onClick={push} disabled={pushing} className="w-full">
        {pushing ? <Loader2Icon className="animate-spin" /> : <UploadCloudIcon />}
        {pushing ? "Pushing…" : "Push latest changes"}
      </Button>

      {commits.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Recent commits
          </p>
          <ul className="space-y-1.5">
            {commits.map((c) => (
              <li key={c.sha} className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs">
                <code className="text-muted-foreground">{c.sha}</code>
                <span className="truncate">{c.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
