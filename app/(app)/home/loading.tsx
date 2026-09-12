import { Skeleton } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-64" />
      </section>

      <Skeleton className="aspect-[4/3] w-full rounded-lg sm:aspect-[21/9]" />

      <section className="flex flex-col gap-4">
        <Skeleton className="h-7 w-32" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-32 shrink-0 rounded-lg" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Skeleton className="h-7 w-40" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video w-64 shrink-0 rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  );
}
