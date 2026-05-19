export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
      <div>
        {eyebrow && <p className="label-eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight max-w-2xl leading-[1.05]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-white/60 text-base font-light max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
