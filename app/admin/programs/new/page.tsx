import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProgramForm } from "@/components/admin/ProgramForm";

export default function NewProgramPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link
        href="/admin/programs"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Programmes
      </Link>
      <h1 className="text-headline text-ink-900">Nouveau programme</h1>
      <p className="text-body text-ink-600">
        Créez le programme d&apos;abord, puis ajoutez-y des séances dans l&apos;ordre.
      </p>
      <ProgramForm />
    </div>
  );
}
