import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ConceptCard } from '@/components/concept-card'
import { ISLAND_CONCEPTS } from '@/lib/trip-data'

export const metadata: Metadata = {
  title: 'Island Concepts — Azores Odyssey 2027',
  description:
    'Compare itinerary shapes from São Miguel-only to the maximum four-island expedition.',
}

export default function ConceptsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shape the itinerary"
        title="Island Concepts"
        intro="Four ways to structure the trip, from a single deep island to an ambitious multi-island expedition. Each adds experiences but also transfer days. Voting here is the same as the Island concept decision, and stays in this browser only."
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-6">
          {ISLAND_CONCEPTS.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      </div>
    </>
  )
}
