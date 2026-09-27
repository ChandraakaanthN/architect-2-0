"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MODELS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import type { ModelOption } from "@/lib/types";

const DEFAULT_MODEL_KEY = "architect2.default_model";
const BYOK_KEYS_KEY = "architect2.byok_keys";

const SPEED_LABEL: Record<ModelOption["speed"], string> = {
  fast: "Fast",
  balanced: "Balanced",
  deepest: "Deepest reasoning",
};

function readStoredModel(): string {
  if (typeof window === "undefined") return MODELS[0].id;
  return window.localStorage.getItem(DEFAULT_MODEL_KEY) ?? MODELS[0].id;
}

function readStoredByokKeys(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const stored = window.localStorage.getItem(BYOK_KEYS_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored) as Record<string, string>;
  } catch {
    return {};
  }
}

export function ModelsSection() {
  const [defaultModel, setDefaultModel] = useState<string>(readStoredModel);
  const [byokKeys, setByokKeys] = useState<Record<string, string>>(readStoredByokKeys);

  useEffect(() => {
    window.localStorage.setItem(DEFAULT_MODEL_KEY, defaultModel);
  }, [defaultModel]);

  function handleSelect(model: ModelOption) {
    setDefaultModel(model.id);
    toast.success(`Default model set to ${model.label}`);
  }

  function handleKeyChange(id: string, value: string) {
    const next = { ...byokKeys, [id]: value };
    setByokKeys(next);
    window.localStorage.setItem(BYOK_KEYS_KEY, JSON.stringify(next));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Models &amp; AI</CardTitle>
          <CardDescription>
            Architect is model-agnostic — every project can use a different model, and you can switch
            mid-conversation from the chat toolbar. Pick a default below for new projects.
          </CardDescription>
        </CardHeader>
      </Card>

      <div role="radiogroup" aria-label="Default model" className="grid gap-3 sm:grid-cols-2">
        {MODELS.map((model) => {
          const active = model.id === defaultModel;
          return (
            <div
              key={model.id}
              role="radio"
              aria-checked={active}
              tabIndex={0}
              onClick={() => handleSelect(model)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleSelect(model);
                }
              }}
              className={cn(
                "flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                active ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:bg-muted/40",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 font-medium">
                    {model.label}
                    {model.byokRequired && <Key className="size-3.5 text-muted-foreground" />}
                  </div>
                  <div className="text-xs text-muted-foreground">{model.provider}</div>
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

              <p className="text-sm text-muted-foreground">{model.description}</p>

              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="outline">{model.contextWindow} context</Badge>
                <Badge variant="secondary">{SPEED_LABEL[model.speed]}</Badge>
              </div>

              {model.byokRequired && (
                <div
                  className="mt-1 space-y-1.5 border-t pt-3"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <Label htmlFor={`byok-${model.id}`} className="text-xs font-normal text-muted-foreground">
                    Bring your own API key — required to use {model.label}.
                  </Label>
                  <Input
                    id={`byok-${model.id}`}
                    type="password"
                    autoComplete="off"
                    placeholder="sk-••••••••••••••••"
                    value={byokKeys[model.id] ?? ""}
                    onChange={(event) => handleKeyChange(model.id, event.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
