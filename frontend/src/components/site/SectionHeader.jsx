export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
      <div>
        {eyebrow && <p className="label-eyebrow mb-2">{eyebrow}</p>}
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[34px] tracking-tight max-w-2xl leading-[1.1]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-white/55 text-[14px] max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
