import { Skeleton } from "@/components/ui/Skeleton";

export default function AccountLoading() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-9 w-40" />

      <div className="flex flex-col gap-3 rounded-lg border border-beige bg-surface p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
