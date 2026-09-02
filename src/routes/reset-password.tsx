import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { LogoWordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nouveau mot de passe — E'nvlé Motion" },
      {
        name: "description",
        content: "Choisissez un nouveau mot de passe pour retrouver l'accès à votre studio E'nvlé Motion.",
      },
      { property: "og:title", content: "Nouveau mot de passe — E'nvlé Motion" },
      { property: "og:description", content: "Réinitialisez votre mot de passe E'nvlé Motion en une étape." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setHasSession(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Mot de passe mis à jour.");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
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
          <h1 className="font-display text-2xl font-semibold">Nouveau mot de passe</h1>
          {hasSession === false ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Ce lien de réinitialisation a expiré.{" "}
              <Link to="/auth" className="underline">
                Demandez-en un nouveau
              </Link>
              .
            </p>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmer</Label>
                <Input
                  id="confirm"
                  type="password"
                  minLength={6}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Patientez…" : "Mettre à jour"}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
