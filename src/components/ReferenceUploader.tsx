import { useRef, useState } from "react";
import { toast } from "sonner";

import { removeReferenceImage, uploadReferenceImage } from "@/lib/uploads";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export type ReferenceImage = { path: string; url: string };

export function ReferenceUploader({
  label,
  hint,
  max = 10,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  max?: number;
  value: ReferenceImage[];
  onChange: (images: ReferenceImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = max - value.length;
    if (room <= 0) {
      toast.error(`Maximum ${max} photo${max > 1 ? "s" : ""}.`);
      return;
    }
    setBusy(true);
    try {
      const picked = Array.from(files).slice(0, room);
      const uploaded: ReferenceImage[] = [];
      for (const file of picked) {
        if (!file.type.startsWith("image/")) continue;
        uploaded.push(await uploadReferenceImage(file));
      }
      onChange([...value, ...uploaded]);
      if (uploaded.length) toast.success(`${uploaded.length} photo(s) ajoutée(s).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Envoi impossible.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(image: ReferenceImage) {
    onChange(value.filter((i) => i.path !== image.path));
    await removeReferenceImage(image.path);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}

      <div className="flex flex-wrap gap-3">
        {value.map((image) => (
          <div
            key={image.path}
            className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border bg-muted"
          >
            <img src={image.url} alt="Photo de référence" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(image)}
              className="absolute inset-x-0 bottom-0 bg-background/80 py-0.5 text-[10px] opacity-0 transition-opacity group-hover:opacity-100"
            >
              Retirer
            </button>
          </div>
        ))}

        {value.length < max ? (
          <Button
            type="button"
            variant="outline"
            className="h-20 w-20 flex-col gap-1 text-xs"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <span className="text-lg leading-none">+</span>
            {busy ? "Envoi…" : "Ajouter"}
          </Button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={max > 1}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        {value.length}/{max} photo{max > 1 ? "s" : ""}
      </p>
    </div>
  );
}
