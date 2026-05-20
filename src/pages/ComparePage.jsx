import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, GitCompareArrows, Loader2, X, Plus } from "lucide-react";
import { apiGet, formatCategory } from "@/lib/api";
import { useCompare } from "@/lib/compare";
import { useSEO } from "@/lib/seo";
import ToolLogo from "@/components/site/ToolLogo";

export default function ComparePage() {
  const [params, setParams] = useSearchParams();
  const { ids: ctxIds, remove, clear, toggle } = useCompare();
  const urlIds = (params.get("ids") || "").split(",").filter(Boolean);
  const ids = urlIds.length > 0 ? urlIds : ctxIds;

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [picker, setPicker] = useState(false);
  const [allTools, setAllTools] = useState([]);
  const [pickerQ, setPickerQ] = useState("");

  useSEO({
    title: "Compare AI tools",
    description:
      "Compare 2-4 AI tools side-by-side. Strengths, pricing, category, tags, popularity and trending rank — all in one view.",
  });

  useEffect(() => {
    if (ids.length === 0) {
      setTools([]);
      return;
    }
    setLoading(true);
    apiGet("/tools/compare", { ids: ids.join(",") })
      .then(setTools)
      .finally(() => setLoading(false));
  }, [ids.join(",")]);

  useEffect(() => {
    if (picker && allTools.length === 0) {
      apiGet("/tools", { limit: 200 }).then(setAllTools).catch(() => {});
    }
  }, [picker]);

  // Sync URL when ctxIds change and URL not pinned
  useEffect(() => {
    if (urlIds.length === 0 && ctxIds.length > 0) {
      setParams({ ids: ctxIds.join(",") }, { replace: true });
    }
  }, [ctxIds.join(",")]);

  const addTool = (toolId) => {
    toggle(toolId);
    setPicker(false);
  };

  const removeTool = (toolId) => {
    remove(toolId);
    const next = ids.filter((x) => x !== toolId);
    setParams(next.length ? { ids: next.join(",") } : {}, { replace: true });
  };

  return (
    <div className="container-wide py-10 lg:py-14">
      <p className="label-eyebrow mb-2">Side-by-side</p>
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3">Compare AI tools</h1>
      <p className="text-white/55 text-[14px] max-w-2xl">
        Pick up to 4 tools and weigh them on what actually matters — strengths, pricing, popularity, growth.
      </p>

      {ids.length === 0 && (
        <div className="mt-10 surface-card rounded-2xl p-10 text-center">
          <GitCompareArrows className="h-7 w-7 text-white/40 mx-auto mb-3" />
          <p className="text-white/65 text-[15px]">No tools selected yet.</p>
          <p className="text-white/40 text-[13px] mt-1">
            Add tools from any catalog page — click the “Compare” toggle on a tool card to begin.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Link to="/tools" className="btn-primary">Browse tools</Link>
            <button onClick={() => setPicker(true)} className="btn-ghost">
              <Plus className="h-3.5 w-3.5" /> Add quickly
            </button>
          </div>
        </div>
      )}

      {ids.length > 0 && (
        <div className="mt-8" data-testid="compare-table">
          {loading && (
            <div className="flex items-center gap-2 text-white/60 text-[13px] mb-3">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
            </div>
          )}

          {/* Column headers (tool cards on top) */}
          <div
            className="grid gap-3 lg:gap-4"
            style={{ gridTemplateColumns: `minmax(160px, 220px) repeat(${Math.max(tools.length, 1)}, minmax(220px, 1fr)) ${tools.length < 4 ? "minmax(180px, 220px)" : ""}` }}
          >
            <div></div>
            {tools.map((t) => (
              <div key={t.id} className="surface-card rounded-2xl p-4 relative">
                <button
                  onClick={() => removeTool(t.id)}
                  className="absolute top-2 right-2 text-white/40 hover:text-white p-1"
                  aria-label={`Remove ${t.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <ToolLogo tool={t} size={44} />
                <h3 className="font-display text-[17px] mt-3 tracking-tight">{t.name}</h3>
                <p className="text-white/55 text-[12.5px] mt-1 line-clamp-2 leading-snug">{t.tagline}</p>
                <Link
                  to={`/tools/${t.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-[12px] text-white/75 hover:text-white"
                >
                  View detail <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
            {tools.length < 4 && (
              <button
                onClick={() => setPicker(true)}
                className="surface-card rounded-2xl p-4 border-dashed text-white/55 hover:text-white flex flex-col items-center justify-center gap-2 min-h-[170px]"
                style={{ borderStyle: "dashed" }}
              >
                <Plus className="h-5 w-5" />
                <span className="text-[13px]">Add a tool</span>
              </button>
            )}
          </div>

          {/* Attribute rows */}
          <div className="mt-3 surface-card rounded-2xl overflow-hidden">
            <CompareRow label="Category" tools={tools} render={(t) => formatCategory(t.category)} />
            <CompareRow label="Pricing" tools={tools} render={(t) => <span className="capitalize">{t.pricing}</span>} />
            <CompareRow
              label="Trending rank"
              tools={tools}
              render={(t) => (t.rank ? <span className="tabular">#{t.rank}</span> : "—")}
            />
            <CompareRow
              label="Weekly growth"
              tools={tools}
              render={(t) => (t.weekly_growth ? <span className="text-emerald-300 tabular">{t.weekly_growth}</span> : "—")}
            />
            <CompareRow
              label="Popularity"
              tools={tools}
              render={(t) => (t.popularity ? <span className="tabular">{t.popularity}/100</span> : "—")}
            />
            <CompareRow
              label="Strengths"
              tools={tools}
              render={(t) => (
                <ul className="space-y-1">
                  {(t.strengths || []).slice(0, 4).map((s) => (
                    <li key={s} className="text-[13px] flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-[#A855F7] flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            />
            <CompareRow
              label="Tags"
              tools={tools}
              render={(t) => (
                <div className="flex flex-wrap gap-1">
                  {(t.tags || []).slice(0, 4).map((tg) => (
                    <span key={tg} className="badge-tag">{tg}</span>
                  ))}
                </div>
              )}
            />
            <CompareRow
              label="Website"
              tools={tools}
              render={(t) =>
                t.url ? (
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[#C4B5FD] underline underline-offset-2 inline-flex items-center gap-1"
                  >
                    Visit <ArrowUpRight className="h-3 w-3" />
                  </a>
                ) : "—"
              }
            />
          </div>

          <div className="mt-6 flex items-center justify-between text-[12px] text-white/45">
            <button onClick={clear} className="btn-ghost">Clear all</button>
            <span>Comparing {tools.length} {tools.length === 1 ? "tool" : "tools"} · max 4</span>
          </div>
        </div>
      )}

      {/* Picker modal */}
      {picker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setPicker(false)}
        >
          <div
            className="glass-panel rounded-2xl w-full max-w-[640px] max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
              <h3 className="font-display text-lg flex-1">Add a tool</h3>
              <button onClick={() => setPicker(false)} className="text-white/40 hover:text-white p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 border-b border-white/[0.06]">
              <input
                value={pickerQ}
                onChange={(e) => setPickerQ(e.target.value)}
                placeholder="Search tools by name or category…"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2.5 text-[14px] outline-none focus:border-white/20"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto p-2">
              {allTools
                .filter((t) => {
                  if (ids.includes(t.id)) return false;
                  if (!pickerQ) return true;
                  const q = pickerQ.toLowerCase();
                  return (
                    t.name.toLowerCase().includes(q) ||
                    t.category.toLowerCase().includes(q) ||
                    (t.tags || []).some((x) => x.toLowerCase().includes(q))
                  );
                })
                .slice(0, 40)
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => addTool(t.id)}
                    disabled={ids.length >= 4}
                    className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors duration-150 disabled:opacity-50"
                  >
                    <ToolLogo tool={t} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[14px] truncate">{t.name}</p>
                      <p className="text-[11.5px] text-white/45 truncate">{formatCategory(t.category)} · {t.tagline}</p>
                    </div>
                    <Plus className="h-4 w-4 text-white/40" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompareRow({ label, tools, render }) {
  return (
    <div
      className="grid gap-3 lg:gap-4 px-4 py-4 border-b border-white/[0.05] last:border-b-0"
      style={{ gridTemplateColumns: `minmax(160px, 220px) repeat(${Math.max(tools.length, 1)}, minmax(220px, 1fr)) ${tools.length < 4 ? "minmax(180px, 220px)" : ""}` }}
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/45 self-start pt-1">{label}</div>
      {tools.map((t) => (
        <div key={t.id} className="text-white/80 text-[13.5px]">
          {render(t)}
        </div>
      ))}
      {tools.length < 4 && <div></div>}
    </div>
  );
}
