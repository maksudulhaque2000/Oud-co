import { TableSkeleton } from "@/components/LoadingSkeletons";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <div className="space-y-3">
        <div className="h-8 w-52 animate-pulse rounded-full bg-gradient-to-r from-[#1b130c] via-[#2b1f17] to-[#1b130c]" />
        <div className="h-4 w-80 animate-pulse rounded-full bg-gradient-to-r from-[#1b130c] via-[#2b1f17] to-[#1b130c]" />
      </div>
      <TableSkeleton rows={4} columns={6} />
    </main>
  );
}
