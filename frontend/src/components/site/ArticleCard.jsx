import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatCategory } from "@/lib/api";

export default function ArticleCard({ article, compact = false }) {
  if (!article) return null;
  return (
    <Link
      to={`/articles/${article.slug}`}
      data-testid="article-card"
      className="surface-card group relative overflow-hidden rounded-2xl block"
    >
      <div className={`relative overflow-hidden ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        <img
          src={article.cover}
          alt={article.title}
          className="h-full w-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-[1.02] transition-all duration-500 ease-out"
        />
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(13,13,18,0) 30%, rgba(13,13,18,0.85) 100%)" }}
        />
        <div className="absolute top-3 left-3">
          <span className="badge-tag bg-black/40 backdrop-blur-md">
            {formatCategory(article.category)}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 data-testid="article-card-title" className="font-display text-[17px] lg:text-[18px] leading-tight tracking-tight">
          {article.title}
        </h3>
        <p className="mt-1.5 text-white/55 text-[13px] leading-relaxed line-clamp-2">
          {article.deck}
        </p>
        <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">
            {article.reading_time} min read
          </span>
          <span data-testid="article-card-open-link" className="text-[12px] text-white/65 flex items-center gap-1 group-hover:text-white transition-colors">
            Read <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
