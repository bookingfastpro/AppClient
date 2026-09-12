import { BatteryLow, Brain, Footprints, PersonStanding, Sparkles, Target, Wind, Zap } from "lucide-react";

/**
 * The "Comment te sens-tu aujourd'hui ?" entry points. Each mood resolves
 * to a union of category slugs rather than a single category, so two
 * moods that share a category (Mal au dos and Envie de bouger both touch
 * yoga) still land on genuinely different sets.
 *
 * Tints come from the mood palette in globals.css, the one approved
 * exception to the warm-neutral/sage system: these tiles are a colour-coded
 * index, so each need has to be distinguishable at a glance.
 */
export type Mood = {
  slug: string;
  label: string;
  headline: string;
  icon: typeof Wind;
  categorySlugs: string[];
  tint: string;
};

export const MOODS: Mood[] = [
  {
    slug: "stressee",
    label: "Stressée",
    headline: "Relâcher la pression",
    icon: Wind,
    categorySlugs: ["breathing", "meditation"],
    tint: "bg-mood-warm-bg text-mood-warm-fg",
  },
  {
    slug: "fatiguee",
    label: "Fatiguée",
    headline: "Récupérer en douceur",
    icon: BatteryLow,
    categorySlugs: ["relaxation", "sleep"],
    tint: "bg-mood-peach-bg text-mood-peach-fg",
  },
  {
    slug: "manque-d-energie",
    label: "Manque d'énergie",
    headline: "Réveiller le corps",
    icon: Zap,
    categorySlugs: ["yoga", "breathing"],
    tint: "bg-mood-amber-bg text-mood-amber-fg",
  },
  {
    slug: "mal-au-dos",
    label: "Mal au dos",
    headline: "Soulager les tensions",
    icon: PersonStanding,
    categorySlugs: ["flexibility", "relaxation"],
    tint: "bg-mood-rose-bg text-mood-rose-fg",
  },
  {
    slug: "envie-de-bouger",
    label: "Envie de bouger",
    headline: "Se mettre en mouvement",
    icon: Footprints,
    categorySlugs: ["yoga", "flexibility"],
    tint: "bg-mood-green-bg text-mood-green-fg",
  },
  {
    slug: "besoin-de-calme",
    label: "Besoin de calme",
    headline: "Retrouver le silence",
    icon: Target,
    categorySlugs: ["meditation", "relaxation"],
    tint: "bg-mood-violet-bg text-mood-violet-fg",
  },
  {
    slug: "je-veux-mediter",
    label: "Je veux méditer",
    headline: "S'asseoir et respirer",
    icon: Brain,
    categorySlugs: ["meditation"],
    tint: "bg-mood-blue-bg text-mood-blue-fg",
  },
];

/**
 * Rendered last in the grid, spanning the remaining columns. Deliberately
 * has no coloured badge: it is the escape hatch out of the colour-coded
 * set, not another need in it.
 */
export const OTHER_MOOD = {
  label: "Autre besoin",
  href: "/explore",
  icon: Sparkles,
};

export function getMoodBySlug(slug: string) {
  return MOODS.find((mood) => mood.slug === slug) ?? null;
}
