"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckIcon, Loader2Icon, RocketIcon, TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { backend } from "@/lib/backend";
import { delay } from "@/lib/delay";
import type { Deployment, DeploymentStatus, Project } from "@/lib/types";

const STAGES: DeploymentStatus[] = ["queued", "building", "deploying", "live"];
const STAGE_LABEL: Record<DeploymentStatus, string> = {
  queued: "Queued",
  building: "Building",
  deploying: "Deploying",
  live: "Live",
  failed: "Failed",
};

function fakeUrl(project: Project) {
  const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "app";
  return `${slug}-${project.id.slice(0, 6)}.architect2.app`;
}

export function DeployPanel({ project }: { project: Project }) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    backend.listDeployments(project.id).then(setDeployments);
  }, [project.id]);

  async function deploy() {
    setDeploying(true);
    const deployment = await backend.createDeployment(project.id, "vercel");
    setDeployments((prev) => [deployment, ...prev]);

    for (const stage of STAGES.slice(1)) {
      await delay(1100);
      await backend.updateDeployment(deployment.id, { status: stage });
      setDeployments((prev) => prev.map((d) => (d.id === deployment.id ? { ...d, status: stage } : d)));
    }

    const url = fakeUrl(project);
    await backend.updateDeployment(deployment.id, { url });
    await backend.updateProject(project.id, { last_deployment_url: url });
    setDeployments((prev) => prev.map((d) => (d.id === deployment.id ? { ...d, url } : d)));
    setDeploying(false);
    toast.success("Deployment is live");
  }

  const latest = deployments[0];

  return (
    <div className="mx-auto max-w-md space-y-5 p-6">
      <div className="rounded-lg border p-4 text-center">
        {latest?.status === "live" ? (
          <>
            <CheckIcon className="mx-auto size-6 text-emerald-500" />
            <p className="mt-2 text-sm font-medium">Live</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{latest.url}</p>
          </>
        ) : (
          <>
            <RocketIcon className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Not deployed yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ship this project to a preview URL in under a minute.
            </p>
          </>
        )}
      </div>

      <Button onClick={deploy} disabled={deploying} className="w-full">
        {deploying ? <Loader2Icon className="animate-spin" /> : <RocketIcon />}
        {deploying ? STAGE_LABEL[latest?.status ?? "queued"] + "…" : "Deploy"}
      </Button>

      {deployments.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Deployment history
          </p>
          <ul className="space-y-1.5">
            {deployments.map((d) => (
              <li key={d.id} className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs">
                {d.status === "failed" ? (
                  <TriangleAlertIcon className="size-3.5 text-destructive" />
                ) : d.status === "live" ? (
                  <span className="size-2 rounded-full bg-emerald-500" />
                ) : (
                  <Loader2Icon className="size-3.5 animate-spin text-sky-500" />
                )}
                <Badge variant="outline" className="shrink-0">
                  {STAGE_LABEL[d.status]}
                </Badge>
                <span className="truncate font-mono text-muted-foreground">{d.url ?? d.provider}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
