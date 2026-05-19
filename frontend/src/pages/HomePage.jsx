import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Layers, Sparkles, Newspaper } from "lucide-react";
import HeroSearch from "@/components/site/HeroSearch";
import SectionHeader from "@/components/site/SectionHeader";
import ToolCard from "@/components/site/ToolCard";
import ArticleCard from "@/components/site/ArticleCard";
import StackCard from "@/components/site/StackCard";
import CategoryPills from "@/components/site/CategoryPills";
import { apiGet, formatCategory } from "@/lib/api";

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [category, setCategory] = useState(null);
  const [categoryTools, setCategoryTools] = useState([]);

  useEffect(() => {
    apiGet("/tools", { trending: true, limit: 6 }).then(setTrending).catch(() => {});
    apiGet("/tools", { featured: true, limit: 6 }).then(setFeatured).catch(() => {});
    apiGet("/articles", { featured: true, limit: 4 }).then(setArticles).catch(() => {});
    apiGet("/stacks").then(setStacks).catch(() => {});
  }, []);

  useEffect(() => {
    apiGet("/tools", { category, limit: 6 }).then(setCategoryTools).catch(() => {});
  }, [category]);

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative pt-12 sm:pt-16 lg:pt-24 pb-16">
        <div className="container-wide grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <p data-testid="hero-eyebrow" className="label-eyebrow mb-5 flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-[#A855F7]" /> AIthusiast · v1
            </p>
            <h1
              data-testid="hero-title"
              className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight"
            >
              Find the <span className="glow-text text-[#A855F7]">perfect AI</span> for anything.
            </h1>
            <p className="mt-6 text-white/65 text-lg font-light leading-relaxed max-w-xl">
              A premium, futuristic operating system for discovering the best AI tools. Built for creators, founders, students and engineers who refuse to waste a tab.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/tools" className="btn-primary" data-testid="hero-browse-button">
                <Compass className="h-4 w-4" /> Browse Tools
              </Link>
              <Link to="/stacks" className="btn-ghost">
                <Layers className="h-4 w-4" /> AI Stacks
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-white/40">
              <span><strong className="text-white/80 font-display text-base">54+</strong> curated tools</span>
              <span className="h-3 w-px bg-white/15" />
              <span><strong className="text-white/80 font-display text-base">10</strong> categories</span>
              <span className="h-3 w-px bg-white/15" />
              <span><strong className="text-white/80 font-display text-base">AI</strong> recommendations</span>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            {/* Decorative orb behind search */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute top-10 right-10 h-72 w-72 orb-purple rounded-full" />
              <div className="absolute bottom-10 left-10 h-40 w-40 orb-soft rounded-full" />
            </div>
            <HeroSearch size="hero" />
          </div>
        </div>
      </section>

      {/* TRENDING TOOLS */}
      <section className="container-wide py-20">
        <SectionHeader
          eyebrow="Trending"
          title="What everyone's discovering right now."
          description="A live shelf of the AI tools shaping creators, founders and engineers this season."
          action={
            <Link to="/tools" className="btn-ghost text-sm">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {trending.slice(0, 6).map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-wide py-20">
        <SectionHeader
          eyebrow="Categories"
          title="Browse by craft."
          description="Ten focused buckets. Filter in one tap."
        />
        <CategoryPills value={category} onChange={setCategory} dataTestid="home-category-pill" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {categoryTools.slice(0, 6).map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
        {category && (
          <div className="mt-8 text-center">
            <Link to={`/tools?category=${category}`} className="btn-ghost text-sm">
              See all in {formatCategory(category)} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* RECOMMENDED STACKS */}
      <section className="container-wide py-20">
        <SectionHeader
          eyebrow="Recommended AI Stacks"
          title="Adopt a workflow, not just a tool."
          description="Six curated stacks for the people who actually ship."
          action={
            <Link to="/stacks" className="btn-ghost text-sm">
              All stacks <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {stacks.slice(0, 4).map((s) => (
            <StackCard key={s.id} stack={s} />
          ))}
        </div>
      </section>

      {/* FEATURED ARTICLES */}
      <section className="container-wide py-20">
        <SectionHeader
          eyebrow="Editorial"
          title="Short. Premium. Useful."
          description="AI editorial worth your scroll. No SEO spam."
          action={
            <Link to="/articles" className="btn-ghost text-sm">
              <Newspaper className="h-4 w-4" /> All articles
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {articles.slice(0, 3).map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* FEATURED TOOLS BOTTOM */}
      <section className="container-wide py-20">
        <SectionHeader
          eyebrow="Editor's selection"
          title="Featured AI tools."
          description="Picks we keep recommending."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {featured.slice(0, 6).map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
