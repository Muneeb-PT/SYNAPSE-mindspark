import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export function useProfile(userId?: string) {
  const { user } = useAuth();
  const id = userId || user?.id;

  return useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Record<string, unknown>) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Profile updated!");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSkills(userId?: string) {
  const { user } = useAuth();
  const id = userId || user?.id;

  return useQuery({
    queryKey: ["skills", id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", id)
        .order("created_at");
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });
}

export function useAddSkill() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, level }: { name: string; level: number }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("skills")
        .insert({ user_id: user.id, name, level });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["skills", user?.id] });
      toast.success("Skill added!");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteSkill() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (skillId: string) => {
      const { error } = await supabase.from("skills").delete().eq("id", skillId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["skills", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useEducation(userId?: string) {
  const { user } = useAuth();
  const id = userId || user?.id;

  return useQuery({
    queryKey: ["education", id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .eq("user_id", id)
        .order("start_year", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });
}

export function useAddEducation() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (edu: { institution: string; degree: string; field: string; start_year: number; end_year?: number; current?: boolean; grade?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("education")
        .insert({ user_id: user.id, ...edu });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["education", user?.id] });
      toast.success("Education added!");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteEducation() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("education").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["education", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useExperience(userId?: string) {
  const { user } = useAuth();
  const id = userId || user?.id;

  return useQuery({
    queryKey: ["experience", id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });
}

export function useAddExperience() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (exp: { company: string; title: string; type: string; start_date: string; end_date?: string; current?: boolean; description?: string; skills?: string[] }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("experience")
        .insert({ user_id: user.id, ...exp });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["experience", user?.id] });
      toast.success("Experience added!");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteExperience() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experience").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["experience", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCertifications(userId?: string) {
  const { user } = useAuth();
  const id = userId || user?.id;

  return useQuery({
    queryKey: ["certifications", id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });
}

export function useAddCertification() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (cert: { name: string; issuer: string; date: string; credential_url?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("certifications")
        .insert({ user_id: user.id, ...cert });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["certifications", user?.id] });
      toast.success("Certification added!");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteCertification() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("certifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["certifications", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
