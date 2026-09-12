import { z } from "zod";

export const programFormSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis").max(120),
  subtitle: z.string().trim().max(300).optional().default(""),
  description: z.string().trim().max(2000).optional().default(""),
  level: z.string().trim().max(60).optional().default(""),
  published: z.boolean().optional().default(true),
});

export type ProgramFormValues = z.infer<typeof programFormSchema>;
