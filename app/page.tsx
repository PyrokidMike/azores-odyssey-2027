'use client'

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
import { useSession } from '@/lib/auth-client'
import { usePlanning } from '@/components/planning-provider'

const QUICK_LINKS = [
  {
    href: '/decisions',
    title: 'Group Decisions',
    desc: 'After exploring activities, weigh timing, trip length, Mount Pico, island concept, and priorities.',
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
    body: 'A group coordinating one expedition. Timing choices ripple through crowds, whale season, and the Sanjoaninas festival.',
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
  const { data: session, isPending } = useSession()
  const { comments, ready: planningReady } = usePlanning()
  const userName = session?.user?.name?.trim() || session?.user?.email?.split('@')[0] || 'there'
  const recentComments = Object.entries(comments)
    .flatMap(([threadId, entries]) => entries.map((entry) => ({ ...entry, threadId })))
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 6)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <section className="topo-texture-strong relative overflow-hidden border-b border-border bg-navy text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-azure">
            Welcome to the group expedition planning room · June 2027
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Group Expedition Planner: Azores 2027
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
            Explore the hand-curated activities across four islands, save your choices as you go,
            and help shape the itinerary before weighing the larger planning decisions.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isPending ? (
              <div className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary-foreground/20 px-6 py-3 text-sm text-primary-foreground/70">
                Checking your account…
              </div>
            ) : session?.user ? (
              <div className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-success px-6 py-3 text-sm font-semibold text-success-foreground">
                <span>{greeting}, {userName}</span>
              </div>
            ) : (
              <Link
                href="/sign-up"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Set up your account
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
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

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Live planning pulse</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground">Recent updates</h2>
            <p className="mt-1 text-muted-foreground">New group input and planning changes to review.</p>
          </div>
          <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">Open admin dashboard</Link>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3"><h3 className="font-serif text-lg font-semibold">New comments</h3><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">{recentComments.length}</span></div>
            <div className="mt-4 space-y-3">{recentComments.map((comment) => <div key={comment.id} className="rounded-xl border border-border/70 bg-background p-3"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-foreground">{comment.author}</p><time className="text-xs text-muted-foreground" dateTime={new Date(comment.ts).toISOString()}>{new Date(comment.ts).toLocaleDateString()}</time></div><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{comment.text}</p><p className="mt-2 text-xs font-medium text-accent">{comment.threadId.replaceAll(':', ' · ')}</p></div>)}{planningReady && recentComments.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No new comments yet. Comments added to activities will appear here.</p>}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="font-serif text-lg font-semibold">Planner activity</h3>
            <div className="mt-4 space-y-3"><div className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-azure/15 text-azure"><Compass className="size-4" aria-hidden="true" /></span><div><p className="text-sm font-semibold">{ACTIVITIES.length} activities available</p><p className="text-xs leading-relaxed text-muted-foreground">Curated across {new Set(ACTIVITIES.flatMap((activity) => activity.islands)).size} islands, with source links and group-fit notes.</p></div></div><div className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-azure/15 text-azure"><ShieldCheck className="size-4" aria-hidden="true" /></span><div><p className="text-sm font-semibold">Research-ready link set</p><p className="text-xs leading-relaxed text-muted-foreground">Activity links are available to verify details before the group decides.</p></div></div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-serif text-2xl font-semibold text-foreground">Where to next</h2>
        <p className="mt-1 text-muted-foreground">Four planning rooms, one shared expedition.</p>
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
