import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ToolCard from "@/components/site/ToolCard";
import CategoryPills from "@/components/site/CategoryPills";
import HeroSearch from "@/components/site/HeroSearch";
import { ToolCardSkeleton } from "@/components/site/Skeleton";
import { apiGet, formatCategory } from "@/lib/api";
import { useSEO } from "@/lib/seo";

export default function ToolsPage() {
  const [search, setSearchParams] = useSearchParams();
  const initialCategory = search.get("category") || null;
  const initialQ = search.get("q") || "";
  const [category, setCategory] = useState(initialCategory);
  const [q] = useState(initialQ);
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

  useSEO({
    title: category ? `Best ${formatCategory(category)} AI tools` : "All AI tools",
    description: category
      ? `Discover the best ${formatCategory(category)} AI tools — ranked, compared and curated by AIthusiast.`
      : "Browse 68+ curated AI tools across 10 categories. Filter, search and compare — ranked by AIthusiast.",
  });

  return (
    <div className="container-wide py-10 lg:py-14">
      <p className="label-eyebrow mb-2">Catalog</p>
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3">{title}</h1>
      <p className="text-white/55 text-[14px] max-w-2xl">
        Browse a curated library of the most useful AI tools. Filter by craft. Search by name or use case.
      </p>

      <div className="mt-8">
        <HeroSearch size="compact" showChips={false} />
      </div>

      <div className="mt-6">
        <CategoryPills value={category} onChange={onCategory} dataTestid="tools-category-pill" />
      </div>

      <div className="mt-8" data-testid="tools-results-grid">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {Array.from({ length: 9 }).map((_, i) => <ToolCardSkeleton key={i} />)}
          </div>
        ) : tools.length === 0 ? (
          <p className="text-white/60 text-[14px]">No tools match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {tools.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
