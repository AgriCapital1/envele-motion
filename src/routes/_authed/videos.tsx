import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { listVideos } from "@/lib/production.functions";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authed/videos")({
  head: () => ({
    meta: [
      { title: "Mes vidéos — E'nvlé Motion" },
      { name: "description", content: "Toutes vos vidéos terminées, prêtes à être visionnées et partagées." },
      { property: "og:title", content: "Mes vidéos — E'nvlé Motion" },
      { property: "og:description", content: "Vos vidéos IA terminées, prêtes à visionner." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  const fetchVideos = useServerFn(listVideos);
  const { data, isLoading } = useQuery({ queryKey: ["videos"], queryFn: () => fetchVideos() });

  return (
    <AppShell title="Mes vidéos">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (data ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune vidéo terminée pour le moment.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((v) => (
            <div key={v.id} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-semibold">{v.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {v.durationSeconds}s · {v.aspectRatio}
              </p>
              <Link to="/production/$projectId" params={{ projectId: v.id }} className="mt-4 inline-block">
                <Button size="sm">Visionner</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
