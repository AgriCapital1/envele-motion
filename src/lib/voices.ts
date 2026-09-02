export type AfricanVoice = {
  id: string;
  label: string;
  accent: string;
  gender: "Féminine" | "Masculine";
  description: string;
};

/** Bibliothèque vocale africaine E'nvlé Lingua : 5 accents × 2 genres. */
export const AFRICAN_VOICES: AfricanVoice[] = [
  {
    id: "ci-female",
    label: "Aya — Voix ivoirienne féminine",
    accent: "Ivoirien",
    gender: "Féminine",
    description: "Timbre chaleureux d'Abidjan, débit posé, touches de nouchi.",
  },
  {
    id: "ci-male",
    label: "Konan — Voix ivoirienne masculine",
    accent: "Ivoirien",
    gender: "Masculine",
    description: "Voix grave et assurée, accent abidjanais authentique.",
  },
  {
    id: "sn-female",
    label: "Awa — Voix sénégalaise féminine",
    accent: "Sénégalais",
    gender: "Féminine",
    description: "Diction claire de Dakar, musicalité wolof.",
  },
  {
    id: "sn-male",
    label: "Modou — Voix sénégalaise masculine",
    accent: "Sénégalais",
    gender: "Masculine",
    description: "Voix profonde, cadence narrative dakaroise.",
  },
  {
    id: "bf-female",
    label: "Kadi — Voix burkinabè féminine",
    accent: "Burkinabè",
    gender: "Féminine",
    description: "Ton doux de Ouagadougou, articulation nette.",
  },
  {
    id: "bf-male",
    label: "Issa — Voix burkinabè masculine",
    accent: "Burkinabè",
    gender: "Masculine",
    description: "Voix posée et sincère, accent mossi.",
  },
  {
    id: "ne-female",
    label: "Hadiza — Voix nigérienne féminine",
    accent: "Nigérien",
    gender: "Féminine",
    description: "Intonation haoussa élégante, rythme tranquille.",
  },
  {
    id: "ne-male",
    label: "Aboubacar — Voix nigérienne masculine",
    accent: "Nigérien",
    gender: "Masculine",
    description: "Voix ample de conteur sahélien.",
  },
  {
    id: "cd-female",
    label: "Nadia — Voix congolaise féminine",
    accent: "Congolais",
    gender: "Féminine",
    description: "Accent kinois vif, énergie publicitaire.",
  },
  {
    id: "cd-male",
    label: "Patrick — Voix congolaise masculine",
    accent: "Congolais",
    gender: "Masculine",
    description: "Voix chantante de Kinshasa, présence radio.",
  },
];

export function voiceLabel(id: string | null | undefined): string {
  return AFRICAN_VOICES.find((v) => v.id === id)?.label ?? "Voix par défaut";
}

export function voicePromptHint(id: string | null | undefined): string {
  const voice = AFRICAN_VOICES.find((v) => v.id === id);
  if (!voice) return "";
  return `${voice.gender.toLowerCase()} voice with an authentic ${voice.accent} African accent (${voice.description})`;
}
