import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ResultsView } from '@/components/results-view'

export const metadata: Metadata = {
  title: 'Admin Dashboard — Azores Odyssey 2027',
  description:
    'Private admin view of votes saved in this browser, ranked by net enthusiasm across decisions and activities.',
}

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin only"
        title="Admin Dashboard"
        intro="A private tally of the votes saved in this browser, ranked by net enthusiasm. Family votes stay on each person's own device until the shared backend is switched on."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ResultsView />
      </div>
    </>
  )
}
