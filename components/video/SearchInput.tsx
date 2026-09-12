"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [, startTransition] = useTransition();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => {
          router.push(`/search?q=${encodeURIComponent(value)}`);
        });
      }}
      className="relative"
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-300" aria-hidden />
      <Input
        aria-label="Rechercher des séances"
        placeholder="Rechercher yoga, méditation, sommeil..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="rounded-pill pl-12"
      />
    </form>
  );
}
