import { Link } from "react-router-dom";
import { ArrowUpRight, Layers } from "lucide-react";

export default function StackCard({ stack }) {
  return (
    <Link
      to={`/stacks/${stack.slug}`}
      data-testid="stack-card"
      className="group relative overflow-hidden rounded-[40px] bg-white/[0.04] border border-white/[0.10] backdrop-blur-xl p-6 block"
      style={{ boxShadow: "var(--shadow-elev)" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(168,85,247,0.45), transparent 70%)" }}
      />
      <div className="relative flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl border border-white/15 bg-white/[0.06] flex items-center justify-center">
          <Layers className="h-5 w-5 text-[#A855F7]" />
        </div>
        <div>
          <p className="label-eyebrow">Curated stack · {stack.persona}</p>
          <h3 data-testid="stack-card-title" className="font-display text-2xl leading-tight">{stack.title}</h3>
        </div>
      </div>
      <p className="relative mt-4 text-white/70 text-sm font-light leading-relaxed line-clamp-3">
        {stack.rationale}
      </p>
      <div className="relative mt-5 flex items-center justify-between">
        <div className="flex -space-x-2">
          {stack.tool_ids.slice(0, 5).map((id, idx) => (
            <div
              key={id}
              className="h-8 w-8 rounded-full border border-white/20 bg-white/[0.08] flex items-center justify-center text-[11px] font-display"
              style={{ zIndex: 10 - idx }}
              title={id}
            >
              {id?.slice(0, 1).toUpperCase()}
            </div>
          ))}
        </div>
        <span className="text-xs text-white/80 flex items-center gap-1">
          View stack <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
