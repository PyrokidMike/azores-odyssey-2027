import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ActivityExplorer } from '@/components/activity-explorer'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { activityProgress } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getInitialProgress() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return []
  return db
    .select({ activityId: activityProgress.activityId, state: activityProgress.state })
    .from(activityProgress)
    .where(eq(activityProgress.userId, session.user.id))
}

export const metadata: Metadata = {
  title: 'Activity Explorer — Azores Odyssey 2027',
  description:
    'Filter curated Azores activities across water, volcano, and land by island, intensity, and group fit. Vote and comment on each.',
}

export default async function ActivitiesPage() {
  const initialProgress = await getInitialProgress()

  return (
    <>
      <PageHeader
        eyebrow="Explore & vote"
        title="Activity Explorer"
        intro="Every option is hand-curated with island, whole-group vs. split-group fit, intensity, booking urgency, a critical note, and a direct source link. Browse the core itinerary, optional adventures for adults and older teens, or quieter family recovery days — then vote and comment. Your activity review status saves automatically to your account so you can leave and resume later."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ActivityExplorer initialProgress={initialProgress} />
      </div>
    </>
  )
}
