import type { ChatMessage, Deployment, DeployProvider, Project } from "@/lib/types";
import type { AuthUser, Backend, CreateProjectInput } from "./types";

const KEYS = {
  user: "architect2.user",
  projects: "architect2.projects",
  messages: "architect2.messages",
  deployments: "architect2.deployments",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/**
 * Local, browser-only fallback so every flow in the app is fully clickable
 * even before a Supabase project is wired up. Mirrors the Backend interface
 * exactly, so pages don't know or care which one they're talking to.
 */
export const localBackend: Backend = {
  mode: "local",

  async getUser() {
    return read<AuthUser | null>(KEYS.user, null);
  },

  async signUp(email, _password, fullName) {
    const user: AuthUser = { id: uid(), email, full_name: fullName || null };
    write(KEYS.user, user);
    return { error: null };
  },

  async signIn(email, _password) {
    const existing = read<AuthUser | null>(KEYS.user, null);
    const user: AuthUser = existing?.email === email ? existing : { id: uid(), email, full_name: null };
    write(KEYS.user, user);
    return { error: null };
  },

  async signOut() {
    write(KEYS.user, null);
  },

  async listProjects() {
    const user = read<AuthUser | null>(KEYS.user, null);
    const all = read<Project[]>(KEYS.projects, []);
    return all
      .filter((p) => p.owner_id === user?.id)
      .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
  },

  async getProject(id) {
    const all = read<Project[]>(KEYS.projects, []);
    return all.find((p) => p.id === id) ?? null;
  },

  async createProject(input: CreateProjectInput) {
    const user = read<AuthUser | null>(KEYS.user, null);
    const now = new Date().toISOString();
    const project: Project = {
      id: uid(),
      owner_id: user?.id ?? "anonymous",
      name: input.name,
      description: input.description ?? null,
      framework: input.framework,
      template: input.template,
      status: "generating",
      model: input.model,
      github_repo: null,
      github_connected: false,
      last_deployment_url: null,
      created_at: now,
      updated_at: now,
    };
    const all = read<Project[]>(KEYS.projects, []);
    write(KEYS.projects, [project, ...all]);
    return project;
  },

  async updateProject(id, patch) {
    const all = read<Project[]>(KEYS.projects, []);
    const next = all.map((p) =>
      p.id === id ? { ...p, ...patch, updated_at: new Date().toISOString() } : p,
    );
    write(KEYS.projects, next);
  },

  async deleteProject(id) {
    const all = read<Project[]>(KEYS.projects, []);
    write(
      KEYS.projects,
      all.filter((p) => p.id !== id),
    );
  },

  async listMessages(projectId) {
    const all = read<ChatMessage[]>(KEYS.messages, []);
    return all
      .filter((m) => m.project_id === projectId)
      .sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
  },

  async addMessage(projectId, role, content, metadata = {}) {
    const message: ChatMessage = {
      id: uid(),
      project_id: projectId,
      role,
      content,
      metadata,
      created_at: new Date().toISOString(),
    };
    const all = read<ChatMessage[]>(KEYS.messages, []);
    write(KEYS.messages, [...all, message]);
    return message;
  },

  async listDeployments(projectId) {
    const all = read<Deployment[]>(KEYS.deployments, []);
    return all
      .filter((d) => d.project_id === projectId)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  },

  async createDeployment(projectId, provider: DeployProvider) {
    const deployment: Deployment = {
      id: uid(),
      project_id: projectId,
      provider,
      status: "queued",
      url: null,
      created_at: new Date().toISOString(),
    };
    const all = read<Deployment[]>(KEYS.deployments, []);
    write(KEYS.deployments, [deployment, ...all]);
    return deployment;
  },

  async updateDeployment(id, patch) {
    const all = read<Deployment[]>(KEYS.deployments, []);
    write(
      KEYS.deployments,
      all.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    );
  },
};
