import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { getAdminOverview, updatePricingRule } from "@/lib/admin.functions";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authed/admin")({
  head: () => ({
    meta: [
      { title: "Administration — E'nvlé Motion" },
      { name: "description", content: "Pilotage de la plateforme : utilisateurs, projets, générations, crédits et tarifs." },
      { property: "og:title", content: "Administration — E'nvlé Motion" },
      { property: "og:description", content: "Indicateurs de la plateforme et configuration tarifaire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const qc = useQueryClient();
  const fetchOverview = useServerFn(getAdminOverview);
  const updateRule = useServerFn(updatePricingRule);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => fetchOverview(),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (input: {
      id: string;
      priceFcfa: number;
      credits: number;
      estimatedCostFcfa: number;
      targetMargin: number;
      safetyCoefficient: number;
      active: boolean;
    }) => updateRule({ data: input }),
    onSuccess: () => {
      toast.success("Tarif mis à jour.");
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur inconnue"),
  });

  if (error) {
    return (
      <AppShell title="Administration">
        <p className="text-sm text-destructive">Accès refusé : espace réservé à l'administration.</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Administration" isAdmin>
      {isLoading || !data ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="Utilisateurs" value={data.userCount} />
            <Stat label="Projets" value={data.projectCount} />
            <Stat label="Générations" value={data.jobCount} />
            <Stat label="Crédits en circulation" value={data.creditsOutstanding} />
            <Stat label="Crédits consommés" value={data.creditsUsed} />
            <Stat label="Crédits vendus" value={data.creditsSold} />
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-lg font-semibold">Configuration tarifaire</h3>
            <div className="mt-4 space-y-3">
              {data.pricing.map((rule) => (
                <PricingRow
                  key={rule.id}
                  rule={rule}
                  pending={mutation.isPending}
                  onSave={(v) => mutation.mutate(v)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-lg font-semibold">Productions récentes</h3>
            <ul className="mt-3 divide-y divide-border">
              {data.recentProjects.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="truncate">{p.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {p.durationSeconds}s · {p.creditsSpent} cr. · {p.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </AppShell>
  );
}

type Rule = {
  id: string;
  label: string;
  durationSeconds: number;
  priceFcfa: number;
  credits: number;
  estimatedCostFcfa: number;
  targetMargin: number;
  safetyCoefficient: number;
  active: boolean;
};

function PricingRow({
  rule,
  pending,
  onSave,
}: {
  rule: Rule;
  pending: boolean;
  onSave: (v: {
    id: string;
    priceFcfa: number;
    credits: number;
    estimatedCostFcfa: number;
    targetMargin: number;
    safetyCoefficient: number;
    active: boolean;
  }) => void;
}) {
  const [price, setPrice] = useState(String(rule.priceFcfa));
  const [credits, setCredits] = useState(String(rule.credits));
  const [cost, setCost] = useState(String(rule.estimatedCostFcfa));
  const [margin, setMargin] = useState(String(rule.targetMargin));
  const [safety, setSafety] = useState(String(rule.safetyCoefficient));
  const [active, setActive] = useState(rule.active);

  return (
    <div className="grid items-end gap-3 rounded-lg border border-border p-3 sm:grid-cols-7">
      <div className="text-sm font-medium sm:col-span-1">{rule.label}</div>
      <Field label="Prix FCFA" value={price} onChange={setPrice} />
      <Field label="Crédits" value={credits} onChange={setCredits} />
      <Field label="Coût est." value={cost} onChange={setCost} />
      <Field label="Marge" value={margin} onChange={setMargin} />
      <Field label="Sécurité" value={safety} onChange={setSafety} />
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1 text-xs text-muted-foreground">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Actif
        </label>
        <Button
          size="sm"
          disabled={pending}
          onClick={() =>
            onSave({
              id: rule.id,
              priceFcfa: Number(price),
              credits: Number(credits),
              estimatedCostFcfa: Number(cost),
              targetMargin: Number(margin),
              safetyCoefficient: Number(safety),
              active,
            })
          }
        >
          OK
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-9" />
    </div>
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
