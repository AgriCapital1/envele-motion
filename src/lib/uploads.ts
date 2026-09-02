import { supabase } from "@/integrations/supabase/client";

const BUCKET = "references";

/** Envoie une image de référence dans l'espace privé de l'utilisateur et renvoie une URL affichable. */
export async function uploadReferenceImage(file: File): Promise<{ path: string; url: string }> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("Session expirée, reconnectez-vous.");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error("Envoi de l'image impossible.");

  return { path, url: await signedUrl(path) };
}

export async function signedUrl(path: string): Promise<string> {
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? "";
}

export async function removeReferenceImage(path: string): Promise<void> {
  await supabase.storage.from(BUCKET).remove([path]);
}
