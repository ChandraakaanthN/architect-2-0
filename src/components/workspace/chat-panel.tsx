"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "@/components/workspace/message-bubble";
import type { ChatMessage } from "@/lib/types";

export function ChatPanel({
  messages,
  isBuilding,
  onSend,
}: {
  messages: ChatMessage[];
  isBuilding: boolean;
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isBuilding]);

  function submit() {
    if (!input.trim() || isBuilding) return;
    onSend(input);
    setInput("");
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isBuilding && (
          <div className="flex items-center gap-2 pl-8 text-xs text-muted-foreground">
            <Loader2Icon className="size-3 animate-spin" />
            Building your app…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t p-3">
        <div className="flex items-end gap-2 rounded-xl border bg-background p-1.5 focus-within:ring-3 focus-within:ring-ring/50">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            disabled={isBuilding}
            rows={1}
            placeholder={isBuilding ? "Waiting for the current build to finish…" : "Ask for a change…"}
            className="max-h-32 min-h-8 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
          />
          <Button size="icon-sm" disabled={isBuilding || !input.trim()} onClick={submit}>
            <ArrowUpIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
