import { Link } from "react-router-dom";
import { Sparkles, Search, Layers, Newspaper, GitCompareArrows } from "lucide-react";
import { useSEO } from "@/lib/seo";

export default function AboutPage() {
  useSEO({
    title: "About AIthusiast",
    description:
      "AIthusiast is a premium AI discovery platform helping users find the best AI tool for any use case — ranked, compared and curated.",
  });

  return (
    <div className="container-narrow py-12 lg:py-16">
      <p className="label-eyebrow mb-2">About</p>
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.05]">
        We help you find the perfect AI for anything.
      </h1>
      <p className="mt-4 text-white/70 text-[17px] leading-relaxed max-w-2xl">
        AIthusiast is an independent, premium AI discovery platform. We catalog the best AI tools on the market,
        rank them by usage and growth, and explain when (and why) to use each.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <Card icon={<Search className="h-4 w-4 text-[#A855F7]" />} title="Intelligent search">
          Ask anything in natural language. Our AI reads your intent and ranks tools from a curated catalog —
          with reasoning, not just keywords.
        </Card>
        <Card icon={<Sparkles className="h-4 w-4 text-[#A855F7]" />} title="Trending leaderboard">
          A live ranking of the AI tools the world is actually using, updated continuously with weekly growth
          indicators.
        </Card>
        <Card icon={<GitCompareArrows className="h-4 w-4 text-[#A855F7]" />} title="Side-by-side compare">
          Pick up to 4 AI tools and weigh them on what actually matters — strengths, pricing, popularity, and
          growth.
        </Card>
        <Card icon={<Layers className="h-4 w-4 text-[#A855F7]" />} title="Curated stacks">
          Hand-picked combinations of AI tools that work beautifully together for specific personas: students,
          founders, creators, designers, marketers and more.
        </Card>
      </div>

      <div className="mt-12 surface-card rounded-2xl p-7">
        <h2 className="font-display text-xl tracking-tight mb-2">Our editorial standards</h2>
        <p className="text-white/70 text-[14.5px] leading-relaxed">
          We don’t publish endless SEO spam. Every article is short, opinionated and useful. Every tool listing
          is hand-reviewed. We may, in the future, earn commission from affiliate links — but rankings are never
          for sale, and we’ll clearly mark any commercial relationships.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link to="/tools" className="btn-primary">
          <Search className="h-3.5 w-3.5" /> Browse tools
        </Link>
        <Link to="/contact" className="btn-ghost">Get in touch</Link>
      </div>
    </div>
  );
}

function Card({ icon, title, children }) {
  return (
    <div className="surface-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-7 w-7 rounded-lg border border-white/10 flex items-center justify-center" style={{ background: "rgba(168,85,247,0.10)" }}>
          {icon}
        </div>
        <h3 className="font-display text-[15.5px]">{title}</h3>
      </div>
      <p className="text-white/65 text-[13.5px] leading-relaxed">{children}</p>
    </div>
  );
}
