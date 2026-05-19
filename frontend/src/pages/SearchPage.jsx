import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiPost, apiGet } from "@/lib/api";
import ToolCard from "@/components/site/ToolCard";
import HeroSearch from "@/components/site/HeroSearch";
import { Loader2, Sparkles } from "lucide-react";

export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q") || "";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    apiGet("/suggestions").then((d) => setSuggestions(d.prompts || [])).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!q) {
      setData(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }
    setLoading(true);
    setError(null);
    setData(null);
    apiPost("/search", { query: q })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message || "Search failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div className="container-wide py-12 lg:py-16">
      <p className="label-eyebrow mb-3">AI Recommendation</p>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4">
        {q ? <>Results for <span className="text-[#A855F7] glow-text">“{q}”</span></> : "Search the AI universe"}
      </h1>
      <p className="text-white/60 text-base font-light max-w-2xl">
        Ask anything. The AIthusiast engine reads your intent, scans the curated catalog and ranks the best fits with reasoning.
      </p>

      <div className="mt-10">
        <HeroSearch size="compact" />
      </div>

      {/* Results */}
      <div className="mt-12">
        {loading && (
          <div className="flex items-center gap-2 text-white/70">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking… querying the AI operating system.
          </div>
        )}
        {error && <p className="text-red-400/80">{error}</p>}
        {!q && !loading && (
          <div>
            <p className="label-eyebrow mb-4">Try one of these</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((p) => (
                <button
                  key={p}
                  data-testid="search-suggestion-pill"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(p)}`)}
                  className="glass-pill text-sm"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {data && !loading && (
          <>
            <div
              data-testid="search-results-reasoning"
              className="relative overflow-hidden rounded-[36px] border border-white/[0.10] bg-white/[0.04] backdrop-blur-xl p-6 lg:p-8 mb-8"
              style={{ boxShadow: "var(--shadow-elev)" }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-40"
                style={{ background: "radial-gradient(closest-side, rgba(168,85,247,0.45), transparent 70%)" }}
              />
              <div className="relative flex items-start gap-3">
                <div className="h-9 w-9 rounded-2xl border border-white/15 bg-white/[0.06] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-[#A855F7]" />
                </div>
                <div className="flex-1">
                  <p className="label-eyebrow mb-1">
                    AI intent · {data.source === "llm" ? "Reasoned by Gemini" : "Keyword fallback"}
                  </p>
                  <p className="text-white/85 text-base sm:text-lg leading-relaxed font-light">{data.intent}</p>
                  {data.filters?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {data.filters.map((f) => (
                        <span key={f} className="badge-tag">{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {data.tools.map((t, i) => (
                <ToolCard
                  key={t.id}
                  tool={t}
                  reason={data.recommendations[i]?.why}
                  rank={i + 1}
                  data-testid="search-results-item"
                />
              ))}
            </div>
            {data.tools.length === 0 && (
              <p className="text-white/60">No results. Try a different query.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
