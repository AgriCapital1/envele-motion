import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { LogoWordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "signin" | "signup" | "reset";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: "signin" | "signup" | undefined } => ({
    mode: search["mode"] === "signup" ? "signup" : search["mode"] === "signin" ? "signin" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Connexion — E'nvlé Motion" },
      {
        name: "description",
        content:
          "Connectez-vous ou créez votre compte E'nvlé Motion et recevez 20 crédits offerts pour votre première vidéo IA.",
      },
      { property: "og:title", content: "Connexion — E'nvlé Motion" },
      {
        property: "og:description",
        content: "Créez votre compte E'nvlé Motion et lancez votre première production vidéo IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(search.mode === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Lien de réinitialisation envoyé par e-mail.");
        setMode("signin");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Compte créé. Vérifiez votre e-mail si une confirmation est demandée.");
        const { data } = await supabase.auth.getSession();
        if (data.session) navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error(error.message);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background bg-cinema">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <Link to="/">
          <LogoWordmark />
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
          <h2 className="font-display text-2xl font-semibold">
            {mode === "signup"
              ? "Créer un compte"
              : mode === "reset"
                ? "Mot de passe oublié"
                : "Connexion"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signup"
              ? "20 crédits offerts pour votre première production."
              : mode === "reset"
                ? "Recevez un lien de réinitialisation par e-mail."
                : "Accédez à votre studio E'nvlé Motion."}
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            {mode === "signup" ? (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom"
                  required
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
              />
            </div>

            {mode !== "reset" ? (
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Patientez…"
                : mode === "signup"
                  ? "Créer mon compte"
                  : mode === "reset"
                    ? "Envoyer le lien"
                    : "Se connecter"}
            </Button>
          </form>

          {mode !== "reset" ? (
            <>
              <div className="my-4 text-center text-xs uppercase tracking-widest text-muted-foreground">
                ou
              </div>
              <Button variant="outline" className="w-full" onClick={google} type="button">
                Continuer avec Google
              </Button>
            </>
          ) : null}

          <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                <button type="button" className="underline" onClick={() => setMode("signup")}>
                  Créer un compte
                </button>
                <br />
                <button type="button" className="underline" onClick={() => setMode("reset")}>
                  Mot de passe oublié ?
                </button>
              </>
            ) : (
              <button type="button" className="underline" onClick={() => setMode("signin")}>
                J'ai déjà un compte
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
