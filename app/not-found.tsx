import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
      <p className="text-label text-ink-300">404</p>
      <h1 className="text-headline text-ink-900">Cette page s&apos;est égarée.</h1>
      <p className="text-body max-w-sm text-ink-600">
        La page que vous cherchez n&apos;existe pas, ou a été déplacée.
      </p>
      <Link href="/home" className={buttonVariants({ variant: "primary" })}>
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
