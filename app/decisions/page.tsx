import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { DecisionCard } from '@/components/decision-card'
import { DECISIONS } from '@/lib/trip-data'

export const metadata: Metadata = {
  title: 'Group Decisions — Azores Odyssey 2027',
  description:
    'Vote on the foundational trip decisions: headcount, timing, length, Mount Pico, and the priority tradeoff.',
}

export default function DecisionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Decide together"
        title="Group Decisions"
        intro="These five choices shape everything else — islands, pacing, and cost. Cast your vote on each option and leave a comment so the group can converge."
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
