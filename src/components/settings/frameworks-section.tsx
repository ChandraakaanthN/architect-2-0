"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bot, Check, Users, Workflow, Wrench } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Framework } from "@/lib/types";

const DEFAULT_FRAMEWORK_KEY = "architect2.default_framework";

interface FrameworkOption {
  id: Framework;
  name: string;
  description: string;
  icon: typeof Bot;
}

const FRAMEWORKS: FrameworkOption[] = [
  {
    id: "agent-langchain",
    name: "LangChain",
    description: "Best for tool-calling agents with chains, memory, and retrieval — the most mature ecosystem.",
    icon: Workflow,
  },
  {
    id: "agent-crewai",
    name: "CrewAI",
    description: "Best for multi-agent crews with defined roles collaborating toward a shared goal.",
    icon: Users,
  },
  {
    id: "agent-claude-sdk",
    name: "Claude Agent SDK",
    description: "Best for native Claude agents with custom tools, memory, and fine-grained control.",
    icon: Bot,
  },
  {
    id: "custom",
    name: "Custom / bring your own",
    description: "Best when you already have an agent framework or runtime you want to wire in yourself.",
    icon: Wrench,
  },
];

function readStoredFramework(): Framework {
  if (typeof window === "undefined") return "agent-langchain";
  return (window.localStorage.getItem(DEFAULT_FRAMEWORK_KEY) as Framework | null) ?? "agent-langchain";
}

export function FrameworksSection() {
  const [defaultFramework, setDefaultFramework] = useState<Framework>(readStoredFramework);

  useEffect(() => {
    window.localStorage.setItem(DEFAULT_FRAMEWORK_KEY, defaultFramework);
  }, [defaultFramework]);

  function handleSelect(framework: FrameworkOption) {
    setDefaultFramework(framework.id);
    toast.success(`${framework.name} set as default for new agent projects`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent frameworks</CardTitle>
          <CardDescription>
            Choose the default agent framework used when you create a new agent-type project. You can still
            override this per project.
          </CardDescription>
        </CardHeader>
      </Card>

      <div role="radiogroup" aria-label="Default agent framework" className="grid gap-3 sm:grid-cols-2">
        {FRAMEWORKS.map((framework) => {
          const active = framework.id === defaultFramework;
          const Icon = framework.icon;
          return (
            <div
              key={framework.id}
              role="radio"
              aria-checked={active}
              tabIndex={0}
              onClick={() => handleSelect(framework)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleSelect(framework);
                }
              }}
              className={cn(
                "flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                active ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:bg-muted/40",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4" />
                  </span>
                  {framework.name}
                </div>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full",
                    active ? "bg-primary text-primary-foreground" : "border border-border",
                  )}
                >
                  {active && <Check className="size-3.5" />}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">{framework.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
