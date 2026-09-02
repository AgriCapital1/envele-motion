import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getDashboard } from "@/lib/production.functions";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authed/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — E'nvlé Motion" },
      { name: "description", content: "Suivez vos productions vidéo IA, vos crédits et vos projets récents." },
      { property: "og:title", content: "Tableau de bord — E'nvlé Motion" },
      { property: "og:description", content: "Vos productions, vos crédits et vos projets récents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const fetchDashboard = useServerFn(getDashboard);
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: () => fetchDashboard() });

  const isAdmin = (data?.roles ?? []).some((r) => r === "admin" || r === "super_admin");

  return (
    <AppShell title="Tableau de bord" isAdmin={isAdmin}>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Bonjour {data?.fullName ?? "créateur"} 👋
            </h2>
            <p className="text-sm text-muted-foreground">Imaginez. Décrivez. Réalisez.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Crédits disponibles" value={data?.balance ?? 0} />
            <Stat label="Crédits utilisés" value={data?.lifetimeUsed ?? 0} />
            <Stat label="Productions en cours" value={data?.activeCount ?? 0} />
            <Stat label="Vidéos terminées" value={data?.completedCount ?? 0} />
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Projets récents</h3>
              <Link to="/create">
                <Button size="sm">Créer une vidéo</Button>
              </Link>
            </div>
            {(data?.recent ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun projet pour l'instant. Lancez votre première production.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {data?.recent.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.durationSeconds}s · {p.status}
                      </p>
                    </div>
                    <Link to="/production/$projectId" params={{ projectId: p.id }}>
                      <Button variant="outline" size="sm">
                        Ouvrir
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-gold-gradient">{value}</p>
    </div>
  );
}
