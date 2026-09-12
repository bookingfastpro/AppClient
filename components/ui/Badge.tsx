import { type HTMLAttributes } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function PremiumBadge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill bg-terracotta-500/90 px-2.5 py-1 text-label text-cream shadow-[var(--shadow-ambient-low)] backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      <Lock className="size-3" aria-hidden />
      Premium
    </span>
  );
}

export function CategoryChip({
  active,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-150",
        active ? "bg-sage-600 text-cream" : "bg-sand text-ink-900",
        className,
      )}
      {...props}
    />
  );
}
