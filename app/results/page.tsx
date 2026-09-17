import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ResultsView } from '@/components/results-view'

export const metadata: Metadata = {
  title: 'Results — Azores Odyssey 2027',
  description:
    'See where the group is leaning across every decision, island concept, and activity.',
}

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Where we stand"
        title="Results"
        intro="A running tally of the group's votes, ranked by net enthusiasm. Use it to spot consensus and the choices still worth a conversation."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ResultsView />
      </div>
    </>
  )
}
