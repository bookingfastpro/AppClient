import { Skeleton } from "@/components/ui/Skeleton";

export default function ExploreLoading() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-[52px] w-full rounded-pill" />
      </div>

      <section className="flex flex-col gap-4">
        <Skeleton className="h-7 w-44" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video w-64 shrink-0 rounded-lg" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Skeleton className="h-7 w-28" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  );
}
