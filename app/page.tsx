import Link from 'next/link'
import {
  ArrowRight,
  Vote,
  Compass,
  Mountain,
  MessageSquare,
  ShieldCheck,
  CalendarRange,
} from 'lucide-react'
import { ACTIVITIES, DECISIONS, ISLAND_CONCEPTS } from '@/lib/trip-data'

const QUICK_LINKS = [
  {
    href: '/decisions',
    title: 'Group Decisions',
    desc: 'Vote on headcount, timing, trip length, Mt. Pico, and the priority tradeoff.',
    icon: Vote,
    meta: `${DECISIONS.length} open decisions`,
  },
  {
    href: '/activities',
    title: 'Activity Explorer',
    desc: 'Filter water, volcano, and land adventures by island, intensity, and group fit.',
    icon: Compass,
    meta: `${ACTIVITIES.length} curated activities`,
  },
  {
    href: '/concepts',
    title: 'Island Concepts',
    desc: 'Compare itinerary shapes from São Miguel-only to the maximum expedition.',
    icon: Mountain,
    meta: `${ISLAND_CONCEPTS.length} itinerary options`,
  },
  {
    href: '/results',
    title: 'Results',
    desc: 'See where the group is leaning across every decision, activity, and concept.',
    icon: MessageSquare,
    meta: 'Live tally (this browser)',
  },
]

const FRAMING = [
  {
    icon: CalendarRange,
    title: 'June 2027 window',
    body: 'Three families coordinating a single expedition. Timing choices ripple through crowds, whale season, and the Sanjoaninas festival.',
  },
  {
    icon: ShieldCheck,
    title: 'Curated, not scraped',
    body: 'Every activity, note, and link is hand-researched and embedded. Nothing here is fetched live or AI-generated.',
  },
  {
    icon: Vote,
    title: 'Decide together',
    body: 'Vote must-do / interested / skip / no on everything, and leave comments so the group can converge.',
  },
]

export default function OverviewPage() {
  return (
    <>
      <section className="topo-texture-strong relative overflow-hidden border-b border-border bg-navy text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-azure">
            The Family Expedition · June 2027
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Azores Odyssey 2027
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
            A shared planning room for three families. Explore hand-curated activities across
            four islands, weigh the big decisions, and vote your way to one itinerary everyone
            is excited about.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/decisions"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Start with group decisions
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/activities"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-foreground/25 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Browse the activities
            </Link>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-8">
            <div>
              <dt className="text-xs uppercase tracking-wide text-primary-foreground/55">Islands</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold">4</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-primary-foreground/55">Activities</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold">{ACTIVITIES.length}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-primary-foreground/55">Decisions</dt>
              <dd className="mt-1 font-serif text-3xl font-semibold">{DECISIONS.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {FRAMING.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-full bg-azure/15 text-azure">
                <f.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-serif text-lg font-semibold text-foreground">{f.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-serif text-2xl font-semibold text-foreground">Where to next</h2>
        <p className="mt-1 text-muted-foreground">Four rooms, one shared expedition.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-accent"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <link.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-lg font-semibold text-foreground">{link.title}</h3>
                  <ArrowRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{link.desc}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-accent">
                  {link.meta}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
