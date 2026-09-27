"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { PromptBar } from "@/components/prompt-bar";
import { backend } from "@/lib/backend";
import { TEMPLATES } from "@/lib/demo-data";
import { PENDING_PROMPT_KEY } from "@/lib/pending-prompt";

export function Hero() {
  const router = useRouter();

  async function handleGenerate(input: { prompt: string; templateId: string; modelId: string }) {
    const user = await backend.getUser();

    if (!user) {
      sessionStorage.setItem(PENDING_PROMPT_KEY, JSON.stringify(input));
      router.push("/sign-up");
      return;
    }

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

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_at_top,theme(colors.primary/12%),transparent_65%)]"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5" />
          Now with model-agnostic agents & one-click GitHub deploys
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
          Build software by <span className="text-primary">talking</span> to it.
        </h1>

        <p className="mt-5 max-w-xl text-lg text-muted-foreground text-balance">
          Prompt a full app or an autonomous agent into existence. Watch it get built in real
          time, bring your own repo, and ship it — whether you write code for a living or
          you&apos;ve never opened a terminal.
        </p>

        <PromptBar className="mt-10" onGenerate={handleGenerate} />

        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required · Import an existing GitHub repo instead →{" "}
          <a href="/sign-up" className="underline underline-offset-2">
            get started
          </a>
        </p>
      </div>
    </section>
  );
}
