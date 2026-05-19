import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatCategory } from "@/lib/api";

export default function ToolCard({ tool, reason, compact = false, rank, ...rest }) {
  if (!tool) return null;
  return (
    <Link
      to={`/tools/${tool.id}`}
      data-testid="tool-card"
      className={`surface-card group relative rounded-2xl p-5 block`}
      {...rest}
    >
      <div className="relative flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-xl flex-shrink-0 border border-white/10 flex items-center justify-center text-sm font-display"
          style={{ background: `${tool.accent || "#A855F7"}14` }}
        >
          {tool.name?.slice(0, 1)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 data-testid="tool-card-title" className="font-display text-[17px] leading-tight truncate">
              {tool.name}
            </h3>
            {rank ? (
              <span className="text-[11px] text-white/45 uppercase tracking-[0.18em] tabular">#{rank}</span>
            ) : (
              <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-white/80 transition-colors duration-200 flex-shrink-0" />
            )}
          </div>
          <p className="label-eyebrow mt-0.5 text-[10px]">{formatCategory(tool.category)}</p>
        </div>
      </div>

      <p className="mt-3 text-white/75 text-[13.5px] leading-relaxed line-clamp-2">
        {tool.tagline}
      </p>

      {reason && (
        <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="label-eyebrow mb-1 text-[10px]">Why this fits</p>
          <p className="text-white/75 text-xs leading-relaxed line-clamp-3">{reason}</p>
        </div>
      )}

      {!compact && tool.tags?.length > 0 && (
        <div data-testid="tool-card-tags" className="mt-3 flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map((t) => (
            <span key={t} className="badge-tag">{t}</span>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">{tool.pricing}</span>
        <span
          data-testid="tool-card-explore-button"
          className="text-[12px] text-white/65 group-hover:text-white transition-colors flex items-center gap-1"
        >
          Explore <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
