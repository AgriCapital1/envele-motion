import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { LINGUA_LANGUAGES } from "@/lib/lingua";
import { AFRICAN_VOICES } from "@/lib/voices";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authed/lingua")({
  head: () => ({
    meta: [
      { title: "E'nvlé Lingua — langues et voix africaines" },
      {
        name: "description",
        content:
          "Langues, expressions, prononciations et bibliothèque vocale africaine utilisées par le moteur de génération de voix E'nvlé Motion.",
      },
      { property: "og:title", content: "E'nvlé Lingua — langues et voix africaines" },
      {
        property: "og:description",
        content: "Nouchi, wolof, mooré, haoussa, lingala : expressions, prononciations et voix authentiques.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LinguaPage,
});

function LinguaPage() {
  const [activeId, setActive] = useState(LINGUA_LANGUAGES[0]!.id);
  const active = LINGUA_LANGUAGES.find((l) => l.id === activeId)!;

  return (
    <AppShell title="E'nvlé Lingua">
      <div className="space-y-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          La bibliothèque linguistique du studio. Chaque langue transmet au moteur son accent, son
          rythme et sa prononciation : c'est ce qui donne aux voix générées leur authenticité africaine.
        </p>

        <div className="flex flex-wrap gap-2">
          {LINGUA_LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setActive(l.id)}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                l.id === activeId
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {l.name} · {l.country}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-semibold">
            {active.name} <span className="text-sm font-normal text-muted-foreground">— {active.country}</span>
          </h3>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            {active.speakers}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{active.description}</p>

          <div className="mt-4 rounded-lg border border-border bg-background p-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Consigne envoyée au moteur de voix
            </p>
            <p className="mt-1 text-sm">{active.promptHint}</p>
          </div>

          <ul className="mt-4 divide-y divide-border">
            {active.entries.map((e) => (
              <li key={e.term} className="py-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium">{e.term}</span>
                  <span className="text-xs text-muted-foreground">[{e.pronunciation}]</span>
                </div>
                <p className="text-sm text-muted-foreground">{e.meaning}</p>
                <p className="mt-1 text-xs italic text-muted-foreground">« {e.usage} »</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-semibold">Bibliothèque vocale africaine</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Ces voix sont proposées directement dans la page « Créer une vidéo ».
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {AFRICAN_VOICES.map((v) => (
              <li key={v.id} className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium">{v.label}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {v.accent} · {v.gender}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
