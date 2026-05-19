import { Link } from "react-router-dom";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { formatCategory } from "@/lib/api";

export default function TrendingRanking({ items, dense = false }) {
  if (!items?.length) return null;
  return (
    <div className="surface-card rounded-2xl overflow-hidden" data-testid="trending-ranking">
      {items.map((tool, i) => {
        const isTop3 = i < 3;
        return (
          <Link
            key={tool.id}
            to={`/tools/${tool.id}`}
            data-testid="trending-ranking-item"
            className={`group relative flex items-center gap-4 px-5 py-${dense ? 3 : 4} border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.025] transition-colors duration-200`}
          >
            {/* Rank */}
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 tabular font-display ${
                isTop3
                  ? "text-white border border-[#A855F7]/40"
                  : "text-white/55 border border-white/[0.06]"
              }`}
              style={isTop3 ? { background: "rgba(168,85,247,0.10)" } : { background: "rgba(255,255,255,0.02)" }}
            >
              <span className="text-[15px]">{tool.rank || i + 1}</span>
            </div>

            {/* Logo */}
            <div
              className="hidden sm:flex h-9 w-9 rounded-lg border border-white/10 items-center justify-center font-display text-sm flex-shrink-0"
              style={{ background: `${tool.accent || "#A855F7"}14` }}
            >
              {tool.name?.slice(0, 1)}
            </div>

            {/* Name + category + tagline */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h4 className="font-display text-[15.5px] tracking-tight truncate">{tool.name}</h4>
                <span className="hidden md:inline text-[10.5px] uppercase tracking-[0.18em] text-white/40">
                  {formatCategory(tool.category)}
                </span>
              </div>
              <p className="text-[13px] text-white/55 truncate">{tool.tagline}</p>
            </div>

            {/* Growth */}
            {tool.weekly_growth && (
              <div className="hidden sm:flex items-center gap-1 badge-growth">
                <TrendingUp className="h-3 w-3" />
                <span>{tool.weekly_growth}</span>
              </div>
            )}

            {/* Arrow */}
            <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-white transition-colors duration-200 flex-shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}
