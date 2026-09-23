/**
 * Static content of the retrospective: steps, character classes,
 * traveller states, map zones and rules.
 */

export const STORAGE_KEY = "quete-guilde-retro-s1";

export const COINS_PER_MEMBER = 3;
export const TOP_SUBJECTS_COUNT = 2;
export const WHYS_COUNT = 5;
export const MAX_OATHS = 3;
export const MAX_CROWNS = 5;
export const MAX_HEARTS = 4;
/** Maximum number of coins drawn in a pile (the exact count is shown next to it). */
export const MAX_DRAWN_COINS = 8;
/** Timer duration used on steps that have no planned duration. */
export const DEFAULT_TIMER_SECONDS = 5 * 60;

export const ROMAN = ["I", "II", "III", "IV", "V"];

/** Heraldic tinctures used inside the SVG drawings (fixed, theme independent). */
export const TINCTURES = {
  gules: "#9B2226",
  azure: "#1E3A6E",
  vert: "#2E5E43",
  or: "#C99A2E",
  purpure: "#5B3A6B",
  argent: "#F3EEDF",
  sable: "#1B1713",
  wood: "#7A4B22",
};

export const STEPS = [
  { key: "accueil",   num: "",    title: "La taverne",                  short: "Taverne",   minutes: 0 },
  { key: "serment",   num: "I",   title: "Le Serment de la Guilde",     short: "Serment",   minutes: 5 },
  { key: "classe",    num: "II",  title: "Choisis ta classe",           short: "Classes",   minutes: 5 },
  { key: "etat",      num: "III", title: "L'état du voyageur",          short: "État",      minutes: 5 },
  { key: "carte",     num: "IV",  title: "La Carte de la Quête",        short: "Carte",     minutes: 20 },
  { key: "or",        num: "V",   title: "Les Pièces d'or et l'Oracle", short: "Oracle",    minutes: 15 },
  { key: "parchemin", num: "VI",  title: "Le Parchemin des Serments",   short: "Parchemin", minutes: 15 },
  { key: "verdict",   num: "VII", title: "Le Verdict du Roi",           short: "Verdict",   minutes: 10 },
  { key: "chronique", num: "",    title: "La Chronique",                short: "Chronique", minutes: 0 },
];

export const STEP_INDEX = Object.fromEntries(STEPS.map((step, index) => [step.key, index]));

export const CLASSES = [
  { key: "chevalier",  name: "Chevalier",        desc: "J'ai foncé et porté une grosse partie du travail.",               field: "gules" },
  { key: "mage",       name: "Mage",             desc: "J'ai surtout réfléchi, conçu ou résolu des problèmes compliqués.", field: "azure" },
  { key: "barde",      name: "Barde",            desc: "J'ai communiqué, fait le lien entre les personnes ou rédigé.",    field: "vert" },
  { key: "eclaireur",  name: "Éclaireur",        desc: "J'ai exploré, cherché des informations, fait de la veille.",      field: "or" },
  { key: "alchimiste", name: "Alchimiste",       desc: "J'ai testé plusieurs choses pour trouver ce qui marche.",         field: "purpure" },
  { key: "perdu",      name: "Aventurier perdu", desc: "Je ne savais pas toujours où aller ni quoi faire.",               field: "argent" },
];

export const STATES = [
  { key: "forme",   hearts: 4, name: "En pleine forme",     desc: "Prêt à repartir en quête tout de suite." },
  { key: "fatigue", hearts: 3, name: "Fatigué mais debout", desc: "Ça va, mais le voyage a été long." },
  { key: "blesse",  hearts: 2, name: "Blessé",              desc: "Le Sprint a été difficile pour moi." },
  { key: "bout",    hearts: 1, name: "À bout de forces",    desc: "J'ai besoin que quelque chose change." },
];

/** States that trigger the "several travellers are hurt" warning. */
export const HURT_STATES = ["blesse", "bout"];
export const HURT_WARNING_THRESHOLD = 2;

export const ZONES = [
  { key: "chateau", name: "Le Château",                short: "Le Château", q: "Quel était l'objectif du Sprint 1 ? L'avons-nous atteint ?", color: "var(--azure)" },
  { key: "allies",  name: "Les Alliés et les Potions", short: "Les Alliés", q: "Qu'est-ce qui nous a aidés à avancer ?",                     color: "var(--vert)" },
  { key: "dragon",  name: "Le Dragon",                 short: "Le Dragon",  q: "Qu'est-ce qui nous a bloqués ou ralentis ?",                  color: "var(--gules)" },
  { key: "pieges",  name: "Les Pièges du chemin",      short: "Les Pièges", q: "Quels risques voyons-nous pour les prochaines quêtes ?",      color: "var(--purpure)" },
  { key: "tresor",  name: "Le Trésor",                 short: "Le Trésor",  q: "Qu'avons-nous appris ou réussi ?",                            color: "var(--or)" },
];

/** Zones whose ideas are offered for coin voting by default. */
export const PROBLEM_ZONES = ["dragon", "pieges"];

export const SMART_CRITERIA = [
  { k: "p", t: "Précis" },
  { k: "m", t: "Mesurable" },
  { k: "r", t: "Réalisable pendant le Sprint 2" },
  { k: "h", t: "Un seul héros" },
  { k: "e", t: "Une échéance" },
];

export const findZone = (key) => ZONES.find((zone) => zone.key === key) ?? ZONES[0];
export const findClass = (key) => CLASSES.find((cls) => cls.key === key) ?? null;
export const findState = (key) => STATES.find((st) => st.key === key) ?? null;
