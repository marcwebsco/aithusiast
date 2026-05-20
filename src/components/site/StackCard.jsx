import { Link } from "react-router-dom";
import { ArrowUpRight, Layers } from "lucide-react";

export default function StackCard({ stack }) {
  return (
    <Link
      to={`/stacks/${stack.slug}`}
      data-testid="stack-card"
      className="surface-card group relative rounded-2xl p-5 block"
    >
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center"
          style={{ background: "rgba(168, 85, 247, 0.10)" }}
        >
          <Layers className="h-4 w-4 text-[#A855F7]" />
        </div>
        <div className="flex-1">
          <p className="label-eyebrow text-[10px]">Stack · {stack.persona}</p>
          <h3 data-testid="stack-card-title" className="font-display text-[17px] leading-tight tracking-tight">
            {stack.title}
          </h3>
        </div>
      </div>
      <p className="mt-3 text-white/55 text-[13px] leading-relaxed line-clamp-2">
        {stack.rationale}
      </p>
      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {stack.tool_ids.slice(0, 5).map((id, idx) => (
            <div
              key={id}
              className="h-6 w-6 rounded-full border border-[hsl(var(--surface-1))] bg-white/[0.06] flex items-center justify-center text-[10px] font-display"
              style={{ zIndex: 10 - idx }}
              title={id}
            >
              {id?.slice(0, 1).toUpperCase()}
            </div>
          ))}
          <div className="h-6 w-6 rounded-full border border-[hsl(var(--surface-1))] bg-white/[0.03] flex items-center justify-center text-[9px] text-white/55 tabular">
            {stack.tool_ids.length}
          </div>
        </div>
        <span className="text-[12px] text-white/65 group-hover:text-white transition-colors flex items-center gap-1">
          Open <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
