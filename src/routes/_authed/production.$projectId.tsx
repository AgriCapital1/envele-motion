import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Download, RefreshCw } from "lucide-react";

import {
  advanceProduction,
  extendProduction,
  getProduction,
  regenerateProduction,
  saveFinalVideo,
} from "@/lib/production.functions";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authed/production/$projectId")({
  head: () => ({
    meta: [
      { title: "Production — E'nvlé Motion" },
      { name: "description", content: "Suivez la progression, visionnez et téléchargez votre vidéo finale." },
      { property: "og:title", content: "Production — E'nvlé Motion" },
      { property: "og:description", content: "Une seule vidéo finale, prête à voir et à télécharger." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductionPage,
});

const STEPS = ["Préparation du scénario", "Génération des scènes", "Assemblage de la vidéo", "Finalisation", "Vidéo prête"];

function stepIndex(status: string | undefined, assembling: boolean, hasFinal: boolean) {
  if (hasFinal) return 4;
  if (assembling) return 2;
  if (status === "ANALYZING") return 0;
  if (status === "GENERATING") return 1;
  if (status === "COMPLETED") return 3;
  return 0;
}

function ProductionPage() {
  const { projectId } = Route.useParams();
  const fetchState = useServerFn(getProduction);
  const advance = useServerFn(advanceProduction);
  const extend = useServerFn(extendProduction);
  const regenerate = useServerFn(regenerateProduction);
  const persistFinal = useServerFn(saveFinalVideo);

  const [assembling, setAssembling] = useState(false);
  const assembled = useRef(false);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["production", projectId],
    queryFn: () => fetchState({ data: { projectId } }),
  });

  const status = data?.project.status;
  const finalUrl = data?.project.finalUrl ?? null;
  const running = useRef(false);

  useEffect(() => {
    if (!status || running.current) return;
    if (["COMPLETED", "FAILED", "CANCELLED"].includes(status)) return;
    running.current = true;
    let cancelled = false;
    (async () => {
      try {
        for (let i = 0; i < 200 && !cancelled; i++) {
          const next = await advance({ data: { projectId } });
          await refetch();
          if (["COMPLETED", "FAILED", "CANCELLED"].includes(next.project.status)) break;
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erreur de production");
      } finally {
        running.current = false;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, projectId, advance, refetch]);

  // Assemblage automatique : les séquences internes deviennent UNE seule vidéo finale.
  useEffect(() => {
    if (status !== "COMPLETED" || finalUrl || assembled.current) return;
    if (!data?.clips.length) return;
    assembled.current = true;
    setAssembling(true);
    (async () => {
      try {
        const clips = [...data.clips].sort((a, b) => a.index - b.index);
        const blob = await assembleVideo(clips.map((c) => c.url));
        const { data: user } = await supabase.auth.getUser();
        const uid = user.user?.id;
        if (!uid) throw new Error("Session expirée.");
        const path = `${uid}/${projectId}/final.mp4`;
        const { error } = await supabase.storage
          .from("productions")
          .upload(path, blob, { contentType: "video/mp4", upsert: true });
        if (error) throw new Error("Enregistrement de la vidéo finale impossible.");
        await persistFinal({ data: { projectId, path } });
        await refetch();
      } catch (error) {
        assembled.current = false;
        toast.error(error instanceof Error ? error.message : "Assemblage impossible");
      } finally {
        setAssembling(false);
      }
    })();
  }, [status, finalUrl, data?.clips, projectId, persistFinal, refetch]);

  const extendMutation = useMutation({
    mutationFn: (extraSeconds: number) => extend({ data: { projectId, extraSeconds } }),
    onSuccess: () => {
      toast.success("Prolongation lancée.");
      running.current = false;
      assembled.current = false;
      refetch();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur inconnue"),
  });

  const regenerateMutation = useMutation({
    mutationFn: () => regenerate({ data: { projectId } }),
    onSuccess: () => {
      toast.success("Nouvelle génération lancée.");
      running.current = false;
      assembled.current = false;
      refetch();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur inconnue"),
  });

  const current = stepIndex(status, assembling, Boolean(finalUrl));

  return (
    <AppShell title={data?.project.title ?? "Production"}>
      {isLoading || !data ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <FinalPlayer
              url={finalUrl}
              title={data.project.title}
              aspectRatio={data.project.aspectRatio}
              assembling={assembling}
            />

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{STEPS[current]}</span>
                <span className="font-medium">{finalUrl ? 100 : data.progress}%</span>
              </div>
              <Progress value={finalUrl ? 100 : data.progress} />
              <ol className="mt-4 grid gap-2 sm:grid-cols-5">
                {STEPS.map((label, i) => (
                  <li
                    key={label}
                    className={`rounded-lg border px-2 py-2 text-center text-[11px] ${
                      i <= current
                        ? "border-primary/50 text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {label}
                  </li>
                ))}
              </ol>
              {data.error ? <p className="mt-3 text-sm text-destructive">{data.error}</p> : null}
            </div>
          </div>

          <aside className="h-fit space-y-4 rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-lg font-semibold">Détails</h3>
            <p className="text-sm text-muted-foreground">{data.project.brief}</p>
            <div className="space-y-1 text-sm">
              <Row label="Durée" value={`${data.project.durationSeconds}s`} />
              <Row label="Format" value={data.project.aspectRatio} />
              <Row label="Style" value={data.project.style} />
              <Row label="Langue" value={data.project.language} />
              <Row label="Crédits" value={`${data.project.creditsSpent}`} />
            </div>

            {finalUrl ? (
              <a href={finalUrl} download={`${data.project.title}.mp4`} className="block">
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger la vidéo
                </Button>
              </a>
            ) : null}

            <Button
              variant="outline"
              className="w-full"
              disabled={regenerateMutation.isPending || status === "GENERATING" || status === "ANALYZING"}
              onClick={() => regenerateMutation.mutate()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Régénérer
            </Button>

            <div className="pt-2">
              <p className="mb-2 text-sm font-medium">Prolonger la vidéo</p>
              <div className="flex flex-wrap gap-2">
                {[15, 30, 60].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant="outline"
                    disabled={extendMutation.isPending || data.project.status !== "COMPLETED"}
                    onClick={() => extendMutation.mutate(s)}
                  >
                    +{s}s
                  </Button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  );
}

/** Concatène les séquences internes en une seule vidéo finale (dans le navigateur). */
async function assembleVideo(urls: string[]): Promise<Blob> {
  const buffers = await Promise.all(
    urls.map(async (url) => new Uint8Array(await (await fetch(url)).arrayBuffer())),
  );
  if (buffers.length === 1) return new Blob([buffers[0]!], { type: "video/mp4" });

  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  const names: string[] = [];
  for (let i = 0; i < buffers.length; i++) {
    const name = `part-${i}.mp4`;
    await ffmpeg.writeFile(name, buffers[i]!);
    names.push(name);
  }
  await ffmpeg.writeFile(
    "list.txt",
    new TextEncoder().encode(names.map((n) => `file '${n}'`).join("\n")),
  );
  await ffmpeg.exec(["-f", "concat", "-safe", "0", "-i", "list.txt", "-c", "copy", "final.mp4"]);
  const out = await ffmpeg.readFile("final.mp4");
  const bytes = typeof out === "string" ? new TextEncoder().encode(out) : out;
  return new Blob([bytes as unknown as BlobPart], { type: "video/mp4" });
}

function FinalPlayer({
  url,
  title,
  aspectRatio,
  assembling,
}: {
  url: string | null;
  title: string;
  aspectRatio: string;
  assembling: boolean;
}) {
  if (!url) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground"
        style={{ aspectRatio: aspectRatio.replace(":", " / ") }}
      >
        {assembling
          ? "Assemblage de votre vidéo finale…"
          : "Votre vidéo finale apparaîtra ici dès qu'elle est prête."}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black">
      <video
        key={url}
        src={url}
        controls
        className="w-full"
        style={{ aspectRatio: aspectRatio.replace(":", " / ") }}
      />
      <div className="px-4 py-2 text-xs text-muted-foreground">{title}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
