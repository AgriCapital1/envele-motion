import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { listProjects } from "@/lib/production.functions";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authed/projects")({
  head: () => ({
    meta: [
      { title: "Mes projets — E'nvlé Motion" },
      { name: "description", content: "Retrouvez toutes vos productions vidéo IA et leur statut." },
      { property: "og:title", content: "Mes projets — E'nvlé Motion" },
      { property: "og:description", content: "Toutes vos productions vidéo IA en un coup d'œil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const fetchProjects = useServerFn(listProjects);
  const { data, isLoading } = useQuery({ queryKey: ["projects"], queryFn: () => fetchProjects() });

  return (
    <AppShell title="Mes projets">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (data ?? []).length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Vous n'avez encore aucun projet.</p>
          <Link to="/create" className="mt-4 inline-block">
            <Button>Créer ma première vidéo</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {p.status}
                </span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.brief}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {p.durationSeconds}s · {p.aspectRatio} · {p.creditsSpent} crédits
              </p>
              <Link to="/production/$projectId" params={{ projectId: p.id }} className="mt-4 inline-block">
                <Button size="sm" variant="outline">
                  Ouvrir la production
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
