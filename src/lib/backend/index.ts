import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { localBackend } from "./local";
import { supabaseBackend } from "./supabase";
import type { Backend } from "./types";

export const backend: Backend = isSupabaseConfigured ? supabaseBackend : localBackend;

export type { AuthUser, CreateProjectInput, Backend } from "./types";
