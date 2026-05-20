import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import StackCard from "@/components/site/StackCard";
import { StackCardSkeleton } from "@/components/site/Skeleton";
import { useSEO } from "@/lib/seo";

export default function StacksPage() {
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: "Curated AI stacks",
    description:
      "Hand-picked combinations of AI tools that work beautifully together — stacks for students, founders, designers, creators, marketers and more.",
  });

  useEffect(() => {
    apiGet("/stacks").then(setStacks).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-wide py-10 lg:py-14">
      <p className="label-eyebrow mb-2">Curated stacks</p>
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3">
        Adopt a workflow, not just a tool.
      </h1>
      <p className="text-white/55 text-[14px] max-w-2xl">
        Hand-picked combinations of AI tools that work beautifully together for a specific persona.
      </p>
      <div className="mt-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {Array.from({ length: 6 }).map((_, i) => <StackCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {stacks.map((s) => (
              <StackCard key={s.id} stack={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
