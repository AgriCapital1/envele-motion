import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { createProduction, listPricing } from "@/lib/production.functions";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STYLES = ["Cinématographique", "Documentaire", "Publicité", "Animation", "Réaliste"];
const RATIOS = ["16:9", "9:16", "1:1"];
const LANGUAGES = ["Français", "Anglais", "Nouchi", "Wolof", "Lingala"];

export const Route = createFileRoute("/_authed/create")({
  head: () => ({
    meta: [
      { title: "Créer une vidéo — E'nvlé Motion" },
      { name: "description", content: "Décrivez votre idée, choisissez la durée et lancez la génération de votre vidéo IA." },
      { property: "og:title", content: "Créer une vidéo — E'nvlé Motion" },
      { property: "og:description", content: "Une phrase suffit : le réalisateur IA écrit et produit votre vidéo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  const navigate = useNavigate();
  const fetchPricing = useServerFn(listPricing);
  const create = useServerFn(createProduction);

  const { data: pricing } = useQuery({ queryKey: ["pricing"], queryFn: () => fetchPricing() });

  const [brief, setBrief] = useState("");
  const [title, setTitle] = useState("");
  const [durationSeconds, setDuration] = useState(15);
  const [aspectRatio, setRatio] = useState("16:9");
  const [style, setStyle] = useState(STYLES[0]!);
  const [language, setLanguage] = useState(LANGUAGES[0]!);

  const mutation = useMutation({
    mutationFn: () =>
      create({
        data: {
          brief,
          durationSeconds,
          aspectRatio,
          style,
          language,
          ...(title.trim() ? { title: title.trim() } : {}),
        },
      }),
    onSuccess: (res) => {
      toast.success("Production lancée !");
      navigate({ to: "/production/$projectId", params: { projectId: res.projectId } });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Erreur inconnue"),
  });

  const selected = (pricing ?? []).find((p) => p.durationSeconds === durationSeconds);

  return (
    <AppShell title="Créer une vidéo">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5 rounded-xl border border-border bg-card p-5">
          <div className="space-y-2">
            <Label htmlFor="brief">Décrivez votre vidéo</Label>
            <Textarea
              id="brief"
              rows={7}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Ex : Un jeune entrepreneur ivoirien présente sa marque de cacao au marché d'Abidjan, ambiance chaleureuse au lever du soleil."
            />
            <p className="text-xs text-muted-foreground">
              Le réalisateur IA construit la Project Bible : personnages, décors, costumes, plans.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre (optionnel)</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Choice label="Format" value={aspectRatio} options={RATIOS} onChange={setRatio} />
            <Choice label="Style" value={style} options={STYLES} onChange={setStyle} />
            <Choice label="Langue" value={language} options={LANGUAGES} onChange={setLanguage} />
          </div>

          <div className="space-y-2">
            <Label>Durée</Label>
            <div className="flex flex-wrap gap-2">
              {(pricing ?? []).map((p) => (
                <button
                  key={p.durationSeconds}
                  type="button"
                  onClick={() => setDuration(p.durationSeconds)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    durationSeconds === p.durationSeconds
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {p.label} · {p.credits} cr.
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={mutation.isPending || brief.trim().length < 10}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Lancement…" : "Générer ma vidéo"}
          </Button>
        </div>

        <aside className="h-fit space-y-3 rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-semibold">Récapitulatif</h3>
          <Row label="Durée" value={selected?.label ?? `${durationSeconds}s`} />
          <Row label="Format" value={aspectRatio} />
          <Row label="Style" value={style} />
          <Row label="Langue" value={language} />
          <Row label="Coût" value={`${selected?.credits ?? "—"} crédits`} />
          <Row label="Prix indicatif" value={`${selected?.priceFcfa ?? "—"} FCFA`} />
          <p className="pt-2 text-xs text-muted-foreground">
            Les crédits sont automatiquement remboursés si la production échoue.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
