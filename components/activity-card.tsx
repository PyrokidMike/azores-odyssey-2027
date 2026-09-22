'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, MessageSquarePlus } from 'lucide-react'
import { addContribution, saveActivityProgress } from '@/app/actions/trip-hub'
import { useSession } from '@/lib/auth-client'
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

export function ActivityCard({ activity, reviewed = false }: { activity: Activity; reviewed?: boolean }) {
  const [requestOpen, setRequestOpen] = useState(false)
  const [request, setRequest] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [reportSent, setReportSent] = useState(false)
  const { data: session } = useSession()
  const categoryLabel = CATEGORIES.find((c) => c.id === activity.category)?.label ?? ''

  useEffect(() => {
    if (!session?.user) return
    void saveActivityProgress(activity.id).catch(() => undefined)
  }, [activity.id, session?.user])

  async function reportDeadLink() {
    setReportSent(true)
    try {
      await addContribution({ kind: 'link', title: `Dead link: ${activity.name}`, body: `Please review this provider link: ${activity.link}`, itemRef: activity.id, itemLabel: activity.name })
    } catch {
      setReportSent(false)
    }
  }

  async function submitRequest() {
    if (!request.trim()) return
    setSaving(true)
    try {
      await addContribution({
        kind: 'note',
        title: `Information request: ${activity.name}`,
        body: request.trim(),
        itemRef: activity.id,
        itemLabel: activity.name,
      })
      setSaved(true)
      setRequest('')
      setRequestOpen(false)
    } finally {
      setSaving(false)
    }
  }

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
          {reviewed && <Pill tone="neutral">Saved to your activity review</Pill>}
          <IntensityBadge intensity={activity.intensity} />
          <GroupFitBadge fit={activity.groupFit} />
          <UrgencyBadge urgency={activity.urgency} />
          <ResearchBadge status={activity.status} />
        </div>
      </header>

      <div className="space-y-3 rounded-xl bg-muted/45 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">What to know</p>
        <p className="text-sm font-medium leading-relaxed text-foreground/90">{activity.fitNote}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{activity.notes}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Planning guide only. Providers current rules, age limits, availability, and weather requirements will be confirmed before booking.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <a
          href={activity.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          View provider information
        </a>
        <a
          href="#activity-explorer"
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Back to planner
        </a>
        <button
          type="button"
          onClick={() => setRequestOpen((open) => !open)}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/15"
          aria-expanded={requestOpen}
        >
          <MessageSquarePlus className="size-4" aria-hidden="true" />
          Request more information
        </button>
        <button
          type="button"
          onClick={reportDeadLink}
          disabled={reportSent}
          className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:no-underline"
        >
          {reportSent ? 'Reported to admin' : 'Report dead link'}
        </button>
      </div>

      {requestOpen && (
        <div className="rounded-xl border border-border bg-background p-4">
          <label htmlFor={`request-${activity.id}`} className="text-sm font-semibold text-foreground">
            What should we find out about {activity.name}?
          </label>
          <textarea
            id={`request-${activity.id}`}
            value={request}
            onChange={(event) => setRequest(event.target.value)}
            placeholder="For example: ask about age limits, group capacity, pricing, or 2027 availability."
            rows={3}
            className="mt-2 min-h-24 w-full rounded-lg border border-input bg-background p-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={saving || !request.trim()}
              onClick={submitRequest}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving request…' : 'Add request to trip'}
            </button>
            <button
              type="button"
              onClick={() => setRequestOpen(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            {saved && <span className="text-sm text-muted-foreground">Request added to Contributions.</span>}
          </div>
        </div>
      )}

      <VoteControls itemId={activityVoteId(activity.id)} />

      <CommentThread threadId={activityThreadId(activity.id)} />
    </article>
  )
}
