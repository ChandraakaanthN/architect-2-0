export type Framework =
  | "nextjs"
  | "agent-langchain"
  | "agent-crewai"
  | "agent-claude-sdk"
  | "custom";

export type ProjectStatus = "generating" | "ready" | "error";

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  framework: Framework;
  template: string;
  status: ProjectStatus;
  model: string;
  github_repo: string | null;
  github_connected: boolean;
  last_deployment_url: string | null;
  created_at: string;
  updated_at: string;
}

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  project_id: string;
  role: MessageRole;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type DeploymentStatus = "queued" | "building" | "deploying" | "live" | "failed";
export type DeployProvider = "vercel" | "netlify" | "fly";

export interface Deployment {
  id: string;
  project_id: string;
  provider: DeployProvider;
  status: DeploymentStatus;
  url: string | null;
  created_at: string;
}

export type PlanStepStatus = "pending" | "active" | "done" | "error";

export interface PlanStep {
  id: string;
  title: string;
  detail: string;
  status: PlanStepStatus;
}

export type ToolCallKind = "read_file" | "write_file" | "run_command" | "install_package" | "search";

export interface ToolCall {
  id: string;
  stepId: string;
  kind: ToolCallKind;
  target: string;
  status: "running" | "success" | "error";
  output?: string;
  durationMs?: number;
}

export interface FileNode {
  path: string;
  language: string;
  content: string;
}

export interface ModelOption {
  id: string;
  label: string;
  provider: "Anthropic" | "OpenAI" | "Google" | "Open Source";
  description: string;
  contextWindow: string;
  speed: "fast" | "balanced" | "deepest";
  byokRequired?: boolean;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  framework: Framework;
  icon: string;
}
