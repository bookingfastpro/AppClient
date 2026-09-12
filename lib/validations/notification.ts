import { z } from "zod";

export const notificationFormSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis").max(120),
  body: z.string().trim().min(1, "Le message est requis").max(500),
});
