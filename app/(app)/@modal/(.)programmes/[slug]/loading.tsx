import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Shown inside the already-open dialog while the programme is fetched.
 *
 * Two things come from this file. The obvious one is that the modal now
 * appears the instant it is tapped, instead of after a round trip to the
 * database. The less obvious one is prefetching: Next only prefetches a
 * dynamic route up to its nearest loading boundary, so without this file
 * there was nothing to prefetch and every open paid the full wait.
 *
 * The shape mirrors ProgramDetail so nothing jumps when the real content
 * replaces it.
 */
export default function InterceptedProgramLoading() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />

      <div className="flex flex-col gap-5 px-4 pt-6 md:px-8">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="flex gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        <Skeleton className="h-12 w-full rounded-pill" />
      </div>

      <div className="flex flex-col gap-4 px-4 pt-8 md:px-8">
        <Skeleton className="h-6 w-28" />
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
