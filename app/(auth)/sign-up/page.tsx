import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = { title: "Créer un compte" };

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline text-ink-900">Débutez votre pratique</h1>
        <p className="text-body text-ink-600">
          Créez un compte pour enregistrer vos favoris et débloquer les séances premium.
        </p>
      </div>
      <SignUpForm />
    </div>
  );
}
