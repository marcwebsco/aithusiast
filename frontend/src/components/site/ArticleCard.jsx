import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatCategory } from "@/lib/api";

export default function ArticleCard({ article, featured = false }) {
  if (!article) return null;
  return (
    <Link
      to={`/articles/${article.slug}`}
      data-testid="article-card"
      className={`group relative overflow-hidden rounded-[36px] bg-white/[0.04] border border-white/[0.10] backdrop-blur-xl block ${
        featured ? "col-span-1 md:col-span-2" : ""
      }`}
      style={{ boxShadow: "var(--shadow-elev)" }}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={article.cover}
          alt={article.title}
          className="h-full w-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.02] transition-all duration-700 ease-out"
        />
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,1,10,0) 0%, rgba(5,1,10,0.85) 100%)",
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="label-eyebrow bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
            {formatCategory(article.category)}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 data-testid="article-card-title" className="font-display text-xl lg:text-2xl leading-tight">
          {article.title}
        </h3>
        <p className="mt-2 text-white/65 text-sm font-light leading-relaxed line-clamp-2">
          {article.deck}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.22em] text-white/40">
            {article.reading_time} min read
          </span>
          <span data-testid="article-card-open-link" className="text-xs text-white/80 flex items-center gap-1">
            Read <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
