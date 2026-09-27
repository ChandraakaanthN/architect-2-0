import { createClient } from "@/lib/supabase/client";
import type { ChatMessage, Deployment, DeployProvider, Project } from "@/lib/types";
import type { AuthUser, Backend, CreateProjectInput } from "./types";

// Lazy singleton: `supabaseBackend` is always imported (see ./index.ts), even
// when running in local-fallback mode without env vars configured, so the
// client must not be constructed at module load time.
let _client: ReturnType<typeof createClient> | null = null;
function supa() {
  if (!_client) _client = createClient();
  return _client;
}

export const supabaseBackend: Backend = {
  mode: "supabase",

  async getUser() {
    const {
      data: { user },
    } = await supa().auth.getUser();
    if (!user) return null;
    const authUser: AuthUser = {
      id: user.id,
      email: user.email ?? "",
      full_name: (user.user_metadata?.full_name as string) ?? null,
    };
    return authUser;
  },

  async signUp(email, password, fullName) {
    const { error } = await supa().auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error: error?.message ?? null };
  },

  async signIn(email, password) {
    const { error } = await supa().auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },

  async signOut() {
    await supa().auth.signOut();
  },

  async listProjects() {
    const { data, error } = await supa()
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data as Project[];
  },

  async getProject(id) {
    const { data, error } = await supa().from("projects").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data as Project | null;
  },

  async createProject(input: CreateProjectInput) {
    const {
      data: { user },
    } = await supa().auth.getUser();
    if (!user) throw new Error("Not signed in");

    const { data, error } = await supa()
      .from("projects")
      .insert({
        owner_id: user.id,
        name: input.name,
        description: input.description ?? null,
        framework: input.framework,
        template: input.template,
        model: input.model,
        status: "generating",
      })
      .select("*")
      .single();
    if (error) throw error;
    return data as Project;
  },

  async updateProject(id, patch) {
    const { error } = await supa().from("projects").update(patch).eq("id", id);
    if (error) throw error;
  },

  async deleteProject(id) {
    const { error } = await supa().from("projects").delete().eq("id", id);
    if (error) throw error;
  },

  async listMessages(projectId) {
    const { data, error } = await supa()
      .from("messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data as ChatMessage[];
  },

  async addMessage(projectId, role, content, metadata = {}) {
    const { data, error } = await supa()
      .from("messages")
      .insert({ project_id: projectId, role, content, metadata })
      .select("*")
      .single();
    if (error) throw error;
    return data as ChatMessage;
  },

  async listDeployments(projectId) {
    const { data, error } = await supa()
      .from("deployments")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Deployment[];
  },

  async createDeployment(projectId, provider: DeployProvider) {
    const { data, error } = await supa()
      .from("deployments")
      .insert({ project_id: projectId, provider, status: "queued" })
      .select("*")
      .single();
    if (error) throw error;
    return data as Deployment;
  },

  async updateDeployment(id, patch) {
    const { error } = await supa().from("deployments").update(patch).eq("id", id);
    if (error) throw error;
  },
};
