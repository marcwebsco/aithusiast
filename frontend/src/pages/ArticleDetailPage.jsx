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
      <div className="container-wide py-20 flex items-center gap-2 text-white/60 text-[13px]">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
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
      {/* Cover (shorter, less cinematic) */}
      <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
        <img src={article.cover} alt={article.title} className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(13,13,18,0.55) 0%, rgba(13,13,18,1) 100%)" }}
        />
        <div className="relative h-full container-narrow flex flex-col justify-end pb-10">
          <Link to="/articles" className="btn-ghost text-[12px] w-fit mb-4">
            <ArrowLeft className="h-3.5 w-3.5" /> All articles
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-tag">{formatCategory(article.category)}</span>
            <span className="text-[11px] text-white/45">· {article.reading_time} min read</span>
          </div>
          <h1
            data-testid="article-detail-title"
            className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight max-w-3xl leading-[1.05]"
          >
            {article.title}
          </h1>
          <p className="mt-3 text-white/65 text-base sm:text-[17px] max-w-2xl leading-relaxed">{article.deck}</p>
        </div>
      </div>

      {/* Body */}
      <div className="container-narrow pt-10 pb-16">
        <article data-testid="article-detail-content" className="max-w-[720px] mx-auto">
          {article.sections?.map((s, i) => (
            <section key={i} className="mb-8">
              <h2 className="font-display text-xl sm:text-2xl tracking-tight mb-2 leading-snug">{s.heading}</h2>
              <p className="text-white/75 text-[15.5px] leading-[1.75]">{s.body}</p>
            </section>
          ))}

          {article.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-1.5">
              {article.tags.map((t) => (
                <span key={t} className="badge-tag">{t}</span>
              ))}
            </div>
          )}
        </article>

        {tools.length > 0 && (
          <div className="mt-12">
            <p className="label-eyebrow mb-2">Mentioned</p>
            <h3 className="font-display text-2xl tracking-tight mb-5">Related tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
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
