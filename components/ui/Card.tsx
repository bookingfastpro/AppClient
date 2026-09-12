import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Three deliberately different treatments per DESIGN.md — featured hero,
 * standard carousel card, and a flatter compact list row. Never default
 * to one card shape everywhere (see "wall of identical cards" anti-reference).
 */
const cardVariants = cva("bg-surface", {
  variants: {
    variant: {
      featured: "rounded-xl overflow-hidden",
      standard: "rounded-lg overflow-hidden shadow-[var(--shadow-ambient-low)]",
      compact: "rounded-sm border-b border-beige bg-transparent",
    },
  },
  defaultVariants: {
    variant: "standard",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />;
}
