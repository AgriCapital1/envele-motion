import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getCredits } from "@/lib/production.functions";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authed/credits")({
  head: () => ({
    meta: [
      { title: "Mes crédits — E'nvlé Motion" },
      { name: "description", content: "Consultez votre solde de crédits, votre historique et la grille tarifaire en FCFA." },
      { property: "og:title", content: "Mes crédits — E'nvlé Motion" },
      { property: "og:description", content: "Solde, historique et tarifs de vos productions vidéo IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreditsPage,
});

function CreditsPage() {
  const fetchCredits = useServerFn(getCredits);
  const { data, isLoading } = useQuery({ queryKey: ["credits"], queryFn: () => fetchCredits() });

  return (
    <AppShell title="Mes crédits">
      {isLoading || !data ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Solde" value={data.balance} />
            <Stat label="Utilisés" value={data.lifetimeUsed} />
            <Stat label="Achetés" value={data.lifetimePurchased} />
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-lg font-semibold">Grille tarifaire</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.pricing.map((p) => (
                <div
                  key={p.durationSeconds}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span>{p.label}</span>
                  <span className="text-muted-foreground">
                    {p.credits} cr. · {p.priceFcfa} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-lg font-semibold">Historique</h3>
            {data.transactions.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Aucune opération pour le moment.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {data.transactions.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate">{t.description ?? t.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>
                    <span className={t.amount >= 0 ? "text-primary" : "text-muted-foreground"}>
                      {t.amount >= 0 ? "+" : ""}
                      {t.amount}
                    </span>
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
