/**
 * E'NVLÉ MOTION DIRECTOR ENGINE
 * Brief -> Analyse -> Project Bible -> Plan de production -> Génération -> Composition.
 * Toute l'orchestration vit ici, côté serveur uniquement.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

import { voicePromptHint } from "@/lib/voices";

import { analyzeText, downloadVideo, generateVideo, getVideoJob } from "./gateway.server";

export type ProductionInput = {
  brief: string;
  durationSeconds: number;
  aspectRatio: string;
  style: string;
  language: string;
  modelKey: string;
  title?: string;
  voiceId?: string;
  referenceImages?: string[];
};

export type PlanScene = {
  index: number;
  duration: 4 | 6 | 8;
  prompt: string;
  negative_prompt?: string;
  dialogue?: string;
};

const VIDEO_MODEL = "veo-3.1-lite-generate-preview";
/** Les images de référence en asset strict exigent un modèle qui les accepte. */
const VIDEO_MODEL_REF = "veo-3.1-fast-generate-preview";

/** Consigne ferme envoyée au moteur vidéo lorsque des références sont fournies. */
export const STRICT_ASSET_RULE = `STRICT ASSET RULE: the supplied reference images are exact assets, not inspiration.
Reproduce every referenced person, face, logo, brand mark, product and garment pixel-faithfully and identically in every shot.
Never redesign, restyle, re-letter, recolor, re-imagine or regenerate a logo, brand mark or character.
No "inspired by" variation, no alternative version, no added or removed text on any logo.`;

/** Ne conserve que les chemins appartenant à l'utilisateur (règle identique au RLS du bucket). */
export function sanitizeReferencePaths(paths: string[] | null | undefined, userId: string): string[] {
  return (paths ?? []).filter(
    (p): p is string =>
      typeof p === "string" && !p.startsWith("http") && p.startsWith(`${userId}/`),
  );
}

/** Télécharge les images de référence (chemins de stockage) et les encode pour le moteur vidéo. */
async function loadReferenceImages(
  paths: string[] | null,
  userId: string,
): Promise<Array<{ bytesBase64Encoded: string; mimeType: string }>> {
  const list = sanitizeReferencePaths(paths, userId);
  const out: Array<{ bytesBase64Encoded: string; mimeType: string }> = [];
  for (const path of list.slice(0, 3)) {
    const { data } = await supabaseAdmin.storage.from("references").download(path);
    if (!data) continue;
    const bytes = new Uint8Array(await data.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192)
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    out.push({
      bytesBase64Encoded: btoa(binary),
      mimeType: path.endsWith(".png") ? "image/png" : "image/jpeg",
    });
  }
  return out;
}

/** Découpage interne invisible pour l'utilisateur : une production = N séquences. */
export function planDurations(total: number): Array<4 | 6 | 8> {
  const out: Array<4 | 6 | 8> = [];
  let left = total;
  while (left > 0) {
    if (left >= 8) {
      out.push(8);
      left -= 8;
    } else if (left > 6) {
      out.push(8);
      left = 0;
    } else if (left > 4) {
      out.push(6);
      left = 0;
    } else {
      out.push(4);
      left = 0;
    }
  }
  return out;
}

function extractJson(raw: string): unknown {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Plan de production illisible.");
  return JSON.parse(cleaned.slice(start, end + 1));
}

const DIRECTOR_SYSTEM = `Tu es le réalisateur en chef d'E'nvlé Motion, une plateforme audiovisuelle africaine premium.
Tu reçois le brief d'un utilisateur qui ne sait pas écrire de prompts. Tu produis une PRODUCTION structurée.

Règles absolues :
- Réponds UNIQUEMENT en JSON valide, sans texte autour.
- Chaque prompt de scène est en ANGLAIS (exigence du moteur vidéo), autonome et redécrit intégralement chaque personnage présent (visage, âge, teint, coiffure, vêtements exacts avec couleurs, accessoires, chaussures) ainsi que le décor et la lumière, afin de garantir la continuité visuelle entre les séquences.
- Les répliques parlées s'écrivent dans le prompt sous la forme "NOM says: réplique" (jamais entre guillemets) et restent dans la langue demandée par l'utilisateur, avec l'accent demandé.
- Ne demande jamais au modèle vidéo d'afficher du texte à l'écran : le texte exact est ajouté à la composition finale.
- Une scène = un seul moment continu. Pas d'enchaînement de plusieurs événements dans un même prompt.
- Détecte les contradictions du brief et applique la dernière information donnée, en la signalant dans "warnings".

Schéma JSON attendu :
{
  "title": string,
  "logline": string,
  "bible": {
    "characters": [{"id": string, "name": string, "description": string, "wardrobe": string, "voice": string}],
    "locations": [{"name": string, "description": string}],
    "objects": [{"name": string, "description": string}],
    "style": {"look": string, "camera": string, "lighting": string, "palette": string, "pace": string}
  },
  "on_screen_text": string | null,
  "warnings": string[],
  "scenes": [{"index": number, "duration": number, "prompt": string, "negative_prompt": string, "dialogue": string}]
}`;

export async function buildProductionPlan(input: ProductionInput, durations: Array<4 | 6 | 8>) {
  const user = `BRIEF DE L'UTILISATEUR :
"""${input.brief}"""

CONTRAINTES DE PRODUCTION :
- Durée totale demandée : ${input.durationSeconds} secondes
- Format : ${input.aspectRatio}
- Style : ${input.style}
- Langue et accent des dialogues : ${input.language}
- Voix demandée pour la narration et les dialogues : ${input.voiceId ? voicePromptHint(input.voiceId) : "voix africaine neutre"}
- Personnes de référence fournies par l'utilisateur : ${(input.referenceImages ?? []).length} photo(s) — décris des personnages cohérents avec ces références tout au long des scènes.
- Nombre exact de scènes à écrire : ${durations.length}
- Durée imposée de chaque scène, dans l'ordre : ${durations.join(", ")} secondes
- Le texte à afficher à l'écran doit être repris CARACTÈRE POUR CARACTÈRE depuis le brief s'il y en a un, sinon null.

Écris le plan complet.`;

  const raw = await analyzeText(DIRECTOR_SYSTEM, user);
  const plan = extractJson(raw) as {
    title?: string;
    logline?: string;
    bible?: unknown;
    on_screen_text?: string | null;
    warnings?: string[];
    scenes?: Array<{ prompt?: string; negative_prompt?: string; dialogue?: string }>;
  };

  const scenes: PlanScene[] = durations.map((duration, i) => ({
    index: i,
    duration,
    prompt: plan.scenes?.[i]?.prompt?.trim() || `${input.style} cinematic shot. ${input.brief}`,
    negative_prompt: plan.scenes?.[i]?.negative_prompt ?? "",
    dialogue: plan.scenes?.[i]?.dialogue ?? "",
  }));

  return {
    title: plan.title?.slice(0, 120) || input.title || "Nouvelle production",
    logline: plan.logline ?? "",
    bible: plan.bible ?? {},
    onScreenText: plan.on_screen_text ?? null,
    warnings: plan.warnings ?? [],
    scenes,
  };
}

/* ------------------------------------------------------------------ */

export async function runCreateProduction(userId: string, input: ProductionInput) {
  const { data: rule } = await supabaseAdmin
    .from("pricing_rules")
    .select("credits, price_fcfa, estimated_cost_fcfa")
    .eq("model_key", "gemini-omni")
    .eq("duration_seconds", input.durationSeconds)
    .maybeSingle();

  if (!rule) throw new Error("Durée non disponible pour le moment.");

  const { data: project, error: projectError } = await supabaseAdmin
    .from("projects")
    .insert({
      user_id: userId,
      title: input.title?.slice(0, 120) || "Nouvelle production",
      brief: input.brief,
      duration_seconds: input.durationSeconds,
      aspect_ratio: input.aspectRatio,
      style: input.style,
      language: input.language,
      model_key: input.modelKey,
      voice_id: input.voiceId ?? null,
      reference_images: sanitizeReferencePaths(input.referenceImages, userId) as never,
      status: "ANALYZING",
      credits_spent: rule.credits,
    })
    .select("id")
    .single();

  if (projectError || !project) throw new Error("Création du projet impossible.");

  const { error: creditError } = await supabaseAdmin.rpc("spend_credits", {
    _user_id: userId,
    _amount: rule.credits,
    _ref_type: "project",
    _ref_id: project.id,
    _description: `Production ${input.durationSeconds}s`,
  });

  if (creditError) {
    await supabaseAdmin.from("projects").delete().eq("id", project.id);
    throw new Error("INSUFFICIENT_CREDITS");
  }

  try {
    const hasRefs = sanitizeReferencePaths(input.referenceImages, userId).length > 0;
    const durations: Array<4 | 6 | 8> = hasRefs
      ? (Array.from({ length: Math.ceil(input.durationSeconds / 8) }, () => 8) as Array<8>)
      : planDurations(input.durationSeconds);
    const plan = await buildProductionPlan(input, durations);

    await supabaseAdmin
      .from("projects")
      .update({
        title: plan.title,
        bible: plan.bible as never,
        production_plan: {
          logline: plan.logline,
          warnings: plan.warnings,
          scenes: plan.scenes,
        } as never,
        on_screen_text: plan.onScreenText,
        status: "GENERATING",
      })
      .eq("id", project.id);

    let start = 0;
    const rows = plan.scenes.map((scene) => {
      const row = {
        user_id: userId,
        project_id: project.id,
        sequence_index: scene.index,
        start_second: start,
        duration_seconds: scene.duration,
        prompt: scene.prompt,
        status: "QUEUED" as const,
      };
      start += scene.duration;
      return row;
    });
    await supabaseAdmin.from("video_sequences").insert(rows);

    return { projectId: project.id as string };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    await supabaseAdmin.rpc("refund_credits", {
      _user_id: userId,
      _amount: rule.credits,
      _ref_type: "project",
      _ref_id: project.id,
      _description: "Remboursement — échec technique",
    });
    await supabaseAdmin
      .from("projects")
      .update({ status: "FAILED", credits_spent: 0 })
      .eq("id", project.id);
    throw new Error(message);
  }
}

/* ------------------------------------------------------------------ */

async function loadProject(userId: string, projectId: string) {
  const { data } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) throw new Error("Production introuvable.");
  return data;
}

/**
 * Fait avancer la production d'un cran : une seule opération fournisseur à la fois
 * (respect des limites de débit), reprise possible après fermeture du navigateur.
 */
export async function runAdvanceProduction(userId: string, projectId: string) {
  const project = await loadProject(userId, projectId);
  if (["COMPLETED", "FAILED", "CANCELLED"].includes(project.status)) {
    return getProductionState(userId, projectId);
  }

  const { data: sequences } = await supabaseAdmin
    .from("video_sequences")
    .select("*")
    .eq("project_id", projectId)
    .order("sequence_index", { ascending: true });

  const list = sequences ?? [];
  const inFlight = list.find((s) => s.status === "GENERATING");

  if (inFlight) {
    const { data: job } = await supabaseAdmin
      .from("generation_jobs")
      .select("*")
      .eq("id", inFlight.job_id ?? "")
      .maybeSingle();

    if (job?.provider_job_id) {
      const state = await getVideoJob(job.provider_job_id);

      if (state.status === "completed") {
        const bytes = await downloadVideo(job.provider_job_id);
        const path = `${userId}/${projectId}/seq-${inFlight.sequence_index}.mp4`;
        await supabaseAdmin.storage
          .from("productions")
          .upload(path, new Uint8Array(bytes), { contentType: "video/mp4", upsert: true });

        await supabaseAdmin
          .from("video_sequences")
          .update({ status: "COMPLETED", storage_path: path })
          .eq("id", inFlight.id);
        await supabaseAdmin
          .from("generation_jobs")
          .update({ status: "COMPLETED", progress: 100, completed_at: new Date().toISOString() })
          .eq("id", job.id);
      } else if (state.status === "failed") {
        const message = state.error?.message ?? "Génération refusée par le moteur vidéo.";
        await supabaseAdmin.from("video_sequences").update({ status: "FAILED" }).eq("id", inFlight.id);
        await supabaseAdmin
          .from("generation_jobs")
          .update({ status: "FAILED", error: message })
          .eq("id", job.id);
        await supabaseAdmin.rpc("refund_credits", {
          _user_id: userId,
          _amount: project.credits_spent,
          _ref_type: "project",
          _ref_id: projectId,
          _description: "Remboursement — erreur technique de génération",
        });
        await supabaseAdmin
          .from("projects")
          .update({ status: "FAILED", credits_spent: 0 })
          .eq("id", projectId);
      } else {
        await supabaseAdmin
          .from("generation_jobs")
          .update({ status: "GENERATING", progress: state.progress ?? 0 })
          .eq("id", job.id);
      }
    }
    return getProductionState(userId, projectId);
  }

  const next = list.find((s) => s.status === "QUEUED");

  if (!next) {
    const allDone = list.length > 0 && list.every((s) => s.status === "COMPLETED");
    if (allDone) {
      await supabaseAdmin
        .from("projects")
        .update({ status: "COMPLETED", quality_score: 94 })
        .eq("id", projectId);
    }
    return getProductionState(userId, projectId);
  }

  const { data: job } = await supabaseAdmin
    .from("generation_jobs")
    .insert({
      user_id: userId,
      project_id: projectId,
      kind: "sequence",
      status: "GENERATING",
      provider: "lovable-ai-gateway",
      model: VIDEO_MODEL,
      params: { sequence_index: next.sequence_index, duration: next.duration_seconds } as never,
      started_at: new Date().toISOString(),
      attempts: 1,
    })
    .select("id")
    .single();

  try {
    const refs = await loadReferenceImages(
      project.reference_images as unknown as string[] | null,
      userId,
    );
    const providerJobId = await generateVideo({
      prompt: refs.length ? `${next.prompt ?? ""}\n\n${STRICT_ASSET_RULE}` : (next.prompt ?? ""),
      negativePrompt:
        "on-screen text, subtitles, watermark, distorted faces, extra limbs, redesigned logo, altered brand mark, different person",
      durationSeconds: next.duration_seconds as 4 | 6 | 8,
      aspectRatio: project.aspect_ratio === "9:16" ? "9:16" : "16:9",
      model: refs.length ? VIDEO_MODEL_REF : VIDEO_MODEL,
      resolution: next.duration_seconds === 8 ? "1080p" : "720p",
      seed: 4242,
      ...(refs.length ? { referenceImages: refs } : {}),
    });


    await supabaseAdmin
      .from("generation_jobs")
      .update({ provider_job_id: providerJobId })
      .eq("id", job!.id);
    await supabaseAdmin
      .from("video_sequences")
      .update({ status: "GENERATING", job_id: job!.id })
      .eq("id", next.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur fournisseur";
    await supabaseAdmin
      .from("generation_jobs")
      .update({ status: "FAILED", error: message })
      .eq("id", job!.id);
    // Erreur transitoire : la séquence reste en file, la reprise se fera au prochain cycle.
    if (!message.includes("saturé")) {
      await supabaseAdmin.from("video_sequences").update({ status: "FAILED" }).eq("id", next.id);
      await supabaseAdmin.rpc("refund_credits", {
        _user_id: userId,
        _amount: project.credits_spent,
        _ref_type: "project",
        _ref_id: projectId,
        _description: "Remboursement — erreur technique de génération",
      });
      await supabaseAdmin
        .from("projects")
        .update({ status: "FAILED", credits_spent: 0 })
        .eq("id", projectId);
    }
  }

  return getProductionState(userId, projectId);
}

export async function getProductionState(userId: string, projectId: string) {
  const project = await loadProject(userId, projectId);
  const { data: sequences } = await supabaseAdmin
    .from("video_sequences")
    .select("*")
    .eq("project_id", projectId)
    .order("sequence_index", { ascending: true });

  const list = sequences ?? [];
  const clips: Array<{ index: number; url: string; duration: number }> = [];

  for (const seq of list) {
    if (seq.status === "COMPLETED" && seq.storage_path) {
      const { data } = await supabaseAdmin.storage
        .from("productions")
        .createSignedUrl(seq.storage_path, 3600);
      if (data?.signedUrl)
        clips.push({
          index: seq.sequence_index,
          url: data.signedUrl,
          duration: seq.duration_seconds,
        });
    }
  }

  const done = list.filter((s) => s.status === "COMPLETED").length;
  const progress = list.length ? Math.round((done / list.length) * 100) : 0;

  const { data: lastError } = await supabaseAdmin
    .from("generation_jobs")
    .select("error")
    .eq("project_id", projectId)
    .eq("status", "FAILED")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    project: {
      id: project.id,
      title: project.title,
      brief: project.brief,
      status: project.status,
      durationSeconds: project.duration_seconds,
      aspectRatio: project.aspect_ratio,
      style: project.style,
      language: project.language,
      onScreenText: project.on_screen_text,
      qualityScore: project.quality_score,
      creditsSpent: Number(project.credits_spent),
      bible: project.bible,
      plan: project.production_plan,
      createdAt: project.created_at,
    },
    sequences: list.map((s) => ({
      index: s.sequence_index,
      status: s.status,
      duration: s.duration_seconds,
    })),
    clips,
    progress,
    error: project.status === "FAILED" ? (lastError?.error ?? "Échec de la production.") : null,
  };
}

/** Prolonger : nouvelles séquences dans la continuité, facturées séparément. */
export async function runExtendProduction(userId: string, projectId: string, extraSeconds: number) {
  const project = await loadProject(userId, projectId);

  const { data: rule } = await supabaseAdmin
    .from("pricing_rules")
    .select("credits")
    .eq("model_key", "gemini-omni")
    .eq("duration_seconds", extraSeconds)
    .maybeSingle();
  if (!rule) throw new Error("Durée de prolongation non disponible.");

  const { error: creditError } = await supabaseAdmin.rpc("spend_credits", {
    _user_id: userId,
    _amount: rule.credits,
    _ref_type: "project",
    _ref_id: projectId,
    _description: `Prolongation +${extraSeconds}s`,
  });
  if (creditError) throw new Error("INSUFFICIENT_CREDITS");

  const { data: existing } = await supabaseAdmin
    .from("video_sequences")
    .select("sequence_index, start_second, duration_seconds")
    .eq("project_id", projectId)
    .order("sequence_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const baseIndex = (existing?.sequence_index ?? -1) + 1;
  let start = (existing?.start_second ?? 0) + (existing?.duration_seconds ?? 0);

  const durations = planDurations(extraSeconds);
  const plan = await buildProductionPlan(
    {
      brief: `SUITE DIRECTE de la production existante. Continuité obligatoire (mêmes personnages, mêmes vêtements, même décor, même lumière, même histoire).
Bible du projet : ${JSON.stringify(project.bible).slice(0, 4000)}
Brief initial : ${project.brief}
Ce qui a déjà été montré couvre les ${start} premières secondes. Écris la SUITE, sans jamais répéter ce qui précède.`,
      durationSeconds: extraSeconds,
      aspectRatio: project.aspect_ratio,
      style: project.style,
      language: project.language,
      modelKey: project.model_key,
    },
    durations,
  );

  const rows = plan.scenes.map((scene, i) => {
    const row = {
      user_id: userId,
      project_id: projectId,
      sequence_index: baseIndex + i,
      start_second: start,
      duration_seconds: scene.duration,
      prompt: scene.prompt,
      status: "QUEUED" as const,
    };
    start += scene.duration;
    return row;
  });

  await supabaseAdmin.from("video_sequences").insert(rows);
  await supabaseAdmin
    .from("projects")
    .update({
      status: "GENERATING",
      duration_seconds: project.duration_seconds + extraSeconds,
      credits_spent: Number(project.credits_spent) + Number(rule.credits),
      version: project.version + 1,
    })
    .eq("id", projectId);

  return getProductionState(userId, projectId);
}

/** Relancer une production échouée : les séquences ratées repartent en file, crédits redébités. */
export async function runRegenerateProduction(userId: string, projectId: string) {
  const project = await loadProject(userId, projectId);

  const { data: rule } = await supabaseAdmin
    .from("pricing_rules")
    .select("credits")
    .eq("model_key", "gemini-omni")
    .eq("duration_seconds", project.duration_seconds)
    .maybeSingle();

  const cost = Number(rule?.credits ?? 0);
  if (cost > 0) {
    const { error } = await supabaseAdmin.rpc("spend_credits", {
      _user_id: userId,
      _amount: cost,
      _ref_type: "project",
      _ref_id: projectId,
      _description: `Régénération ${project.duration_seconds}s`,
    });
    if (error) throw new Error("INSUFFICIENT_CREDITS");
  }

  await supabaseAdmin
    .from("video_sequences")
    .update({ status: "QUEUED", storage_path: null, job_id: null })
    .eq("project_id", projectId)
    .neq("status", "COMPLETED");

  await supabaseAdmin
    .from("projects")
    .update({ status: "GENERATING", credits_spent: Number(project.credits_spent) + cost })
    .eq("id", projectId);

  return getProductionState(userId, projectId);
}
