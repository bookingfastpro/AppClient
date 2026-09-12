import { Skeleton } from "@/components/ui/Skeleton";

export default function FavoritesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-9 w-32" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-sm py-3">
            <Skeleton className="size-16 shrink-0 rounded-sm" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
