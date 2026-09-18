import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { DecisionCard } from '@/components/decision-card'
import { DECISIONS } from '@/lib/trip-data'

export const metadata: Metadata = {
  title: 'Group Decisions — Azores Odyssey 2027',
  description:
    'Explore the activities first, then vote on timing, length, Mount Pico, island concept, and the priority tradeoffs.',
}

export default function DecisionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Decide together"
        title="Group Decisions"
        intro="These decisions are intentionally second: explore the activities and island concepts first, then vote on timing, trip length, Mount Pico, island concept, and priorities. Shared votes are saved to your account."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="grid gap-6">
          {DECISIONS.map((decision) => (
            <DecisionCard key={decision.id} decision={decision} />
          ))}
        </div>
      </div>
    </>
  )
}
