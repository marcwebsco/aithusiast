import { useState } from "react";

/**
 * ToolLogo — renders a real brand favicon with a graceful fallback to the
 * first letter on a coloured tile. Used everywhere a tool is represented.
 */
export default function ToolLogo({ tool, size = 40, square = true, className = "" }) {
  const [errored, setErrored] = useState(false);
  const accent = tool?.accent || "#A855F7";
  const dim = `${size}px`;
  const radius = square ? Math.round(size * 0.28) : Math.round(size / 2);

  return (
    <div
      className={`relative flex-shrink-0 border border-white/10 flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: dim,
        height: dim,
        borderRadius: `${radius}px`,
        background: `${accent}1A`,
      }}
      aria-label={tool?.name}
    >
      {tool?.logo && !errored ? (
        <img
          src={tool.logo}
          alt={`${tool.name} logo`}
          width={Math.round(size * 0.6)}
          height={Math.round(size * 0.6)}
          loading="lazy"
          decoding="async"
          onError={() => setErrored(true)}
          style={{ width: `${Math.round(size * 0.6)}px`, height: `${Math.round(size * 0.6)}px` }}
        />
      ) : (
        <span
          className="font-display"
          style={{ fontSize: `${Math.round(size * 0.38)}px`, color: "white" }}
        >
          {tool?.name?.slice(0, 1) || "?"}
        </span>
      )}
    </div>
  );
}
