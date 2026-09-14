import { Skeleton } from "@/components/ui/Skeleton";

export default function PracticeLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-7 w-40" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
