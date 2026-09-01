import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listCharacters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("characters")
      .select("id, name, description, apparent_age, gender, created_at")
      .order("created_at", { ascending: false });
    return (data ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      apparentAge: c.apparent_age,
      gender: c.gender,
      createdAt: c.created_at,
    }));
  });

export const saveCharacter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    id?: string;
    name: string;
    description: string;
    apparentAge: string;
    gender: string;
  }) => {
    if (!input.name.trim()) throw new Error("Le nom du personnage est obligatoire.");
    return input;
  })
  .handler(async ({ data, context }) => {
    const payload = {
      name: data.name.trim(),
      description: data.description,
      apparent_age: data.apparentAge,
      gender: data.gender,
    };
    if (data.id) {
      const { error } = await context.supabase
        .from("characters")
        .update(payload)
        .eq("id", data.id);
      if (error) throw new Error("Enregistrement impossible.");
      return { id: data.id };
    }
    const { data: created, error } = await context.supabase
      .from("characters")
      .insert({ ...payload, user_id: context.userId })
      .select("id")
      .single();
    if (error || !created) throw new Error("Création impossible.");
    return { id: created.id };
  });

export const deleteCharacter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("characters").delete().eq("id", data.id);
    if (error) throw new Error("Suppression impossible.");
    return { ok: true };
  });
