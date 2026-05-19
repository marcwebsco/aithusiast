import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, formatCategory } from "@/lib/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import ToolCard from "@/components/site/ToolCard";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGet(`/articles/${slug}`)
      .then(async (a) => {
        setArticle(a);
        if (a.related_tool_ids?.length) {
          const fetched = await Promise.all(
            a.related_tool_ids.map((id) => apiGet(`/tools/${id}`).catch(() => null))
          );
          setTools(fetched.filter(Boolean));
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-wide py-20 flex items-center gap-2 text-white/60">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }
  if (!article) {
    return (
      <div className="container-wide py-20">
        <p className="text-white/60">Article not found.</p>
        <Link to="/articles" className="btn-ghost mt-4">Back to articles</Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Cover */}
      <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
        <img src={article.cover} alt={article.title} className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(5,1,10,0.4) 0%, rgba(5,1,10,1) 100%)" }}
        />
        <div className="relative h-full container-narrow flex flex-col justify-end pb-16">
          <Link to="/articles" className="btn-ghost text-xs w-fit mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> All articles
          </Link>
          <p className="label-eyebrow mb-3">{formatCategory(article.category)} · {article.reading_time} min</p>
          <h1
            data-testid="article-detail-title"
            className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight max-w-3xl leading-[1.05]"
          >
            {article.title}
          </h1>
          <p className="mt-4 text-white/70 text-lg font-light max-w-2xl leading-relaxed">{article.deck}</p>
        </div>
      </div>

      {/* Body */}
      <div className="container-narrow pt-12 pb-20">
        <article data-testid="article-detail-content" className="max-w-[760px] mx-auto">
          {article.sections?.map((s, i) => (
            <section key={i} className="mb-10">
              <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-3 leading-tight">{s.heading}</h2>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed font-light">{s.body}</p>
            </section>
          ))}

          {article.tags?.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <span key={t} className="badge-tag">{t}</span>
              ))}
            </div>
          )}
        </article>

        {tools.length > 0 && (
          <div className="mt-16">
            <p className="label-eyebrow mb-3">Mentioned in this piece</p>
            <h3 className="font-display text-3xl tracking-tight mb-6">Related tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {tools.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
