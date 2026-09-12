import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SignInSplash } from "@/components/auth/SignInSplash";

export const metadata: Metadata = { title: "Se connecter" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-forest-900 sm:p-10">
      {/*
        Desktop-only ambient backdrop: the same photo, blurred and dimmed,
        bleeding past the card's edges so wide viewports read as a
        considered scene rather than a mobile screen floating in a void.
        Hidden below the sm breakpoint, where the card already fills the
        viewport.
      */}
      <Image
        src="/sign-in-hero.webp"
        alt=""
        fill
        aria-hidden
        className="hidden scale-110 object-cover opacity-40 blur-2xl sm:block"
      />
      <div className="absolute inset-0 hidden bg-forest-900/55 sm:block" />

      <div className="relative flex min-h-svh w-full max-w-md flex-col overflow-hidden bg-forest-900 sm:min-h-0 sm:aspect-[9/19] sm:max-h-[calc(100svh-5rem)] sm:rounded-2xl sm:shadow-[var(--shadow-ambient-lg)]">
        <Image
          src="/sign-in-hero.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 640px) 448px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/35 via-transparent to-forest-900/80" />

        <div className="relative z-10 flex flex-col items-center gap-3 px-6 pt-[max(4rem,var(--safe-area-top))] text-center">
          <Link href="/" className="font-display text-4xl font-semibold text-cream sm:text-5xl">
            Yogella
          </Link>
          <p className="text-label text-cream/90">
            UNE PRATIQUE PLUS DOUCE
            <br />
            UN ESPRIT PLUS LÉGER
          </p>
        </div>

        <SignInSplash next={next} />
      </div>
    </div>
  );
}
