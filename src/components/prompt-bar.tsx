"use client";

import { useState } from "react";
import { ArrowUp, ChevronDown, Loader2, Paperclip } from "lucide-react";
import { GithubMark } from "@/components/icons/github-mark";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MODELS, TEMPLATES } from "@/lib/demo-data";
import { TemplateIcon } from "@/lib/icon-map";

interface PromptBarProps {
  placeholder?: string;
  initialPrompt?: string;
  onGenerate: (input: { prompt: string; templateId: string; modelId: string }) => Promise<void> | void;
  onImportClick?: () => void;
  className?: string;
}

export function PromptBar({
  placeholder = "Describe the app or agent you want to build…",
  initialPrompt = "",
  onGenerate,
  onImportClick,
  className,
}: PromptBarProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [loading, setLoading] = useState(false);

  const model = MODELS.find((m) => m.id === modelId)!;

  async function handleSubmit() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      await onGenerate({ prompt: prompt.trim(), templateId, modelId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "w-full rounded-2xl border bg-card/60 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/40",
        className,
      )}
    >
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        rows={3}
        className="min-h-24 resize-none border-0 bg-transparent px-4 pt-4 text-base shadow-none focus-visible:ring-0"
      />

      <div className="flex flex-wrap items-center gap-2 border-t px-3 py-2.5">
        <div className="flex flex-1 flex-wrap gap-1.5">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplateId(t.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                templateId === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <TemplateIcon icon={t.icon} className="size-3.5" />
              {t.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {onImportClick && (
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={onImportClick}>
              <GithubMark className="size-3.5" />
              Import
            </Button>
          )}

          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" disabled>
            <Paperclip className="size-3.5" />
            Attach
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="gap-1.5">
                  {model.label}
                  <ChevronDown className="size-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-72">
              {MODELS.map((m) => (
                <DropdownMenuItem key={m.id} onClick={() => setModelId(m.id)} className="flex-col items-start gap-0.5 py-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{m.label}</span>
                    <span className="text-[10px] text-muted-foreground">{m.provider}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{m.description}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="icon" onClick={handleSubmit} disabled={!prompt.trim() || loading} className="rounded-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
