import { Skeleton } from "@/components/ui/Skeleton";

export default function VideoDetailLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="size-11 shrink-0 rounded-pill" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
