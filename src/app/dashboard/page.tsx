"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { PromptBar } from "@/components/prompt-bar";
import { ProjectCard } from "@/components/dashboard/project-card";
import { UserMenu } from "@/components/dashboard/user-menu";
import { ImportGithubDialog } from "@/components/dashboard/import-github-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { backend } from "@/lib/backend";
import type { AuthUser } from "@/lib/backend";
import { TEMPLATES } from "@/lib/demo-data";
import type { Project } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [importOpen, setImportOpen] = useState(false);

  const refreshProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const list = await backend.listProjects();
      setProjects(list);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const currentUser = await backend.getUser();
      if (cancelled) return;

      if (!currentUser) {
        router.replace("/sign-in");
        return;
      }

      setUser(currentUser);
      setLoadingUser(false);
      await refreshProjects();
    })();

    return () => {
      cancelled = true;
    };
  }, [router, refreshProjects]);

  async function handleGenerate(input: { prompt: string; templateId: string; modelId: string }) {
    const template = TEMPLATES.find((t) => t.id === input.templateId) ?? TEMPLATES[0];
    const project = await backend.createProject({
      name: input.prompt.slice(0, 48),
      description: input.prompt,
      framework: template.framework,
      template: template.id,
      model: input.modelId,
    });
    await backend.addMessage(project.id, "user", input.prompt);
    router.push(`/projects/${project.id}`);
  }

  if (loadingUser) {
    return (
      <div className="flex flex-1 flex-col">
        <header className="border-b">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Logo />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <UserMenu user={user} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <section>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            What do you want to build{user.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}?
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Describe an app or agent, pick a starting point, and we&apos;ll start building it.
          </p>
          <PromptBar
            className="mt-6"
            onGenerate={handleGenerate}
            onImportClick={() => setImportOpen(true)}
          />
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-medium text-muted-foreground">Your projects</h2>

          <div className="mt-4">
            {loadingProjects ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-2xl" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No projects yet — describe what you want to build above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} onChanged={refreshProjects} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <ImportGithubDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}
