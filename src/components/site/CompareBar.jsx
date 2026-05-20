import { Link } from "react-router-dom";
import { X, GitCompareArrows, Trash2 } from "lucide-react";
import { useCompare } from "@/lib/compare";

export default function CompareBar() {
  const { ids, remove, clear, max } = useCompare();
  if (ids.length === 0) return null;

  return (
    <div
      data-testid="compare-bar"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-[760px]"
    >
      <div className="glass-panel rounded-full px-3 py-2 flex items-center gap-2 shadow-[var(--shadow-search)]">
        <div className="flex items-center gap-1.5 pl-1">
          <GitCompareArrows className="h-4 w-4 text-[#A855F7]" />
          <span className="text-[12px] uppercase tracking-[0.18em] text-white/55 hidden sm:inline">
            Compare
          </span>
          <span className="text-[12px] text-white/70 ml-1 tabular">
            {ids.length}/{max}
          </span>
        </div>

        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto px-2 no-scrollbar">
          {ids.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => remove(id)}
              className="pill pill-sm group whitespace-nowrap"
              title={`Remove ${id}`}
              data-testid="compare-bar-chip"
            >
              <span className="truncate max-w-[120px]">{id}</span>
              <X className="h-3 w-3 text-white/40 group-hover:text-white" />
            </button>
          ))}
        </div>

        <button
          onClick={clear}
          title="Clear"
          className="btn-ghost px-2.5 py-1.5 text-[12px]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>

        <Link
          data-testid="compare-bar-open"
          to={`/compare?ids=${encodeURIComponent(ids.join(","))}`}
          className="btn-primary px-3.5 py-1.5 text-[12px]"
        >
          Compare
          <GitCompareArrows className="h-3.5 w-3.5" />
        </Link>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
