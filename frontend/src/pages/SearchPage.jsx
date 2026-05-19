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
    <div className="container-wide py-10 lg:py-14">
      <p className="label-eyebrow mb-2">AI recommendation</p>
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3 leading-[1.1]">
        {q ? <>Results for <span className="text-[#A855F7]">“{q}”</span></> : "Search the AI universe"}
      </h1>
      <p className="text-white/55 text-[14px] max-w-2xl">
        Ask anything. AIthusiast reads your intent, scans the curated catalog and ranks the best fits with reasoning.
      </p>

      <div className="mt-8">
        <HeroSearch size="compact" showChips={false} />
      </div>

      <div className="mt-10">
        {loading && (
          <div className="flex items-center gap-2 text-white/65 text-[13px]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking… querying the AI operating system.
          </div>
        )}
        {error && <p className="text-red-400/80">{error}</p>}
        {!q && !loading && (
          <div>
            <p className="label-eyebrow mb-3">Try one of these</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((p) => (
                <button
                  key={p}
                  data-testid="search-suggestion-pill"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(p)}`)}
                  className="pill pill-sm"
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
              className="surface-card rounded-2xl p-5 lg:p-6 mb-6"
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(168, 85, 247, 0.10)" }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#A855F7]" />
                </div>
                <div className="flex-1">
                  <p className="label-eyebrow mb-1 text-[10px]">
                    AI intent · {data.source === "llm" ? "Reasoned by Gemini" : "Keyword fallback"}
                  </p>
                  <p className="text-white/85 text-[15px] leading-relaxed">{data.intent}</p>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
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
              <p className="text-white/60 text-[14px]">No results. Try a different query.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
