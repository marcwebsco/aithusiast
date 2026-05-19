import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, formatCategory } from "@/lib/api";
import { ArrowLeft, ArrowUpRight, Loader2, Sparkles } from "lucide-react";
import ToolCard from "@/components/site/ToolCard";

export default function ToolDetailPage() {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="container-wide py-20 flex items-center gap-2 text-white/60">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading tool…
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

  return (
    <div className="container-wide py-12 lg:py-16">
      <Link to="/tools" className="btn-ghost text-xs mb-8">
        <ArrowLeft className="h-3.5 w-3.5" /> All tools
      </Link>

      {/* Hero card */}
      <div
        data-testid="tool-detail-hero"
        className="relative overflow-hidden rounded-[44px] border border-white/[0.10] bg-white/[0.04] backdrop-blur-xl p-8 lg:p-12"
        style={{ boxShadow: "var(--shadow-elev)" }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full blur-3xl opacity-50"
          style={{ background: `radial-gradient(closest-side, ${tool.accent}55, transparent 65%)` }}
        />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
          <div
            className="h-20 w-20 rounded-3xl border border-white/15 bg-white/[0.06] flex items-center justify-center font-display text-3xl"
            style={{ boxShadow: `inset 0 0 40px ${tool.accent}33` }}
          >
            {tool.name?.[0]}
          </div>
          <div className="flex-1">
            <p className="label-eyebrow mb-2">{formatCategory(tool.category)} · {tool.pricing}</p>
            <h1 className="font-display text-5xl sm:text-6xl tracking-tight">{tool.name}</h1>
            <p className="mt-3 text-white/70 text-lg font-light max-w-2xl leading-relaxed">{tool.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={tool.url || "#"}
              target="_blank"
              rel="noreferrer"
              data-testid="tool-detail-visit-button"
              className="btn-primary"
            >
              <ArrowUpRight className="h-4 w-4" /> Visit
            </a>
            <Link to={`/search?q=${encodeURIComponent("alternatives to " + tool.name)}`} className="btn-ghost">
              <Sparkles className="h-4 w-4" /> Find alternatives
            </Link>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="mt-12 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section
            className="glass-card rounded-[32px] p-8"
          >
            <p className="label-eyebrow mb-3">Overview</p>
            <p className="text-white/80 text-base leading-relaxed font-light">{tool.description}</p>
          </section>

          {tool.strengths?.length > 0 && (
            <section className="glass-card rounded-[32px] p-8">
              <p className="label-eyebrow mb-4">Strengths</p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {tool.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7] flex-shrink-0" />
                    <span className="text-white/85 text-sm leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="glass-card rounded-[32px] p-6">
            <p className="label-eyebrow mb-3">Quick facts</p>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/50">Category</dt>
                <dd className="text-white">{formatCategory(tool.category)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Pricing</dt>
                <dd className="text-white capitalize">{tool.pricing}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Trending</dt>
                <dd className="text-white">{tool.trending ? "Yes" : "—"}</dd>
              </div>
            </dl>
          </section>
          {tool.tags?.length > 0 && (
            <section className="glass-card rounded-[32px] p-6">
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

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-16">
          <p className="label-eyebrow mb-4">Similar tools</p>
          <h2 className="font-display text-3xl tracking-tight mb-8">More in {formatCategory(tool.category)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {similar.slice(0, 6).map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
