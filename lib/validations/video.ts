import { z } from "zod";

export const videoFormSchema = z.object({
  youtubeUrl: z.string().trim().min(1, "Collez un lien YouTube ou un identifiant de vidéo"),
  title: z.string().trim().min(1, "Le titre est requis").max(200),
  description: z.string().trim().min(1, "La description est requise").max(2000),
  categoryId: z.string().uuid("Choisissez une catégorie"),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  instructor: z.string().trim().min(1, "L'instructeur est requis").max(120),
  durationMinutes: z.coerce.number().int().positive("Indiquez une durée en minutes"),
  isPremium: z.coerce.boolean().optional().default(false),
});

export type VideoFormValues = z.infer<typeof videoFormSchema>;
