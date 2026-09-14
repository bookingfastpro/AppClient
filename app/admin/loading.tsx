import { Skeleton } from "@/components/ui/Skeleton";

/**
 * One boundary for the whole admin section. The pages differ in shape,
 * but they all open with a title and then a list or a form, so a generic
 * placeholder is honest here — and it is what lets a navigation feel
 * immediate instead of hanging on the previous screen while the next
 * one's queries run.
 */
export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-11 w-40 rounded-pill" />
      </div>

      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
