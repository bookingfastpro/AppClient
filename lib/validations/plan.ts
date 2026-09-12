import { z } from "zod";

export const planDetailsSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis").max(120),
  description: z.string().trim().min(1, "La description est requise").max(500),
  features: z.string().trim().max(2000).optional().default(""),
});

export const newPriceSchema = z.object({
  amount: z.coerce.number().positive("Indiquez un montant en euros"),
  interval: z.enum(["month", "year"]),
});
