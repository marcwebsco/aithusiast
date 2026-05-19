import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Command as CommandIcon, Loader2 } from "lucide-react";
import { apiGet, apiPost, formatCategory, CATEGORY_ORDER } from "@/lib/api";
import ToolCard from "@/components/site/ToolCard";

export default function HeroSearch({ size = "hero" }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    apiGet("/suggestions").then((d) => setPrompts(d.prompts || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const runQuickPreview = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setShowPreview(true);
    try {
      const res = await apiPost("/search", { query: q });
      setPreview(res);
    } catch (e) {
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const submit = (q) => {
    const final = (q ?? query).trim();
    if (!final) return;
    navigate(`/search?q=${encodeURIComponent(final)}`);
  };

  const onChip = (p) => {
    setQuery(p);
    submit(p);
  };

  return (
    <div data-testid="hero-ai-search" className="relative">
      {/* Glass shell */}
      <div className="relative reflect-sweep rounded-[52px] p-4 sm:p-5 lg:p-6 bg-white/[0.05] border border-white/[0.12] backdrop-blur-2xl shadow-[var(--shadow-glow-md)] anim-pulse-glow">
        <div className="flex items-center gap-3 px-4 py-3 sm:py-4 rounded-full bg-black/30 border border-white/[0.10] focus-within:border-white/[0.22] focus-within:shadow-[var(--shadow-glow-sm)] transition-[border-color,box-shadow] duration-300">
          <Sparkles className="h-5 w-5 text-[#A855F7] flex-shrink-0" />
          <input
            ref={inputRef}
            data-testid="hero-ai-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Tab" && !e.shiftKey && query.trim()) {
                e.preventDefault();
                runQuickPreview(query);
              }
            }}
            placeholder="Find the perfect AI for anything…  e.g. ‘AI for cinematic images’"
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-base sm:text-lg font-light"
            autoComplete="off"
          />
          {loading && <Loader2 className="h-5 w-5 text-white/60 animate-spin" />}
          <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-white/40 border border-white/10 rounded px-1.5 py-0.5">
            <CommandIcon className="h-3 w-3" /> K
          </kbd>
          <button
            data-testid="hero-ai-search-submit"
            onClick={() => submit()}
            className="btn-primary h-10 px-4 sm:px-5 text-sm"
          >
            <span>Discover</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Suggestion chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="label-eyebrow self-center mr-1">Try</span>
          {prompts.slice(0, 6).map((p) => (
            <button
              key={p}
              data-testid="hero-ai-search-suggestion-chip"
              onClick={() => onChip(p)}
              className="glass-pill text-xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Category pills */}
        {size === "hero" && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="label-eyebrow self-center mr-1">Categories</span>
            {CATEGORY_ORDER.slice(0, 7).map((c) => (
              <button
                key={c}
                data-testid="hero-ai-search-category-pill"
                onClick={() => navigate(`/tools?category=${c}`)}
                className="glass-pill text-[11px] uppercase tracking-[0.18em]"
              >
                {formatCategory(c)}
              </button>
            ))}
          </div>
        )}

        {/* Inline preview */}
        {showPreview && (
          <div className="mt-5">
            <div className="hairline mb-4" />
            {loading && (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Querying the AI operating system…
              </div>
            )}
            {preview && !loading && (
              <div data-testid="hero-ai-search-preview">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <p className="text-white/70 text-sm">
                    <span className="label-eyebrow mr-2">Intent</span>
                    {preview.intent}
                  </p>
                  <button onClick={() => submit(preview.query)} className="btn-ghost text-xs h-8 px-3">
                    View full results <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {preview.tools.slice(0, 3).map((t, i) => (
                    <ToolCard
                      key={t.id}
                      tool={t}
                      reason={preview.recommendations[i]?.why}
                      compact
                      data-testid="hero-ai-search-result-item"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
