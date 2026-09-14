import { Skeleton } from "@/components/ui/Skeleton";

export default function BesoinLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-5 w-24" />

      <div className="flex flex-col gap-3">
        <Skeleton className="size-14 rounded-pill" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
