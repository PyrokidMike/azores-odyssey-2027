import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BedDouble, Home, Users, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Accommodation — Azores Odyssey 2027',
  description: 'Lodging planning for the Azores Odyssey 2027 expedition. Coming later.',
}

const PREVIEW = [
  {
    icon: Home,
    title: 'Large-group villas',
    body: 'Lodging candidates will be gathered here once the activities, island concept, and final itinerary are clearer.',
  },
  {
    icon: MapPin,
    title: 'Base locations',
    body: 'Where we base on each island shapes daily drive times. Options will map to the island concept the group chooses.',
  },
  {
    icon: Users,
    title: 'Room splits',
    body: 'How three families divide across villas and rooms, with per-family privacy and shared common space.',
  },
]

export default function AccommodationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Where we stay"
        title="Accommodation"
        intro="Lodging depends on the activities, trip length, and islands that make the final itinerary. This room opens once those are settled."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <span className="flex size-14 items-center justify-center rounded-full bg-azure/15 text-azure">
            <BedDouble className="size-7" aria-hidden="true" />
          </span>
          <p className="mt-5 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
            Coming later
          </p>
          <h2 className="mt-4 text-balance font-serif text-2xl font-semibold text-foreground">
            Lodging planning opens once the itinerary is set
          </h2>
          <p className="mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
            We&apos;ll collect villa candidates, base-town options, and room splits here after the
            the planning group settles length and islands.
          </p>
          <Link
            href="/decisions"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-navy/90"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Settle the decisions first
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {PREVIEW.map((item) => (
            <div key={item.title} className="rounded-2xl border border-dashed border-border bg-card/40 p-5">
              <item.icon className="size-5 text-green" aria-hidden="true" />
              <h3 className="mt-3 font-serif text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
