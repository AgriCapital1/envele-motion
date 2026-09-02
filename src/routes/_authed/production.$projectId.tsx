import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { advanceProduction, extendProduction, getProduction } from "@/lib/production.functions";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authed/production/$projectId")({
  head: () => ({
    meta: [
      { title: "Production — E'nvlé Motion" },
      { name: "description", content: "Suivez la progression, visionnez et prolongez votre production vidéo IA." },
      { property: "og:title", content: "Production — E'nvlé Motion" },
      { property: "og:description", content: "Progression en temps réel, lecteur intégré et prolongation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductionPage,
});

function ProductionPage() {
  const { projectId } = Route.useParams();
  const fetchState = useServerFn(getProduction);
  const advance = useServerFn(advanceProduction);
  const extend = useServerFn(extendProduction);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["production", projectId],
    queryFn: () => fetchState({ data: { projectId } }),
  });

  const status = data?.project.status;
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

  const extendMutation = useMutation({
    mutationFn: (extraSeconds: number) => extend({ data: { projectId, extraSeconds } }),
    onSuccess: () => {
      toast.success("Prolongation lancée.");
      running.current = false;
      refetch();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur inconnue"),
  });

  return (
    <AppShell title={data?.project.title ?? "Production"}>
      {isLoading || !data ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <ClipPlayer clips={data.clips} aspectRatio={data.project.aspectRatio} />
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">{data.progress}%</span>
              </div>
              <Progress value={data.progress} />
              <p className="mt-3 text-xs text-muted-foreground">Statut : {data.project.status}</p>
              {data.error ? (
                <p className="mt-2 text-sm text-destructive">{data.error}</p>
              ) : null}
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-lg font-semibold">Séquences</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {data.sequences.map((s) => (
                  <li
                    key={s.index}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <span>Plan {s.index + 1}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.duration}s · {s.status}
                    </span>
                  </li>
                ))}
              </ul>
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

function ClipPlayer({
  clips,
  aspectRatio,
}: {
  clips: Array<{ index: number; url: string; duration: number }>;
  aspectRatio: string;
}) {
  const [current, setCurrent] = useState(0);
  const clip = clips[current];

  if (!clip) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-border bg-card text-sm text-muted-foreground">
        Les premières séquences apparaîtront ici dès qu'elles sont générées.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black">
      <video
        key={clip.url}
        src={clip.url}
        controls
        autoPlay
        onEnded={() => setCurrent((i) => (i + 1 < clips.length ? i + 1 : i))}
        className="w-full"
        style={{ aspectRatio: aspectRatio.replace(":", " / ") }}
      />
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
        <span>
          Plan {current + 1} / {clips.length}
        </span>
        <button type="button" className="underline" onClick={() => setCurrent(0)}>
          Relire depuis le début
        </button>
      </div>
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
