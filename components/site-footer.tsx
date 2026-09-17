export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-navy text-primary-foreground/70">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="font-serif text-lg text-primary-foreground">Azores Odyssey 2027</p>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed">
          A private planning tool for three families. All trip content is manually curated
          and embedded in the app — nothing here is fetched from the web or generated live.
        </p>
        <p className="mt-4 text-xs text-primary-foreground/50">
          Prototype (v1): your votes and comments are saved only in this browser. Shared
          comments will be enabled later with Supabase.
        </p>
      </div>
    </footer>
  )
}
