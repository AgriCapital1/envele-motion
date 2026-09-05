/**
 * Adaptateur fournisseur IA — Google Gemini / Veo (API officielle).
 * La clé GEMINI_API_KEY reste strictement côté serveur : elle n'est jamais
 * renvoyée au navigateur, jamais journalisée, jamais placée dans une URL de réponse.
 */

const BASE = "https://generativelanguage.googleapis.com/v1beta";
const TEXT_MODEL = "gemini-flash-latest";

function apiKey(): string {
  const key = process.env["GEMINI_API_KEY"];
  if (!key) throw new Error("Configuration manquante : clé du moteur IA absente.");
  return key;
}

function authHeaders(): Record<string, string> {
  return { "x-goog-api-key": apiKey(), "Content-Type": "application/json" };
}

export type GatewayError = Error & { status?: number; retryable?: boolean };

function fail(status: number, message: string): GatewayError {
  const err = new Error(message) as GatewayError;
  err.status = status;
  err.retryable = status === 429 || status >= 500;
  return err;
}

/** Traduit une erreur Google en message utilisateur, sans jamais exposer la clé. */
function providerError(status: number, body: string, context: string): GatewayError {
  const safe = body.replace(/AIza[0-9A-Za-z_-]+/g, "***").slice(0, 300);
  if (status === 429)
    return fail(
      429,
      "Génération IA indisponible : le quota Google de ce projet est épuisé (la facturation Veo doit être activée sur la clé).",
    );
  if (status === 403)
    return fail(403, "Génération IA indisponible : la clé Google n'a pas accès à ce modèle vidéo.");
  return fail(status, `${context} : ${safe}`);
}

/** Nom de modèle Google à partir d'une clé interne. */
function videoModelName(model: string): string {
  const short = model.replace(/^google\//, "");
  if (short.endsWith("-generate-preview")) return short;
  if (short.startsWith("veo-3.1-fast")) return "veo-3.1-fast-generate-preview";
  if (short.startsWith("veo-3.1-lite")) return "veo-3.1-lite-generate-preview";
  return "veo-3.1-generate-preview";
}

/** Analyse / raisonnement textuel (Brief Analyzer, Director Engine). */
export async function analyzeText(system: string, user: string): Promise<string> {
  const res = await fetch(`${BASE}/models/${TEXT_MODEL}:generateContent`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  if (!res.ok) throw providerError(res.status, await res.text(), "Analyse du brief impossible");

  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
}

export type InlineImage = { bytesBase64Encoded: string; mimeType: string };

export type VideoRequest = {
  prompt: string;
  negativePrompt?: string;
  durationSeconds: 4 | 6 | 8;
  aspectRatio: "16:9" | "9:16";
  model: string;
  resolution?: "720p" | "1080p";
  seed?: number;
  /** Images de référence utilisées en ASSET STRICT (jamais « inspiré de »). */
  referenceImages?: InlineImage[];
};

/** Lance une génération vidéo (opération asynchrone Google). Renvoie le nom de l'opération. */
export async function generateVideo(req: VideoRequest): Promise<string> {
  const refs = (req.referenceImages ?? []).slice(0, 3);
  const parameters: Record<string, unknown> = {
    durationSeconds: refs.length ? 8 : req.durationSeconds,
    resolution: req.resolution ?? "720p",
    sampleCount: 1,
  };
  // Avec des références, le modèle déduit le cadrage : pas d'aspectRatio explicite.
  if (!refs.length) parameters["aspectRatio"] = req.aspectRatio;
  if (req.negativePrompt) parameters["negativePrompt"] = req.negativePrompt;
  if (req.seed !== undefined) parameters["seed"] = req.seed;

  const instance: Record<string, unknown> = { prompt: req.prompt };
  if (refs.length) {
    instance["referenceImages"] = refs.map((image) => ({ image, referenceType: "asset" }));
  }

  const model = videoModelName(req.model);
  const res = await fetch(`${BASE}/models/${model}:predictLongRunning`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ instances: [instance], parameters }),
  });

  if (!res.ok) throw providerError(res.status, await res.text(), "Génération vidéo refusée");

  const op = (await res.json()) as { name?: string };
  if (!op.name) throw fail(500, "Le moteur vidéo n'a pas renvoyé d'identifiant de production.");
  return op.name;
}

export type VideoJobState = {
  status: "in_progress" | "queued" | "completed" | "failed" | string;
  progress?: number;
  error?: { code?: string; message?: string };
};

type Operation = {
  done?: boolean;
  error?: { code?: number; message?: string };
  metadata?: { progressPercent?: number };
  response?: {
    generateVideoResponse?: {
      generatedSamples?: Array<{ video?: { uri?: string } }>;
      raiMediaFilteredReasons?: string[];
    };
    videos?: Array<{ uri?: string; video?: { uri?: string } }>;
  };
};

async function fetchOperation(name: string): Promise<Operation> {
  const res = await fetch(`${BASE}/${name}`, { headers: authHeaders() });
  if (!res.ok) throw providerError(res.status, await res.text(), "Suivi de la génération impossible");
  return (await res.json()) as Operation;
}

export async function getVideoJob(name: string): Promise<VideoJobState> {
  const op = await fetchOperation(name);
  if (op.error) {
    const state: VideoJobState = {
      status: "failed",
      error: { message: op.error.message ?? "Génération refusée par le moteur vidéo." },
    };
    return state;
  }
  if (!op.done) return { status: "in_progress", progress: op.metadata?.progressPercent ?? 0 };

  const filtered = op.response?.generateVideoResponse?.raiMediaFilteredReasons;
  if (filtered?.length)
    return {
      status: "failed",
      error: { code: "moderation_blocked", message: filtered[0] ?? "Contenu refusé." },
    };

  return { status: "completed", progress: 100 };
}

function videoUri(op: Operation): string | null {
  return (
    op.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri ??
    op.response?.videos?.[0]?.video?.uri ??
    op.response?.videos?.[0]?.uri ??
    null
  );
}

export async function downloadVideo(name: string): Promise<ArrayBuffer> {
  const op = await fetchOperation(name);
  const uri = videoUri(op);
  if (!uri) throw fail(500, "Le moteur vidéo n'a pas renvoyé de fichier.");
  const res = await fetch(uri, { headers: { "x-goog-api-key": apiKey() } });
  if (!res.ok) throw fail(res.status, `Téléchargement de la vidéo impossible (${res.status}).`);
  return await res.arrayBuffer();
}
