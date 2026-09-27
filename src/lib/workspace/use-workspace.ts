"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { backend } from "@/lib/backend";
import { delay } from "@/lib/delay";
import { DEMO_ASSISTANT_INTRO, DEMO_FILES, DEMO_PLAN, DEMO_TOOL_CALLS } from "@/lib/demo-data";
import type { ChatMessage, FileNode, PlanStep, Project, ToolCall } from "@/lib/types";

const STEP_ORDER = ["plan", "scaffold", "knowledge-base", "agent", "ui", "tests"] as const;

const UI_FILE = DEMO_FILES.find((f) => f.path === "src/components/SupportWidget.tsx")!;

/** Compresses the fixture's realistic tool durations into a snappier but still legible demo pace. */
function pace(ms = 500) {
  return Math.min(1800, Math.max(350, Math.round(ms / 8)));
}

function endStatePlan(): PlanStep[] {
  return DEMO_PLAN.map((step) => ({ ...step, status: "done" }));
}

function endStateToolCalls(): ToolCall[] {
  return DEMO_TOOL_CALLS.map((tc) => (tc.status === "running" ? { ...tc, status: "success" } : tc));
}

export interface WorkspaceState {
  loading: boolean;
  project: Project | null;
  messages: ChatMessage[];
  plan: PlanStep[];
  toolCalls: ToolCall[];
  files: FileNode[];
  activeFilePath: string | null;
  setActiveFilePath: (path: string) => void;
  previewReady: boolean;
  isBuilding: boolean;
  sendMessage: (text: string) => Promise<void>;
}

export function useWorkspace(projectId: string): WorkspaceState {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [plan, setPlan] = useState<PlanStep[]>([]);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);

  const startedRef = useRef(false);
  const cancelledRef = useRef(false);

  const appendMessage = useCallback(
    async (role: ChatMessage["role"], content: string) => {
      const message = await backend.addMessage(projectId, role, content);
      if (!cancelledRef.current) setMessages((prev) => [...prev, message]);
      return message;
    },
    [projectId],
  );

  const revealFile = useCallback((path: string) => {
    const file = DEMO_FILES.find((f) => f.path === path);
    if (!file) return;
    setFiles((prev) => (prev.some((f) => f.path === path) ? prev : [...prev, file]));
    setActiveFilePath(path);
  }, []);

  const runSimulation = useCallback(async () => {
    await appendMessage("assistant", DEMO_ASSISTANT_INTRO);

    for (const stepId of STEP_ORDER) {
      if (cancelledRef.current) return;
      const stepFixture = DEMO_PLAN.find((s) => s.id === stepId)!;

      setPlan((prev) => prev.map((s) => (s.id === stepId ? { ...s, status: "active" } : s)));
      await delay(pace(700));
      if (cancelledRef.current) return;

      const stepCalls = DEMO_TOOL_CALLS.filter((tc) => tc.stepId === stepId);
      for (const call of stepCalls) {
        if (cancelledRef.current) return;
        setToolCalls((prev) => [...prev, { ...call, status: "running" }]);
        await delay(pace(call.durationMs ?? 500));
        if (cancelledRef.current) return;

        const resolved: ToolCall = call.status === "running" ? { ...call, status: "success" } : call;
        setToolCalls((prev) => prev.map((tc) => (tc.id === call.id ? resolved : tc)));
        if (resolved.status === "success" && call.kind === "write_file") revealFile(call.target);
      }

      if (stepId === "ui") {
        revealFile(UI_FILE.path);
        setPreviewReady(true);
      }

      await delay(pace(400));
      if (cancelledRef.current) return;
      setPlan((prev) => prev.map((s) => (s.id === stepId ? { ...s, status: "done" } : s)));
      void stepFixture;
    }

    if (cancelledRef.current) return;
    await backend.updateProject(projectId, { status: "ready" });
    setProject((prev) => (prev ? { ...prev, status: "ready" } : prev));
    await appendMessage(
      "assistant",
      "All set — the support copilot is built and running in preview. Explore the generated files, or tell me what to change next.",
    );
    if (!cancelledRef.current) setIsBuilding(false);
  }, [appendMessage, projectId, revealFile]);

  useEffect(() => {
    cancelledRef.current = false;

    (async () => {
      const proj = await backend.getProject(projectId);
      if (cancelledRef.current) return;
      setProject(proj);
      const msgs = await backend.listMessages(projectId);
      if (cancelledRef.current) return;
      setMessages(msgs);
      setLoading(false);

      if (!proj) return;

      if (proj.status === "generating") {
        setPlan(DEMO_PLAN.map((s) => ({ ...s, status: "pending" })));
        if (!startedRef.current) {
          startedRef.current = true;
          setIsBuilding(true);
          void runSimulation();
        }
      } else {
        setPlan(endStatePlan());
        setToolCalls(endStateToolCalls());
        setFiles(DEMO_FILES);
        setActiveFilePath(DEMO_FILES[0]?.path ?? null);
        setPreviewReady(true);
      }
    })();

    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isBuilding) return;
      await appendMessage("user", trimmed);
      await delay(600);
      if (cancelledRef.current) return;
      await appendMessage(
        "assistant",
        "Got it — I'll factor that into the next pass on this project.",
      );
    },
    [appendMessage, isBuilding],
  );

  return {
    loading,
    project,
    messages,
    plan,
    toolCalls,
    files,
    activeFilePath,
    setActiveFilePath,
    previewReady,
    isBuilding,
    sendMessage,
  };
}
