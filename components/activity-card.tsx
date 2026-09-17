'use client'

import { ExternalLink } from 'lucide-react'
import {
  type Activity,
  activityThreadId,
  activityVoteId,
  CATEGORIES,
} from '@/lib/trip-data'
import {
  GroupFitBadge,
  IntensityBadge,
  IslandBadge,
  Pill,
  ResearchBadge,
  UrgencyBadge,
} from '@/components/badges'
import { VoteControls } from '@/components/vote-controls'
import { CommentThread } from '@/components/comment-thread'

export function ActivityCard({ activity }: { activity: Activity }) {
  const categoryLabel = CATEGORIES.find((c) => c.id === activity.category)?.label ?? ''

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {activity.islands.map((i) => (
            <IslandBadge key={i} island={i} />
          ))}
          <Pill tone="neutral" className="uppercase tracking-wide">
            {categoryLabel}
          </Pill>
        </div>
        <h3 className="text-balance font-serif text-xl font-semibold leading-snug text-foreground">
          {activity.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <IntensityBadge intensity={activity.intensity} />
          <GroupFitBadge fit={activity.groupFit} />
          <UrgencyBadge urgency={activity.urgency} />
          <ResearchBadge status={activity.status} />
        </div>
      </header>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground/90">{activity.fitNote}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{activity.notes}</p>
      </div>

      <a
        href={activity.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        Open official/provider link
      </a>

      <VoteControls itemId={activityVoteId(activity.id)} />

      <CommentThread threadId={activityThreadId(activity.id)} />
    </article>
  )
}
