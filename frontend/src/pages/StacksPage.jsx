import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import StackCard from "@/components/site/StackCard";
import { Loader2 } from "lucide-react";

export default function StacksPage() {
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/stacks").then(setStacks).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-wide py-12 lg:py-16">
      <p className="label-eyebrow mb-3">Curated stacks</p>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4">
        Adopt a workflow, not just a tool.
      </h1>
      <p className="text-white/60 text-base font-light max-w-2xl">
        Hand-picked combinations of AI tools that work beautifully together for a specific kind of person.
      </p>
      <div className="mt-12">
        {loading ? (
          <div className="flex items-center gap-2 text-white/60">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {stacks.map((s) => (
              <StackCard key={s.id} stack={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
