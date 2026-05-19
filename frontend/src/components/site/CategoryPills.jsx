import { CATEGORY_ORDER, formatCategory } from "@/lib/api";

export default function CategoryPills({ value, onChange, includeAll = true, dataTestid = "category-pill" }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {includeAll && (
        <button
          data-testid={`${dataTestid}-all`}
          onClick={() => onChange(null)}
          data-active={!value}
          className="pill pill-sm"
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
          className="pill pill-sm"
        >
          {formatCategory(c)}
        </button>
      ))}
    </div>
  );
}
