import { CATEGORY_ORDER, formatCategory } from "@/lib/api";

export default function CategoryPills({ value, onChange, includeAll = true, dataTestid = "category-pill" }) {
  return (
    <div className="flex flex-wrap gap-2">
      {includeAll && (
        <button
          data-testid={`${dataTestid}-all`}
          onClick={() => onChange(null)}
          data-active={!value}
          className="glass-pill text-[11px] uppercase tracking-[0.22em]"
        >
          All
        </button>
      )}
      {CATEGORY_ORDER.map((c) => (
        <button
          key={c}
          data-testid={dataTestid}
          onClick={() => onChange(c)}
          data-active={value === c}
          className="glass-pill text-[11px] uppercase tracking-[0.22em]"
        >
          {formatCategory(c)}
        </button>
      ))}
    </div>
  );
}
