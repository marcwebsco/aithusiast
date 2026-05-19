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
    <div className="container-wide py-10 lg:py-14">
      <p className="label-eyebrow mb-2">Editorial</p>
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3">
        Short, premium, useful.
      </h1>
      <p className="text-white/55 text-[14px] max-w-2xl">
        Quick AI insights, comparisons and workflows — designed to help you pick the right tool faster.
      </p>

      <div className="mt-8">
        <CategoryPills value={category} onChange={setCategory} dataTestid="articles-category-pill" />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex items-center gap-2 text-white/60 text-[13px]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-white/60 text-[14px]">No articles in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {filtered.map((a) => (
              <ArticleCard key={a.id} article={a} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
