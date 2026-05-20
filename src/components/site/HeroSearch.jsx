import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { apiGet, formatCategory, CATEGORY_ORDER } from "@/lib/api";

export default function HeroSearch({ size = "hero", showCategories = false, showChips = true }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const submit = (q) => {
    const final = (q ?? query).trim();
    if (!final) return;
    setLoading(true);
    navigate(`/search?q=${encodeURIComponent(final)}`);
  };

  const isHero = size === "hero";
  const shellClass = isHero
    ? "rounded-[40px] p-2.5"
    : "rounded-[32px] p-2";

  return (
    <div data-testid="hero-ai-search" className="relative">
      {isHero && (
        <div aria-hidden className="pointer-events-none absolute -inset-8 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[640px] orb-soft rounded-full" />
        </div>
      )}

      <div className={`glass-panel reflect-sweep ${shellClass}`}>
        <div
          className={`flex items-center gap-2 px-4 ${isHero ? "py-4 sm:py-5" : "py-3"} rounded-full bg-black/30 border border-white/[0.06] focus-within:border-[#A855F7]/30 transition-colors duration-200`}
        >
          <Sparkles className="h-5 w-5 text-[#A855F7] flex-shrink-0" />
          <input
            ref={inputRef}
            data-testid="hero-ai-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder={isHero ? "What AI do you need?" : "Search AI tools, use cases, categories…"}
            className={`flex-1 bg-transparent outline-none text-white placeholder:text-white/35 ${
              isHero ? "text-[17px] sm:text-[19px]" : "text-[15px]"
            } font-normal`}
            autoComplete="off"
          />
          {loading && <Loader2 className="h-4 w-4 text-white/60 animate-spin" />}
          <button
            data-testid="hero-ai-search-submit"
            onClick={() => submit()}
            className="btn-primary px-4 sm:px-5 py-2 text-sm"
          >
            <span className="hidden sm:inline">Discover</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Suggestion chips */}
      {showChips && prompts.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 px-1">
          <span className="label-eyebrow self-center mr-1 text-[10px]">Try</span>
          {prompts.slice(0, 5).map((p) => (
            <button
              key={p}
              data-testid="hero-ai-search-suggestion-chip"
              onClick={() => submit(p)}
              className="pill pill-sm"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Categories row */}
      {showCategories && (
        <div className="mt-2 flex flex-wrap gap-1.5 px-1">
          <span className="label-eyebrow self-center mr-1 text-[10px]">Categories</span>
          {CATEGORY_ORDER.slice(0, 6).map((c) => (
            <button
              key={c}
              data-testid="hero-ai-search-category-pill"
              onClick={() => navigate(`/tools?category=${c}`)}
              className="pill pill-sm"
            >
              {formatCategory(c)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
