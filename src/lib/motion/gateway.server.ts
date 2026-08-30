/**
 * Adaptateur fournisseur IA (provider-agnostic).
 * Toute la plateforme passe par ces interfaces : changer de fournisseur
 * ne demande que d'ajouter une nouvelle implémentation ici.
 */

const GATEWAY = "https://ai.gateway.lovable.dev/v1";

function apiKey(): string {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Configuration manquante : clé du moteur IA absente.");
  return key;
}

export type GatewayError = Error & { status?: number; retryable?: boolean };

function fail(status: number, message: string): GatewayError {
  const err = new Error(message) as GatewayError;
  err.status = status;
  err.retryable = status === 429 || status >= 500;
  return err;
}

/** Analyse / raisonnement textuel (Brief Analyzer, Director Engine). */
export async function analyzeText(system: string, user: string): Promise<string> {
  const res = await fetch(`${GATEWAY}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 402)
      throw fail(402, "Crédits IA insuffisants sur la plateforme. Rechargez pour continuer.");
    if (res.status === 429)
      throw fail(429, "Trop de demandes simultanées. Réessayez dans un instant.");
    throw fail(res.status, `Analyse du brief impossible : ${body.slice(0, 300)}`);
  }

  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return json.choices?.[0]?.message?.content ?? "";
}

export type VideoRequest = {
  prompt: string;
  negativePrompt?: string;
  durationSeconds: 4 | 6 | 8;
  aspectRatio: "16:9" | "9:16";
  model: string;
  seed?: number;
};

/** Lance une génération vidéo (job asynchrone chez le fournisseur). */
export async function generateVideo(req: VideoRequest): Promise<string> {
  const parameters: Record<string, unknown> = {
    durationSeconds: req.durationSeconds,
    resolution: "720p",
    sampleCount: 1,
    generateAudio: true,
    aspectRatio: req.aspectRatio,
  };
  if (req.negativePrompt) parameters["negativePrompt"] = req.negativePrompt;
  if (req.seed !== undefined) parameters["seed"] = req.seed;

  const res = await fetch(`${GATEWAY}/videos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: req.model,
      instances: [{ prompt: req.prompt }],
      parameters,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 402)
      throw fail(402, "Crédits IA insuffisants sur la plateforme pour lancer cette production.");
    if (res.status === 429)
      throw fail(429, "Le moteur vidéo est saturé. La production reprendra automatiquement.");
    throw fail(res.status, `Génération vidéo refusée : ${body.slice(0, 300)}`);
  }

  const job = (await res.json()) as { id?: string };
  if (!job.id) throw fail(500, "Le moteur vidéo n'a pas renvoyé d'identifiant de production.");
  return job.id;
}

export type VideoJobState = {
  status: "in_progress" | "queued" | "completed" | "failed" | string;
  progress?: number;
  error?: { code?: string; message?: string };
};

export async function getVideoJob(id: string): Promise<VideoJobState> {
  const res = await fetch(`${GATEWAY}/videos/${id}`, {
    headers: { Authorization: `Bearer ${apiKey()}` },
  });
  if (!res.ok) throw fail(res.status, `Suivi de la génération impossible (${res.status}).`);
  return (await res.json()) as VideoJobState;
}

export async function downloadVideo(id: string): Promise<ArrayBuffer> {
  const res = await fetch(`${GATEWAY}/videos/${id}/content`, {
    headers: { Authorization: `Bearer ${apiKey()}` },
  });
  if (!res.ok) throw fail(res.status, `Téléchargement de la vidéo impossible (${res.status}).`);
  return await res.arrayBuffer();
}
