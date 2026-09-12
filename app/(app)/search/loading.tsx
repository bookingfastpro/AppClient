import { Skeleton } from "@/components/ui/Skeleton";

export default function SearchLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-[52px] w-full rounded-pill" />
    </div>
  );
}
