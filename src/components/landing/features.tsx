import { Bot, Boxes, MonitorSmartphone, Rocket, ScanSearch } from "lucide-react";
import { GithubMark } from "@/components/icons/github-mark";

const FEATURES = [
  {
    icon: Boxes,
    title: "Any framework",
    description: "Next.js web apps, LangChain / CrewAI / Claude Agent SDK agents, or a custom stack.",
  },
  {
    icon: Bot,
    title: "Model-agnostic",
    description: "Switch between Claude, GPT, Gemini, or your own self-hosted model — mid-project, no rewrites.",
  },
  {
    icon: MonitorSmartphone,
    title: "Live preview",
    description: "See your app update in real time in a sandboxed preview, on desktop and mobile.",
  },
  {
    icon: GithubMark,
    title: "GitHub native",
    description: "Import a repo, keep committing to real branches, and open PRs straight from the chat.",
  },
  {
    icon: ScanSearch,
    title: "Full transparency",
    description: "Every file read, file write, and command the agent runs is inspectable, not a black box.",
  },
  {
    icon: Rocket,
    title: "One-click deploy",
    description: "Ship to Vercel, Netlify, or Fly with a single click, with real deployment history.",
  },
];

export function Features() {
  return (
    <section id="product" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to go from idea to shipped
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-card p-6">
              <f.icon className="mb-3 size-5 text-primary" />
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
