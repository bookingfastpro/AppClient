import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().min(1, "L'e-mail est requis").email("Saisissez un e-mail valide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const signUpSchema = z.object({
  fullName: z.string().trim().min(1, "Le nom est requis").max(100),
  email: z.string().trim().min(1, "L'e-mail est requis").email("Saisissez un e-mail valide"),
  password: z.string().min(8, "Utilisez au moins 8 caractères"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "L'e-mail est requis").email("Saisissez un e-mail valide"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Utilisez au moins 8 caractères"),
});
