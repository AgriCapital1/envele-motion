import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { deleteCharacter, listCharacters, saveCharacter } from "@/lib/characters.functions";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authed/characters")({
  head: () => ({
    meta: [
      { title: "Personnages — E'nvlé Motion" },
      { name: "description", content: "Créez et réutilisez des personnages cohérents dans toutes vos vidéos IA." },
      { property: "og:title", content: "Personnages — E'nvlé Motion" },
      { property: "og:description", content: "Des personnages cohérents d'une vidéo à l'autre." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CharactersPage,
});

function CharactersPage() {
  const qc = useQueryClient();
  const fetchCharacters = useServerFn(listCharacters);
  const save = useServerFn(saveCharacter);
  const remove = useServerFn(deleteCharacter);

  const { data, isLoading } = useQuery({ queryKey: ["characters"], queryFn: () => fetchCharacters() });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [apparentAge, setApparentAge] = useState("");
  const [gender, setGender] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function reset() {
    setEditingId(null);
    setName("");
    setDescription("");
    setApparentAge("");
    setGender("");
  }

  const saveMutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          ...(editingId ? { id: editingId } : {}),
          name,
          description,
          apparentAge,
          gender,
        },
      }),
    onSuccess: () => {
      toast.success("Personnage enregistré.");
      reset();
      qc.invalidateQueries({ queryKey: ["characters"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur inconnue"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Personnage supprimé.");
      qc.invalidateQueries({ queryKey: ["characters"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur inconnue"),
  });

  return (
    <AppShell title="Personnages">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-semibold">
            {editingId ? "Modifier le personnage" : "Nouveau personnage"}
          </h3>
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description physique</Label>
            <Textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Âge apparent</Label>
              <Input id="age" value={apparentAge} onChange={(e) => setApparentAge(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Genre</Label>
              <Input id="gender" value={gender} onChange={(e) => setGender(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={saveMutation.isPending || !name.trim()}
              onClick={() => saveMutation.mutate()}
            >
              Enregistrer
            </Button>
            {editingId ? (
              <Button variant="ghost" onClick={reset}>
                Annuler
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : (data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun personnage enregistré.</p>
          ) : (
            data?.map((c) => (
              <div key={c.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[c.apparentAge, c.gender].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(c.id);
                        setName(c.name);
                        setDescription(c.description ?? "");
                        setApparentAge(c.apparentAge ?? "");
                        setGender(c.gender ?? "");
                      }}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(c.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
