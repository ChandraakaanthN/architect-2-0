export const PENDING_PROMPT_KEY = "architect2.pending_prompt";

export interface PendingPrompt {
  prompt: string;
  templateId: string;
  modelId: string;
}

export function readPendingPrompt(): PendingPrompt | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_PROMPT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingPrompt;
  } catch {
    return null;
  }
}

export function clearPendingPrompt() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_PROMPT_KEY);
}
