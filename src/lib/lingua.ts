/** E'nvlé Lingua — langues, expressions et prononciations africaines. */

export type LinguaEntry = {
  term: string;
  meaning: string;
  pronunciation: string;
  usage: string;
};

export type LinguaLanguage = {
  id: string;
  name: string;
  country: string;
  speakers: string;
  description: string;
  /** Indice de prononciation injecté dans les prompts de génération vocale. */
  promptHint: string;
  entries: LinguaEntry[];
};

export const LINGUA_LANGUAGES: LinguaLanguage[] = [
  {
    id: "nouchi",
    name: "Nouchi",
    country: "Côte d'Ivoire",
    speakers: "Argot urbain d'Abidjan",
    description:
      "Français abidjanais mêlé de dioula, baoulé et anglais. Rythme rapide, ton complice, très utilisé en publicité jeune.",
    promptHint:
      "Ivorian French with Abidjan nouchi slang, warm and playful delivery, rolling rhythm, urban Abidjan accent",
    entries: [
      { term: "Enjaillé", meaning: "Content, enthousiaste", pronunciation: "an-ja-yé", usage: "Je suis enjaillé de ce projet." },
      { term: "Gbô", meaning: "Manger, repas", pronunciation: "gbo (g et b liés)", usage: "On va gbô au maquis." },
      { term: "Djandjou", meaning: "Frimeur, tape-à-l'œil", pronunciation: "djan-djou", usage: "Ne fais pas le djandjou." },
      { term: "Môgô", meaning: "Ami, personne", pronunciation: "mo-go", usage: "C'est mon môgô depuis l'école." },
      { term: "Kpakpato", meaning: "Curieux, commère", pronunciation: "kpak-pa-to", usage: "Arrête d'être kpakpato." },
    ],
  },
  {
    id: "wolof",
    name: "Wolof",
    country: "Sénégal",
    speakers: "≈ 12 millions",
    description: "Langue véhiculaire du Sénégal, musicale et posée, idéale pour les narrations institutionnelles.",
    promptHint:
      "Senegalese Wolof-accented delivery from Dakar, melodic intonation, clear articulation, calm narrative pace",
    entries: [
      { term: "Nangadef", meaning: "Comment vas-tu ?", pronunciation: "nan-ga-def", usage: "Nangadef, sama xarit ?" },
      { term: "Jërëjëf", meaning: "Merci", pronunciation: "djeu-reu-djeuf", usage: "Jërëjëf pour votre confiance." },
      { term: "Teranga", meaning: "Hospitalité", pronunciation: "té-ran-ga", usage: "La teranga sénégalaise." },
      { term: "Waaw", meaning: "Oui", pronunciation: "waaw", usage: "Waaw, c'est prêt." },
      { term: "Ndank ndank", meaning: "Doucement, pas à pas", pronunciation: "ndank ndank", usage: "Ndank ndank on avance." },
    ],
  },
  {
    id: "moore",
    name: "Mooré",
    country: "Burkina Faso",
    speakers: "≈ 8 millions",
    description: "Langue mossi de Ouagadougou, ton chaleureux et respectueux, parfait pour les messages communautaires.",
    promptHint: "Burkinabè Mooré-accented French from Ouagadougou, gentle respectful tone, steady articulation",
    entries: [
      { term: "Ne y yibeoogo", meaning: "Bonjour (matin)", pronunciation: "né yi-béo-go", usage: "Ne y yibeoogo à tous." },
      { term: "Barka", meaning: "Merci", pronunciation: "bar-ka", usage: "Barka pour l'accueil." },
      { term: "Laafi", meaning: "Paix, santé", pronunciation: "laa-fi", usage: "Laafi bala — tout va bien." },
      { term: "Yamba", meaning: "Ami, camarade", pronunciation: "yam-ba", usage: "Mon yamba de toujours." },
    ],
  },
  {
    id: "haoussa",
    name: "Haoussa",
    country: "Niger",
    speakers: "≈ 80 millions",
    description: "Grande langue sahélienne, diction ample de conteur, très efficace en voix off radio.",
    promptHint: "Nigerien Hausa-accented delivery, broad storyteller voice, sahelian cadence, warm low register",
    entries: [
      { term: "Sannu", meaning: "Bonjour / salut", pronunciation: "san-nou", usage: "Sannu da aiki — bon courage." },
      { term: "Na gode", meaning: "Merci", pronunciation: "na go-dé", usage: "Na gode sosai — merci beaucoup." },
      { term: "Yaya dai", meaning: "Comment ça va ?", pronunciation: "ya-ya daï", usage: "Yaya dai, aboki ?" },
      { term: "Lafiya", meaning: "Santé, paix", pronunciation: "la-fi-ya", usage: "Lafiya lau — tout va bien." },
    ],
  },
  {
    id: "lingala",
    name: "Lingala",
    country: "RD Congo",
    speakers: "≈ 40 millions",
    description: "Langue chantante de Kinshasa, énergie publicitaire immédiate, rythme dynamique.",
    promptHint: "Congolese Lingala-accented delivery from Kinshasa, singing intonation, vivid energetic advertising tone",
    entries: [
      { term: "Mbote", meaning: "Bonjour", pronunciation: "mm-bo-té", usage: "Mbote na bino !" },
      { term: "Matondo", meaning: "Merci", pronunciation: "ma-ton-do", usage: "Matondo mingi." },
      { term: "Malamu", meaning: "Bien, bon", pronunciation: "ma-la-mou", usage: "Ezali malamu — c'est bien." },
      { term: "Yaka", meaning: "Viens", pronunciation: "ya-ka", usage: "Yaka kotala — viens voir." },
    ],
  },
];

export function linguaHint(languageName: string | null | undefined): string {
  const found = LINGUA_LANGUAGES.find(
    (l) => l.name.toLowerCase() === (languageName ?? "").toLowerCase(),
  );
  return found?.promptHint ?? "";
}
