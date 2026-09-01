import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Clapperboard, ShieldCheck, Wallet } from "lucide-react";

import { LogoWordmark, Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "E'nvlé Motion — Créez vos vidéos IA en français" },
      {
        name: "description",
        content:
          "Décrivez votre idée en une phrase, E'nvlé Motion écrit, réalise et génère votre vidéo premium. Studio IA africain, crédits transparents en FCFA.",
      },
      { property: "og:title", content: "E'nvlé Motion — Studio vidéo IA" },
      {
        property: "og:description",
        content: "Imaginez. Décrivez. Réalisez. Vos vidéos IA générées en quelques minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Sparkles,
    title: "Mode simple",
    text: "Une phrase suffit. Le réalisateur IA écrit la Project Bible, les personnages, les décors et chaque plan.",
  },
  {
    icon: Clapperboard,
    title: "Production continue",
    text: "Vos séquences sont générées, assemblées et lues à la suite, avec continuité des visages et des costumes.",
  },
  {
    icon: Wallet,
    title: "Crédits transparents",
    text: "Grille tarifaire en FCFA, 20 crédits offerts à l'inscription, remboursement automatique en cas d'échec.",
  },
  {
    icon: ShieldCheck,
    title: "Données privées",
    text: "Chaque production reste dans votre espace privé, protégée et accessible à vous seul.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background bg-cinema">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <LogoWordmark />
        <div className="flex items-center gap-2">
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
          </Link>
          <Link to="/auth" search={{ mode: "signup" }}>
            <Button size="sm">Commencer</Button>
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 text-center sm:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Studio vidéo IA
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-6xl">
            <span className="text-gold-gradient">Imaginez. Décrivez. Réalisez.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            E'nvlé Motion transforme une simple phrase en vidéo cinématographique complète :
            scénario, personnages cohérents, dialogues dans votre langue et rendu premium.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button size="lg">Créer ma première vidéo</Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                J'ai déjà un compte
              </Button>
            </Link>
          </div>

          <div className="mx-auto mt-14 flex max-w-md items-center justify-center">
            <Logo className="h-40 w-40 shadow-gold" />
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20">
          <h2 className="font-display text-2xl font-semibold">Une production complète, sans effort</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="surface-panel p-5">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24">
          <div className="surface-panel flex flex-col items-center gap-4 p-8 text-center">
            <h2 className="font-display text-2xl font-semibold">
              20 crédits offerts à l'inscription
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              De quoi produire immédiatement votre première vidéo de 15 secondes et découvrir la
              qualité E'nvlé Motion.
            </p>
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button size="lg">Ouvrir mon studio</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} E'nvlé Motion — Imaginez. Décrivez. Réalisez.
      </footer>
    </div>
  );
}
