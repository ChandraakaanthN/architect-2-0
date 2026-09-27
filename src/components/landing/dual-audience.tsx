import { Check, Terminal, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NON_TECHNICAL = [
  "Describe what you want in plain English",
  "Guided mode explains every step in plain language",
  "One-click deploy, no config screens",
  "Visual editor for text, images and layout",
];

const TECHNICAL = [
  "Full file tree, terminal, and diff view",
  "Bring your own framework, model, or repo",
  "Inspect every tool call the agent makes",
  "GitHub-native: branches, PRs, commit history",
];

export function DualAudience() {
  return (
    <section id="for-technical" className="border-t bg-muted/20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            One platform, two ways to work
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for vibe-coders and engineers alike
          </h2>
          <p className="mt-3 text-muted-foreground">
            Same agent, same project — switch views any time from the workspace toolbar.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wand2 className="size-5" />
            </div>
            <h3 className="text-lg font-semibold">Guided mode</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              For anyone with an idea and no code experience.
            </p>
            <ul className="mt-5 space-y-2.5">
              {NON_TECHNICAL.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Terminal className="size-5" />
            </div>
            <h3 className="text-lg font-semibold">Developer mode</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              For engineers who want full control over the codebase.
            </p>
            <ul className="mt-5 space-y-2.5">
              {TECHNICAL.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
