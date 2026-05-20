import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, formatCategory } from "@/lib/api";
import { useCompare } from "@/lib/compare";
import { useSEO } from "@/lib/seo";
import { ArrowLeft, ArrowUpRight, Loader2, Sparkles, TrendingUp, GitCompareArrows, Check } from "lucide-react";
import ToolCard from "@/components/site/ToolCard";
import ToolLogo from "@/components/site/ToolLogo";

export default function ToolDetailPage() {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const { has, toggle } = useCompare();

  useEffect(() => {
    setLoading(true);
    Promise.all([apiGet(`/tools/${id}`), apiGet(`/tools/${id}/similar`)])
      .then(([t, s]) => {
        setTool(t);
        setSimilar(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useSEO(
    tool
      ? {
          title: `${tool.name} — ${tool.tagline}`,
          description: tool.description,
          image: tool.cover || tool.logo,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": tool.name,
            "description": tool.description,
            "applicationCategory": formatCategory(tool.category),
            "operatingSystem": "Web",
            "url": tool.url,
            "image": tool.logo,
          },
        }
      : { title: "Tool" }
  );

  if (loading) {
    return (
      <div className="container-wide py-20 flex items-center gap-2 text-white/60 text-[13px]">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading tool…
      </div>
    );
  }
  if (!tool) {
    return (
      <div className="container-wide py-20">
        <p className="text-white/60">Tool not found.</p>
        <Link to="/tools" className="btn-ghost mt-4">Back to tools</Link>
      </div>
    );
  }

  const inCompare = has(tool.id);

  return (
    <div className="container-wide py-10 lg:py-14">
      <Link to="/tools" className="btn-ghost text-[12px] mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> All tools
      </Link>

      <div data-testid="tool-detail-hero" className="surface-card relative rounded-2xl p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-8">
          <ToolLogo tool={tool} size={72} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="badge-tag">{formatCategory(tool.category)}</span>
              <span className="badge-tag capitalize">{tool.pricing}</span>
              {tool.rank && (
                <span className="badge-tag !text-[#C4B5FD] !border-[#A855F7]/30 !bg-[#A855F7]/[0.10]">#{tool.rank} trending</span>
              )}
              {tool.weekly_growth && (
                <span className="badge-growth"><TrendingUp className="h-3 w-3" /> {tool.weekly_growth}</span>
              )}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight">{tool.name}</h1>
            <p className="mt-2 text-white/65 text-[16px] max-w-2xl leading-relaxed">{tool.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={tool.url || "#"}
              target="_blank"
              rel="noreferrer noopener"
              data-testid="tool-detail-visit-button"
              className="btn-primary"
            >
              <ArrowUpRight className="h-4 w-4" /> Visit
            </a>
            <button
              onClick={() => toggle(tool.id)}
              data-testid="tool-detail-compare-toggle"
              className="btn-ghost"
            >
              {inCompare ? <Check className="h-3.5 w-3.5" /> : <GitCompareArrows className="h-3.5 w-3.5" />}
              {inCompare ? "Added to compare" : "Add to compare"}
            </button>
            <Link to={`/search?q=${encodeURIComponent("alternatives to " + tool.name)}`} className="btn-ghost">
              <Sparkles className="h-3.5 w-3.5" /> Alternatives
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <section className="surface-card rounded-2xl p-6">
            <p className="label-eyebrow mb-3">Overview</p>
            <p className="text-white/80 text-[15px] leading-relaxed">{tool.description}</p>
          </section>

          {tool.strengths?.length > 0 && (
            <section className="surface-card rounded-2xl p-6">
              <p className="label-eyebrow mb-3">Strengths</p>
              <ul className="grid sm:grid-cols-2 gap-2.5">
                {tool.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-[#A855F7] flex-shrink-0" />
                    <span className="text-white/80 text-[14px] leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="surface-card rounded-2xl p-5">
            <p className="label-eyebrow mb-3">Quick facts</p>
            <dl className="space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-white/45">Category</dt>
                <dd className="text-white">{formatCategory(tool.category)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/45">Pricing</dt>
                <dd className="text-white capitalize">{tool.pricing}</dd>
              </div>
              {tool.rank && (
                <div className="flex justify-between">
                  <dt className="text-white/45">Trending rank</dt>
                  <dd className="text-white tabular">#{tool.rank}</dd>
                </div>
              )}
              {tool.weekly_growth && (
                <div className="flex justify-between">
                  <dt className="text-white/45">Weekly growth</dt>
                  <dd className="text-emerald-300 tabular">{tool.weekly_growth}</dd>
                </div>
              )}
              {tool.popularity > 0 && (
                <div className="flex justify-between">
                  <dt className="text-white/45">Popularity</dt>
                  <dd className="text-white tabular">{tool.popularity}/100</dd>
                </div>
              )}
            </dl>
          </section>

          {tool.tags?.length > 0 && (
            <section className="surface-card rounded-2xl p-5">
              <p className="label-eyebrow mb-3">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map((t) => (
                  <span key={t} className="badge-tag">{t}</span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-12">
          <p className="label-eyebrow mb-2">Similar tools</p>
          <h2 className="font-display text-2xl lg:text-3xl tracking-tight mb-5">More in {formatCategory(tool.category)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {similar.slice(0, 6).map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
