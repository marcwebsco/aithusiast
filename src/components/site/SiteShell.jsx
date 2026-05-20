import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Search } from "lucide-react";
import CompareBar from "@/components/site/CompareBar";
import CookieConsent from "@/components/site/CookieConsent";

const NAV = [
  { to: "/tools", label: "Tools" },
  { to: "/stacks", label: "Stacks" },
  { to: "/articles", label: "Articles" },
  { to: "/compare", label: "Compare" },
];

export default function SiteShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-atmospheric">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 noise-overlay opacity-[0.04] mix-blend-overlay" />
      </div>

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

      <main className="relative pb-24">{children}</main>

      <SiteFooter />
      <CompareBar />
      <CookieConsent />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.05]">
      <div className="container-wide py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-[#A855F7]" />
              </div>
              <span className="font-display text-base">AIthusiast</span>
            </div>
            <p className="text-white/55 text-[13px] leading-relaxed max-w-sm">
              A premium AI discovery platform. Find the perfect AI tool for any use case — ranked, compared, and curated.
            </p>
          </div>

          <div>
            <p className="label-eyebrow text-[10px] mb-3">Discover</p>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="/tools" className="text-white/70 hover:text-white">All Tools</Link></li>
              <li><Link to="/stacks" className="text-white/70 hover:text-white">AI Stacks</Link></li>
              <li><Link to="/articles" className="text-white/70 hover:text-white">Articles</Link></li>
              <li><Link to="/compare" className="text-white/70 hover:text-white">Compare</Link></li>
              <li><Link to="/search" className="text-white/70 hover:text-white">AI Search</Link></li>
            </ul>
          </div>

          <div>
            <p className="label-eyebrow text-[10px] mb-3">Company</p>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="/about" className="text-white/70 hover:text-white">About</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="label-eyebrow text-[10px] mb-3">Legal</p>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="/privacy" className="text-white/70 hover:text-white">Privacy</Link></li>
              <li><Link to="/terms" className="text-white/70 hover:text-white">Terms</Link></li>
              <li><Link to="/cookies" className="text-white/70 hover:text-white">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-10" />
        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[11px] text-white/30">
            © {new Date().getFullYear()} AIthusiast · Independent AI discovery platform. All trademarks belong to their respective owners.
          </p>
          <p className="text-[11px] text-white/30">
            AI recommendations powered by intelligent search algorithms.
          </p>
        </div>
      </div>
    </footer>
  );
}
