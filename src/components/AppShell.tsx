import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Clapperboard,
  FolderKanban,
  Film,
  Users,
  Coins,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { LogoWordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/create", label: "Créer une vidéo", icon: Clapperboard },
  { to: "/projects", label: "Mes projets", icon: FolderKanban },
  { to: "/videos", label: "Mes vidéos", icon: Film },
  { to: "/characters", label: "Personnages", icon: Users },
  { to: "/credits", label: "Mes crédits", icon: Coins },
] as const;

export function AppShell({
  title,
  children,
  isAdmin = false,
}: {
  title: string;
  children: ReactNode;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const links = (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          activeProps={{ className: "bg-accent text-accent-foreground" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
      {isAdmin ? (
        <Link
          to="/admin"
          onClick={() => setOpen(false)}
          activeProps={{ className: "bg-accent text-accent-foreground" }}
          className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-primary transition-colors hover:bg-accent"
        >
          <Shield className="h-4 w-4" />
          Administration
        </Link>
      ) : null}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background bg-cinema">
      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-border p-4 lg:flex">
          <div className="space-y-6">
            <Link to="/dashboard">
              <LogoWordmark />
            </Link>
            {links}
          </div>
          <Button variant="ghost" className="justify-start gap-3" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Déconnexion
          </Button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="lg:hidden"
                aria-label="Ouvrir le menu"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h1 className="truncate font-display text-lg font-semibold">{title}</h1>
            </div>
            <Link to="/create" className="hidden sm:block">
              <Button size="sm">Nouvelle vidéo</Button>
            </Link>
          </header>

          {open ? (
            <div className="border-b border-border bg-card p-4 lg:hidden">
              {links}
              <Button variant="ghost" className="mt-2 w-full justify-start gap-3" onClick={signOut}>
                <LogOut className="h-4 w-4" /> Déconnexion
              </Button>
            </div>
          ) : null}

          <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
