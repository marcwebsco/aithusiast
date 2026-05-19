import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Search } from "lucide-react";

const NAV = [
  { to: "/tools", label: "Tools" },
  { to: "/stacks", label: "Stacks" },
  { to: "/articles", label: "Articles" },
];

export default function SiteShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Global ambient orbs (very subtle) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="orb-purple absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full opacity-50" />
        <div className="orb-purple absolute top-[40%] -right-40 h-[420px] w-[420px] rounded-full opacity-40" />
        <div className="absolute inset-0 noise-overlay opacity-[0.05] mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[hsl(var(--bg))]/60 border-b border-white/[0.06]">
        <div className="container-wide flex items-center justify-between h-16">
          <Link to="/" data-testid="site-logo-link" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center group-hover:shadow-[var(--shadow-glow-sm)] transition-[box-shadow] duration-300">
              <Sparkles className="h-4 w-4 text-[#A855F7]" />
            </div>
            <span className="font-display text-lg tracking-tight">AIthusiast</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1" data-testid="site-nav">
            {NAV.map((n) => {
              const active = location.pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  data-testid={`nav-link-${n.label.toLowerCase()}`}
                  className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                    active
                      ? "bg-white/[0.08] text-white border border-white/15"
                      : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <button
            data-testid="header-search-button"
            onClick={() => navigate("/search")}
            className="btn-ghost h-10 px-4 text-sm"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden md:inline ml-2 text-[10px] uppercase tracking-[0.18em] text-white/40 border border-white/10 rounded px-1.5 py-0.5">/</kbd>
          </button>
        </div>
      </header>

      <main className="relative">{children}</main>

      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-white/[0.06]">
      <div className="container-wide py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-[#A855F7]" />
            </div>
            <span className="font-display text-base">AIthusiast</span>
            <span className="text-white/40 text-xs ml-2">· Discover the best AI for anything.</span>
          </div>
          <div className="flex items-center gap-6 text-xs uppercase tracking-[0.22em] text-white/40">
            <Link to="/tools" className="hover:text-white">Tools</Link>
            <Link to="/stacks" className="hover:text-white">Stacks</Link>
            <Link to="/articles" className="hover:text-white">Articles</Link>
            <Link to="/search" className="hover:text-white">Search</Link>
          </div>
        </div>
        <div className="hairline mt-8" />
        <div className="mt-6 text-xs text-white/30">
          © {new Date().getFullYear()} AIthusiast — a luxury futuristic AI operating system.
        </div>
      </div>
    </footer>
  );
}
