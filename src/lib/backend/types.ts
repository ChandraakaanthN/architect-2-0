import type { ChatMessage, Deployment, DeployProvider, Project } from "@/lib/types";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
}

export interface CreateProjectInput {
  name: string;
  description?: string | null;
  framework: Project["framework"];
  template: string;
  model: string;
}

export interface Backend {
  mode: "supabase" | "local";

  getUser(): Promise<AuthUser | null>;
  signUp(email: string, password: string, fullName: string): Promise<{ error: string | null }>;
  signIn(email: string, password: string): Promise<{ error: string | null }>;
  signOut(): Promise<void>;

  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  createProject(input: CreateProjectInput): Promise<Project>;
  updateProject(id: string, patch: Partial<Project>): Promise<void>;
  deleteProject(id: string): Promise<void>;

  listMessages(projectId: string): Promise<ChatMessage[]>;
  addMessage(
    projectId: string,
    role: ChatMessage["role"],
    content: string,
    metadata?: Record<string, unknown>,
  ): Promise<ChatMessage>;

  listDeployments(projectId: string): Promise<Deployment[]>;
  createDeployment(projectId: string, provider: DeployProvider): Promise<Deployment>;
  updateDeployment(id: string, patch: Partial<Deployment>): Promise<void>;
}
