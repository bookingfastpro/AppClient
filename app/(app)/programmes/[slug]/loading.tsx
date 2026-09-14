import { Skeleton } from "@/components/ui/Skeleton";

/**
 * The full-page counterpart to the modal's loading state. Mirrors the
 * page's own bleed so the cover's skeleton sits exactly where the cover
 * will.
 */
export default function ProgramLoading() {
  return (
    <div className="-mx-4 flex flex-col md:-mx-8">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />

      <div className="flex flex-col gap-5 px-4 pt-6 md:px-8">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="flex gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        <Skeleton className="h-12 w-full rounded-pill" />
      </div>

      <div className="flex flex-col gap-4 px-4 pt-8 md:px-8">
        <Skeleton className="h-7 w-28" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="aspect-[4/3] w-28 shrink-0 rounded-sm" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
