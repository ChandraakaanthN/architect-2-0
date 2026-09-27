"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkspaceTopbar } from "@/components/workspace/topbar";
import { ChatPanel } from "@/components/workspace/chat-panel";
import { AgentPanel } from "@/components/workspace/agent-panel";
import { PlanTimeline } from "@/components/workspace/plan-timeline";
import { CodePanel } from "@/components/workspace/code-panel";
import { PreviewPanel } from "@/components/workspace/preview-panel";
import { GithubPanel } from "@/components/workspace/github-panel";
import { DeployPanel } from "@/components/workspace/deploy-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { backend } from "@/lib/backend";
import { useWorkspace } from "@/lib/workspace/use-workspace";

export default function ProjectWorkspacePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = params.id;
  const [mode, setMode] = useState<"guided" | "developer">("guided");
  const workspace = useWorkspace(projectId);

  useEffect(() => {
    backend.getUser().then((user) => {
      if (!user) router.replace(`/sign-in?next=/projects/${projectId}`);
    });
  }, [projectId, router]);

  if (workspace.loading) {
    return (
      <div className="flex h-dvh flex-col">
        <div className="flex h-12 shrink-0 items-center border-b px-3">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid flex-1 grid-cols-[360px_1fr]">
          <Skeleton className="m-3 rounded-xl" />
          <Skeleton className="m-3 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!workspace.project) {
    return (
      <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
        Project not found.
      </div>
    );
  }

  const { project } = workspace;

  return (
    <div className="flex h-dvh flex-col">
      <WorkspaceTopbar project={project} isBuilding={workspace.isBuilding} mode={mode} onModeChange={setMode} />

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[380px_1fr]">
        <div className="min-h-0 border-b md:border-r md:border-b-0">
          <ChatPanel
            messages={workspace.messages}
            isBuilding={workspace.isBuilding}
            onSend={workspace.sendMessage}
          />
        </div>

        <div className="min-h-0">
          <Tabs defaultValue="preview" className="flex h-full min-h-0 flex-col gap-0">
            <TabsList className="mx-3 mt-2 w-fit">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              {mode === "guided" ? (
                <TabsTrigger value="progress">Progress</TabsTrigger>
              ) : (
                <>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="agent">Agent</TabsTrigger>
                </>
              )}
              <TabsTrigger value="github">GitHub</TabsTrigger>
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="min-h-0 flex-1">
              <PreviewPanel ready={workspace.previewReady} />
            </TabsContent>

            {mode === "guided" ? (
              <TabsContent value="progress" className="min-h-0 flex-1 overflow-y-auto p-4">
                <PlanTimeline steps={workspace.plan} />
              </TabsContent>
            ) : (
              <>
                <TabsContent value="code" className="min-h-0 flex-1">
                  <CodePanel
                    files={workspace.files}
                    activePath={workspace.activeFilePath}
                    onSelectPath={workspace.setActiveFilePath}
                  />
                </TabsContent>
                <TabsContent value="agent" className="min-h-0 flex-1">
                  <AgentPanel plan={workspace.plan} toolCalls={workspace.toolCalls} />
                </TabsContent>
              </>
            )}

            <TabsContent value="github" className="min-h-0 flex-1 overflow-y-auto">
              <GithubPanel project={project} />
            </TabsContent>
            <TabsContent value="deploy" className="min-h-0 flex-1 overflow-y-auto">
              <DeployPanel project={project} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
