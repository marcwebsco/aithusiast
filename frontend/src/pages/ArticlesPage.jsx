import { useEffect, useState } from "react";
import ArticleCard from "@/components/site/ArticleCard";
import CategoryPills from "@/components/site/CategoryPills";
import { apiGet } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGet("/articles", { limit: 50 })
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  const filtered = category ? articles.filter((a) => a.category === category) : articles;

  return (
    <div className="container-wide py-12 lg:py-16">
      <p className="label-eyebrow mb-3">Editorial</p>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4">
        Short, premium, useful.
      </h1>
      <p className="text-white/60 text-base font-light max-w-2xl">
        AI editorial worth your scroll. Visual, opinionated, and refreshingly brief.
      </p>

      <div className="mt-10">
        <CategoryPills value={category} onChange={setCategory} dataTestid="articles-category-pill" />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex items-center gap-2 text-white/60">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-white/60">No articles in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filtered.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
