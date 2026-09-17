export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: string
  intro?: string
}) {
  return (
    <section className="topo-texture-strong border-b border-border bg-navy text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-balance font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-primary-foreground/75 sm:text-lg">
            {intro}
          </p>
        )}
      </div>
    </section>
  )
}
