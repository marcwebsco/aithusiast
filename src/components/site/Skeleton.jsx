/**
 * Skeleton primitives — used to improve perceived speed on data fetches.
 */
export function Skeleton({ className = "", style = {} }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/[0.03] rounded-md ${className}`}
      style={style}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0) 70%)",
          backgroundSize: "200% 100%",
          animation: "sk-shimmer 1.6s linear infinite",
        }}
      />
      <style>{`@keyframes sk-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </div>
  );
}

export function ToolCardSkeleton() {
  return (
    <div className="surface-card rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="!rounded-xl" style={{ width: 40, height: 40 }} />
        <div className="flex-1">
          <Skeleton style={{ width: "55%", height: 14 }} />
          <Skeleton className="mt-2" style={{ width: "35%", height: 10 }} />
        </div>
      </div>
      <Skeleton className="mt-4" style={{ width: "95%", height: 12 }} />
      <Skeleton className="mt-2" style={{ width: "75%", height: 12 }} />
      <div className="mt-4 flex gap-1.5">
        <Skeleton style={{ width: 50, height: 16 }} />
        <Skeleton style={{ width: 60, height: 16 }} />
        <Skeleton style={{ width: 45, height: 16 }} />
      </div>
      <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between">
        <Skeleton style={{ width: 40, height: 10 }} />
        <Skeleton style={{ width: 50, height: 10 }} />
      </div>
    </div>
  );
}

export function RankingRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.05] last:border-b-0">
      <Skeleton className="!rounded-lg" style={{ width: 36, height: 36 }} />
      <Skeleton className="!rounded-lg" style={{ width: 36, height: 36 }} />
      <div className="flex-1">
        <Skeleton style={{ width: "40%", height: 13 }} />
        <Skeleton className="mt-2" style={{ width: "70%", height: 11 }} />
      </div>
      <Skeleton style={{ width: 56, height: 18 }} />
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="surface-card rounded-2xl overflow-hidden">
      <Skeleton className="!rounded-none" style={{ width: "100%", aspectRatio: "16/9" }} />
      <div className="p-5">
        <Skeleton style={{ width: "85%", height: 16 }} />
        <Skeleton className="mt-2" style={{ width: "95%", height: 12 }} />
        <Skeleton className="mt-1" style={{ width: "60%", height: 12 }} />
      </div>
    </div>
  );
}

export function StackCardSkeleton() {
  return (
    <div className="surface-card rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="!rounded-lg" style={{ width: 36, height: 36 }} />
        <div className="flex-1">
          <Skeleton style={{ width: "40%", height: 10 }} />
          <Skeleton className="mt-1.5" style={{ width: "75%", height: 14 }} />
        </div>
      </div>
      <Skeleton className="mt-3" style={{ width: "95%", height: 12 }} />
      <Skeleton className="mt-1" style={{ width: "75%", height: 12 }} />
    </div>
  );
}
