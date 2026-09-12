import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline text-ink-900">Définissez un nouveau mot de passe</h1>
        <p className="text-body text-ink-600">Choisissez un mot de passe que vous n&apos;avez pas déjà utilisé.</p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
