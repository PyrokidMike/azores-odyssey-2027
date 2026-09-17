import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ActivityExplorer } from '@/components/activity-explorer'

export const metadata: Metadata = {
  title: 'Activity Explorer — Azores Odyssey 2027',
  description:
    'Filter curated Azores activities across water, volcano, and land by island, intensity, and group fit. Vote and comment on each.',
}

export default function ActivitiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Explore & vote"
        title="Activity Explorer"
        intro="Every option is hand-curated with island, whole-group vs. split-group fit, intensity, booking urgency, a critical note, and a direct source link. Filter to what fits, then vote and comment — your picks stay in this browser only."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ActivityExplorer />
      </div>
    </>
  )
}
