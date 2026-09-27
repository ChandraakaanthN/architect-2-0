import type { FileNode, ModelOption, PlanStep, ProjectTemplate, ToolCall } from "./types";

export const MODELS: ModelOption[] = [
  {
    id: "claude-sonnet-4.6",
    label: "Claude Sonnet 4.6",
    provider: "Anthropic",
    description: "Best default — strong coding + fast enough for iterative building.",
    contextWindow: "200K",
    speed: "balanced",
  },
  {
    id: "claude-opus-4.7",
    label: "Claude Opus 4.7",
    provider: "Anthropic",
    description: "Deepest reasoning — best for complex multi-file refactors and agent logic.",
    contextWindow: "200K",
    speed: "deepest",
  },
  {
    id: "gpt-5.1-codex",
    label: "GPT-5.1 Codex",
    provider: "OpenAI",
    description: "Strong alternative for code-heavy tasks, bring your own OpenAI key.",
    contextWindow: "128K",
    speed: "balanced",
    byokRequired: true,
  },
  {
    id: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    provider: "Google",
    description: "Large context, good for reasoning over big codebases and long docs.",
    contextWindow: "1M",
    speed: "balanced",
    byokRequired: true,
  },
  {
    id: "llama-3.1-70b",
    label: "Llama 3.1 70B",
    provider: "Open Source",
    description: "Self-hosted via your own inference endpoint — full data control.",
    contextWindow: "128K",
    speed: "fast",
    byokRequired: true,
  },
];

export const TEMPLATES: ProjectTemplate[] = [
  {
    id: "web-app",
    name: "Web App",
    description: "Full-stack app with pages, auth, and a database.",
    framework: "nextjs",
    icon: "layout-panel-left",
  },
  {
    id: "agent-langchain",
    name: "Agent — LangChain",
    description: "Tool-calling agent orchestrated with LangChain / LangGraph.",
    framework: "agent-langchain",
    icon: "workflow",
  },
  {
    id: "agent-crewai",
    name: "Agent — CrewAI",
    description: "Multi-agent crew with defined roles and a shared goal.",
    framework: "agent-crewai",
    icon: "users",
  },
  {
    id: "agent-claude-sdk",
    name: "Agent — Claude Agent SDK",
    description: "Native Claude agent with custom tools and memory.",
    framework: "agent-claude-sdk",
    icon: "bot",
  },
  {
    id: "api-backend",
    name: "API Backend",
    description: "REST/GraphQL service with a database and background jobs.",
    framework: "custom",
    icon: "server",
  },
  {
    id: "blank",
    name: "Blank",
    description: "Start from an empty repo and describe what you want as you go.",
    framework: "custom",
    icon: "file",
  },
];

export const DEMO_PROMPT =
  "Build an AI support copilot: a chat widget for our docs site that answers FAQs from our knowledge base, and escalates to a human via email when it isn't confident.";

export const DEMO_PLAN: PlanStep[] = [
  {
    id: "plan",
    title: "Plan the architecture",
    detail: "Chat widget (React) + FastAPI backend + retrieval agent + escalation tool.",
    status: "done",
  },
  {
    id: "scaffold",
    title: "Scaffold the project",
    detail: "Create Next.js app, Tailwind config, and Python agent service.",
    status: "done",
  },
  {
    id: "knowledge-base",
    title: "Wire up the knowledge base",
    detail: "Chunk docs, generate embeddings, store in a vector index.",
    status: "done",
  },
  {
    id: "agent",
    title: "Build the retrieval + escalation agent",
    detail: "LangChain agent with `search_docs` and `escalate_to_email` tools.",
    status: "active",
  },
  {
    id: "ui",
    title: "Build the chat widget UI",
    detail: "Floating widget, message list, typing indicator, escalation banner.",
    status: "pending",
  },
  {
    id: "tests",
    title: "Test the escalation path",
    detail: "Simulate a low-confidence answer and confirm the email tool fires.",
    status: "pending",
  },
];

export const DEMO_TOOL_CALLS: ToolCall[] = [
  {
    id: "tc-1",
    stepId: "scaffold",
    kind: "run_command",
    target: "npx create-next-app@latest support-widget --tailwind --ts",
    status: "success",
    durationMs: 8200,
  },
  {
    id: "tc-2",
    stepId: "scaffold",
    kind: "write_file",
    target: "agent/main.py",
    status: "success",
    durationMs: 120,
  },
  {
    id: "tc-3",
    stepId: "knowledge-base",
    kind: "install_package",
    target: "pip install langchain chromadb sentence-transformers",
    status: "success",
    durationMs: 14300,
  },
  {
    id: "tc-4",
    stepId: "knowledge-base",
    kind: "write_file",
    target: "agent/ingest.py",
    status: "success",
    durationMs: 90,
  },
  {
    id: "tc-5",
    stepId: "knowledge-base",
    kind: "run_command",
    target: "python agent/ingest.py --source ./docs",
    status: "success",
    output: "Indexed 214 chunks from 38 documents into ./vector_store",
    durationMs: 4100,
  },
  {
    id: "tc-6",
    stepId: "agent",
    kind: "write_file",
    target: "agent/tools/search_docs.py",
    status: "success",
    durationMs: 80,
  },
  {
    id: "tc-7",
    stepId: "agent",
    kind: "write_file",
    target: "agent/tools/escalate_to_email.py",
    status: "success",
    durationMs: 70,
  },
  {
    id: "tc-8",
    stepId: "agent",
    kind: "run_command",
    target: "pytest agent/tests/test_escalation.py",
    status: "error",
    output: "AssertionError: confidence threshold not read from config",
    durationMs: 1800,
  },
  {
    id: "tc-9",
    stepId: "agent",
    kind: "write_file",
    target: "agent/config.py",
    status: "success",
    durationMs: 60,
  },
  {
    id: "tc-10",
    stepId: "agent",
    kind: "run_command",
    target: "pytest agent/tests/test_escalation.py",
    status: "running",
  },
];

export const DEMO_FILES: FileNode[] = [
  {
    path: "agent/main.py",
    language: "python",
    content: `from fastapi import FastAPI
from pydantic import BaseModel
from agent.graph import build_agent

app = FastAPI(title="Support Copilot Agent")
agent = build_agent()


class AskRequest(BaseModel):
    session_id: str
    message: str


@app.post("/ask")
async def ask(req: AskRequest):
    result = await agent.ainvoke({"input": req.message, "session_id": req.session_id})
    return {
        "answer": result["answer"],
        "confidence": result["confidence"],
        "escalated": result["escalated"],
    }
`,
  },
  {
    path: "agent/tools/search_docs.py",
    language: "python",
    content: `from langchain.tools import tool
from agent.vector_store import get_retriever

retriever = get_retriever()


@tool("search_docs")
def search_docs(query: str) -> str:
    """Search the indexed knowledge base for relevant passages."""
    docs = retriever.get_relevant_documents(query, k=4)
    return "\\n\\n".join(d.page_content for d in docs)
`,
  },
  {
    path: "agent/tools/escalate_to_email.py",
    language: "python",
    content: `from langchain.tools import tool
from agent.notify import send_email
from agent.config import SUPPORT_INBOX


@tool("escalate_to_email")
def escalate_to_email(question: str, reason: str) -> str:
    """Send a low-confidence question to the human support inbox."""
    send_email(
        to=SUPPORT_INBOX,
        subject=f"Escalation: {question[:60]}",
        body=f"Reason: {reason}\\n\\nQuestion: {question}",
    )
    return "escalated"
`,
  },
  {
    path: "agent/config.py",
    language: "python",
    content: `import os

SUPPORT_INBOX = os.getenv("SUPPORT_INBOX", "support@yourcompany.com")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.62"))
`,
  },
  {
    path: "src/components/SupportWidget.tsx",
    language: "tsx",
    content: `"use client";

import { useState } from "react";

export function SupportWidget() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  async function send() {
    const next = [...messages, { role: "user", text: input }];
    setMessages(next);
    setInput("");

    const res = await fetch("/api/ask", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages([...next, { role: "assistant", text: data.answer }]);
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 rounded-xl border bg-white shadow-lg">
      <div className="border-b p-3 font-medium">Support Copilot</div>
      <div className="h-72 space-y-2 overflow-y-auto p-3 text-sm">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-md border px-2 py-1 text-sm"
          placeholder="Ask a question…"
        />
        <button onClick={send} className="rounded-md bg-black px-3 py-1 text-sm text-white">
          Send
        </button>
      </div>
    </div>
  );
}
`,
  },
];

export const DEMO_ASSISTANT_INTRO = `I'll build this as two pieces: a **retrieval agent** (LangChain) that answers from your docs, and a lightweight **chat widget** to embed on your site. When the agent's confidence drops below threshold, it calls an \`escalate_to_email\` tool instead of guessing.

Starting with the plan below — I'll stream progress as I go.`;
