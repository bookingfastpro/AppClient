"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function UserSearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [, startTransition] = useTransition();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => {
          router.push(`/admin/users?q=${encodeURIComponent(value)}`);
        });
      }}
      className="relative max-w-sm"
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-300" aria-hidden />
      <Input
        aria-label="Rechercher un utilisateur"
        placeholder="Rechercher par nom ou e-mail..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="rounded-pill py-2.5 pl-10 text-sm"
      />
    </form>
  );
}
