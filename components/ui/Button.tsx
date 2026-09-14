import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-sans font-semibold text-base transition-all duration-150 ease-[var(--ease-standard)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 disabled:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500",
  {
    variants: {
      variant: {
        primary:
          "bg-sage-600 text-cream hover:bg-sage-700 active:translate-y-0 hover:-translate-y-px",
        ghost:
          "bg-surface text-ink-900 border border-beige hover:bg-sand",
        premium:
          "bg-terracotta-500 text-cream hover:bg-terracotta-600",
        // Destructive confirmation only — the button that actually
        // deletes, never the one that opens the dialog asking about it.
        danger:
          "bg-error text-cream hover:brightness-95 focus-visible:outline-error",
      },
      size: {
        md: "h-12 px-7",
        sm: "h-11 px-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
