import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { formatCategory } from "@/lib/api";

export default function ToolCard({ tool, reason, compact = false, rank, ...rest }) {
  if (!tool) return null;
  const radius = compact ? "rounded-[34px]" : "rounded-[44px]";
  return (
    <Link
      to={`/tools/${tool.id}`}
      data-testid="tool-card"
      className={`group relative ${radius} overflow-hidden bg-white/[0.05] border border-white/[0.10] backdrop-blur-xl p-5 lg:p-6 block`}
      style={{ boxShadow: "var(--shadow-elev)" }}
      {...rest}
    >
      {/* Edge reflection */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(900px 220px at 20% 0%, rgba(255,255,255,0.10), transparent 55%)",
        }}
      />
      {/* Accent glow corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: `radial-gradient(closest-side, ${tool.accent || "#A855F7"}55, transparent 65%)` }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-2xl border border-white/15 bg-white/[0.06] flex items-center justify-center text-sm font-display"
            style={{ boxShadow: `inset 0 0 24px ${tool.accent || "#A855F7"}22` }}
          >
            {tool.name?.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 data-testid="tool-card-title" className="font-display text-lg leading-tight">
                {tool.name}
              </h3>
              {tool.trending && (
                <span title="Trending" className="text-[10px] uppercase tracking-[0.2em] text-[#A855F7] flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Hot
                </span>
              )}
            </div>
            <p className="label-eyebrow mt-1">{formatCategory(tool.category)}</p>
          </div>
        </div>
        {rank ? (
          <div className="flex items-center gap-1 text-[11px] text-white/50 uppercase tracking-[0.18em]">
            <Star className="h-3 w-3 text-[#A855F7]" /> #{rank}
          </div>
        ) : (
          <ArrowUpRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors duration-300" />
        )}
      </div>

      <p className="relative mt-4 text-white/80 text-sm leading-relaxed font-light">
        {tool.tagline}
      </p>
      {!compact && (
        <p className="relative mt-2 text-white/55 text-sm leading-relaxed font-light line-clamp-3">
          {tool.description}
        </p>
      )}

      {reason && (
        <div className="relative mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <p className="label-eyebrow mb-1">Why this fits</p>
          <p className="text-white/80 text-xs leading-relaxed">{reason}</p>
        </div>
      )}

      {!compact && tool.strengths?.length > 0 && (
        <ul className="relative mt-4 grid grid-cols-1 gap-1.5">
          {tool.strengths.slice(0, 3).map((s) => (
            <li key={s} className="flex items-start gap-2 text-white/70 text-xs">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7]" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}

      {tool.tags?.length > 0 && (
        <div data-testid="tool-card-tags" className="relative mt-4 flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 4).map((t) => (
            <span key={t} className="badge-tag">{t}</span>
          ))}
        </div>
      )}

      <div className="relative mt-5 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/40">{tool.pricing}</span>
        <span data-testid="tool-card-explore-button" className="text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1">
          Explore <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
