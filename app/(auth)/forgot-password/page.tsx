import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Réinitialiser le mot de passe" };

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline text-ink-900">Réinitialisez votre mot de passe</h1>
        <p className="text-body text-ink-600">
          Nous vous enverrons un lien par e-mail pour vous reconnecter.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
