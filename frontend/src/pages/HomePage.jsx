import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Newspaper, Sparkles } from "lucide-react";
import HeroSearch from "@/components/site/HeroSearch";
import SectionHeader from "@/components/site/SectionHeader";
import ToolCard from "@/components/site/ToolCard";
import ArticleCard from "@/components/site/ArticleCard";
import StackCard from "@/components/site/StackCard";
import CategoryPills from "@/components/site/CategoryPills";
import TrendingRanking from "@/components/site/TrendingRanking";
import { apiGet, formatCategory } from "@/lib/api";

export default function HomePage() {
  const [ranking, setRanking] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [category, setCategory] = useState(null);
  const [categoryTools, setCategoryTools] = useState([]);

  useEffect(() => {
    apiGet("/tools/ranking", { limit: 10 }).then(setRanking).catch(() => {});
    apiGet("/tools", { featured: true, limit: 6 }).then(setRecommended).catch(() => {});
    apiGet("/articles", { featured: true, limit: 3 }).then(setArticles).catch(() => {});
    apiGet("/stacks").then(setStacks).catch(() => {});
  }, []);

  useEffect(() => {
    apiGet("/tools", { category, limit: 6 }).then(setCategoryTools).catch(() => {});
  }, [category]);

  return (
    <div className="relative">
      {/* HERO — Minimal, centered, search-first */}
      <section className="relative pt-16 sm:pt-24 lg:pt-28 pb-12">
        <div className="container-narrow text-center">
          <p
            data-testid="hero-eyebrow"
            className="label-eyebrow mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03]"
          >
            <Sparkles className="h-3 w-3 text-[#A855F7]" /> AI discovery, refined.
          </p>
          <h1
            data-testid="hero-title"
            className="font-display text-4xl sm:text-5xl lg:text-[64px] leading-[1.02] tracking-tight max-w-[920px] mx-auto"
          >
            What AI do you <span className="text-[#A855F7]">need</span>?
          </h1>
          <p className="mt-5 text-white/55 text-base sm:text-[17px] max-w-xl mx-auto leading-relaxed">
            Ask for anything. AIthusiast finds the perfect AI tool for your exact use case.
          </p>

          <div className="mt-10 max-w-[820px] mx-auto">
            <HeroSearch size="hero" showChips showCategories={false} />
          </div>

          <div className="mt-10 flex items-center justify-center gap-5 text-[11px] text-white/40">
            <span><strong className="text-white/75 tabular">54</strong> curated tools</span>
            <span className="h-3 w-px bg-white/15" />
            <span><strong className="text-white/75 tabular">10</strong> categories</span>
            <span className="h-3 w-px bg-white/15" />
            <span><strong className="text-white/75">AI</strong> recommendations</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES — single-row, scannable */}
      <section className="container-wide py-10 border-y border-white/[0.05]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <p className="label-eyebrow mb-1">Browse by craft</p>
            <h2 className="font-display text-xl tracking-tight">Ten focused categories.</h2>
          </div>
          <Link to="/tools" className="btn-ghost text-[12px]">
            All tools <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <CategoryPills value={category} onChange={setCategory} dataTestid="home-category-pill" />
        {category && categoryTools.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {categoryTools.slice(0, 3).map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        )}
        {category && (
          <div className="mt-5">
            <Link to={`/tools?category=${category}`} className="btn-ghost text-[12px]">
              See all in {formatCategory(category)} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </section>

      {/* TRENDING AI RIGHT NOW — numbered leaderboard (HEADLINE SECTION) */}
      <section className="container-wide py-20">
        <SectionHeader
          eyebrow="Trending now"
          title="The AI tools the world is using right now."
          description="A live ranking of the most-used AI tools across all categories — updated weekly."
          action={
            <Link to="/tools" className="btn-ghost text-[12px]">
              Full catalog <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="grid lg:grid-cols-2 gap-3 lg:gap-4">
          <TrendingRanking items={ranking.slice(0, 5)} />
          <TrendingRanking items={ranking.slice(5, 10)} />
        </div>
      </section>

      {/* RECOMMENDED AI TOOLS */}
      <section className="container-wide py-16">
        <SectionHeader
          eyebrow="Editor's picks"
          title="Recommended AI tools."
          description="Hand-selected tools we keep recommending."
          action={
            <Link to="/tools" className="btn-ghost text-[12px]">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {recommended.slice(0, 6).map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </section>

      {/* STACKS — compact */}
      <section className="container-wide py-16">
        <SectionHeader
          eyebrow="Curated stacks"
          title="Adopt a workflow."
          description="Six premium stacks, picked for the people who actually ship."
          action={
            <Link to="/stacks" className="btn-ghost text-[12px]">
              <Layers className="h-3.5 w-3.5" /> All stacks
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {stacks.slice(0, 3).map((s) => (
            <StackCard key={s.id} stack={s} />
          ))}
        </div>
      </section>

      {/* ARTICLES — secondary, brief */}
      <section className="container-wide pt-16 pb-8">
        <SectionHeader
          eyebrow="Editorial"
          title="Short reads, sharp takes."
          description="Quick AI insights worth your scroll."
          action={
            <Link to="/articles" className="btn-ghost text-[12px]">
              <Newspaper className="h-3.5 w-3.5" /> All articles
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {articles.slice(0, 3).map((a) => (
            <ArticleCard key={a.id} article={a} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
