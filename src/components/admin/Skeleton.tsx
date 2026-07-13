export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/[0.04] rounded-xl ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="w-48 h-8 rounded-lg mb-2" />
        <Skeleton className="w-72 h-4 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <Skeleton className="w-32 h-5 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-xl" />
          <Skeleton className="w-full h-40 rounded-xl" />
          <Skeleton className="w-24 h-10 rounded-xl" />
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <Skeleton className="w-32 h-5 rounded-lg" />
          <Skeleton className="w-full h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="w-48 h-8 rounded-lg mb-2" />
          <Skeleton className="w-72 h-4 rounded-lg" />
        </div>
        <Skeleton className="w-32 h-10 rounded-xl" />
      </div>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <Skeleton className="w-full h-8 rounded-lg" />
        </div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-4 py-3 border-b border-white/[0.04] last:border-0">
            <Skeleton className="w-full h-12 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Skeleton className="w-48 h-8 rounded-lg mb-2" />
        <Skeleton className="w-72 h-4 rounded-lg" />
      </div>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <div className="space-y-2">
          <Skeleton className="w-20 h-4 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-20 h-4 rounded-lg" />
          <Skeleton className="w-full h-40 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-20 h-4 rounded-lg" />
          <Skeleton className="w-32 h-20 rounded-xl" />
          <Skeleton className="w-24 h-8 rounded-lg" />
        </div>
        <Skeleton className="w-24 h-10 rounded-xl" />
      </div>
    </div>
  );
}
