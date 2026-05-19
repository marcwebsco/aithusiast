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
    <div className="relative min-h-screen bg-atmospheric">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 noise-overlay opacity-[0.04] mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[hsl(var(--bg))]/75 border-b border-white/[0.05]">
        <div className="container-wide flex items-center justify-between h-14">
          <Link to="/" data-testid="site-logo-link" className="flex items-center gap-2 group">
            <div className="relative h-7 w-7 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-[#A855F7]" />
            </div>
            <span className="font-display text-[17px] tracking-tight">AIthusiast</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" data-testid="site-nav">
            {NAV.map((n) => {
              const active = location.pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  data-testid={`nav-link-${n.label.toLowerCase()}`}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] transition-colors duration-200 ${
                    active
                      ? "bg-white/[0.06] text-white"
                      : "text-white/65 hover:text-white hover:bg-white/[0.03]"
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
            className="inline-flex items-center gap-2 rounded-full pl-3 pr-1.5 py-1.5 text-[13px] text-white/65 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:text-white transition-colors duration-200"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search AI tools…</span>
            <kbd className="hidden md:inline ml-2 text-[10px] text-white/40 border border-white/10 bg-white/[0.04] rounded px-1.5 py-0.5">/</kbd>
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
    <footer className="relative mt-24 border-t border-white/[0.05]">
      <div className="container-wide py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-[#A855F7]" />
            </div>
            <span className="font-display text-sm">AIthusiast</span>
            <span className="text-white/40 text-xs ml-2">· Discover the best AI tools.</span>
          </div>
          <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.18em] text-white/40">
            <Link to="/tools" className="hover:text-white">Tools</Link>
            <Link to="/stacks" className="hover:text-white">Stacks</Link>
            <Link to="/articles" className="hover:text-white">Articles</Link>
            <Link to="/search" className="hover:text-white">Search</Link>
          </div>
        </div>
        <div className="hairline mt-6" />
        <div className="mt-5 text-[11px] text-white/30">© {new Date().getFullYear()} AIthusiast — a premium AI discovery platform.</div>
      </div>
    </footer>
  );
}
