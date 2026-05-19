import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ToolCard from "@/components/site/ToolCard";
import CategoryPills from "@/components/site/CategoryPills";
import HeroSearch from "@/components/site/HeroSearch";
import { apiGet, formatCategory } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function ToolsPage() {
  const [search, setSearchParams] = useSearchParams();
  const initialCategory = search.get("category") || null;
  const initialQ = search.get("q") || "";
  const [category, setCategory] = useState(initialCategory);
  const [q, setQ] = useState(initialQ);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 200 };
    if (category) params.category = category;
    if (q) params.q = q;
    apiGet("/tools", params)
      .then((d) => setTools(d))
      .finally(() => setLoading(false));
  }, [category, q]);

  const onCategory = (c) => {
    setCategory(c);
    const next = new URLSearchParams(search);
    if (c) next.set("category", c);
    else next.delete("category");
    setSearchParams(next, { replace: true });
  };

  const title = useMemo(() => {
    if (category) return formatCategory(category);
    return "All AI tools";
  }, [category]);

  return (
    <div className="container-wide py-12 lg:py-16">
      <p className="label-eyebrow mb-3">Catalog</p>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5">
        {title}
      </h1>
      <p className="text-white/60 text-base font-light max-w-2xl">
        Browse a curated library of the most useful AI tools. Filter by craft. Search by name.
      </p>

      <div className="mt-10">
        <HeroSearch size="compact" />
      </div>

      <div className="mt-8">
        <CategoryPills value={category} onChange={onCategory} dataTestid="tools-category-pill" />
      </div>

      <div className="mt-10" data-testid="tools-results-grid">
        {loading ? (
          <div className="flex items-center gap-2 text-white/60">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : tools.length === 0 ? (
          <p className="text-white/60">No tools match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {tools.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
