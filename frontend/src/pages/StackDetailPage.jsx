import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "@/lib/api";
import ToolCard from "@/components/site/ToolCard";
import { ArrowLeft, Layers, Loader2 } from "lucide-react";

export default function StackDetailPage() {
  const { slug } = useParams();
  const [stack, setStack] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGet(`/stacks/${slug}`)
      .then(async (s) => {
        setStack(s);
        const fetched = await Promise.all(
          (s.tool_ids || []).map((id) => apiGet(`/tools/${id}`).catch(() => null))
        );
        setTools(fetched.filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-wide py-20 flex items-center gap-2 text-white/60">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }
  if (!stack) {
    return (
      <div className="container-wide py-20">
        <p className="text-white/60">Stack not found.</p>
        <Link to="/stacks" className="btn-ghost mt-4">Back to stacks</Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative h-[45vh] min-h-[360px] w-full overflow-hidden">
        <img src={stack.cover} alt={stack.title} className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(5,1,10,0.5) 0%, rgba(5,1,10,1) 100%)" }}
        />
        <div className="relative h-full container-narrow flex flex-col justify-end pb-12">
          <Link to="/stacks" className="btn-ghost text-xs w-fit mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> All stacks
          </Link>
          <p className="label-eyebrow mb-3 flex items-center gap-2">
            <Layers className="h-3 w-3" /> {stack.persona} · {stack.use_case}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight max-w-3xl leading-[1.05]">
            {stack.title}
          </h1>
          <p className="mt-4 text-white/70 text-lg font-light max-w-2xl leading-relaxed">{stack.rationale}</p>
        </div>
      </div>

      <div className="container-wide py-12">
        <p className="label-eyebrow mb-3">The stack</p>
        <h2 className="font-display text-3xl tracking-tight mb-8">{tools.length} tools, one workflow.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {tools.map((t, i) => (
            <ToolCard key={t.id} tool={t} rank={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
