'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Inbox } from 'lucide-react'
import { usePlanning } from '@/components/planning-provider'
import {
  ACTIVITIES,
  DECISIONS,
  VOTE_OPTIONS,
  type VoteValue,
  activityVoteId,
  decisionOptionVoteId,
} from '@/lib/trip-data'
import { cn } from '@/lib/utils'

const SCORE: Record<VoteValue, number> = { must: 2, interested: 1, skip: -1, no: -2 }

const TONE: Record<VoteValue, string> = {
  must: 'bg-green',
  interested: 'bg-azure',
  skip: 'bg-muted-foreground/50',
  no: 'bg-destructive',
}

function tally(votes: Record<string, VoteValue>) {
  const counts: Record<VoteValue, number> = { must: 0, interested: 0, skip: 0, no: 0 }
  let score = 0
  const values = Object.values(votes)
  for (const v of values) {
    counts[v] += 1
    score += SCORE[v]
  }
  return { counts, score, total: values.length }
}

function VoteBar({ votes }: { votes: Record<string, VoteValue> }) {
  const { counts, total } = tally(votes)
  if (total === 0) {
    return <p className="text-sm text-muted-foreground">No votes yet</p>
  }
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        {VOTE_OPTIONS.map((opt) =>
          counts[opt.value] > 0 ? (
            <span
              key={opt.value}
              className={cn('h-full', TONE[opt.value])}
              style={{ width: `${(counts[opt.value] / total) * 100}%` }}
            />
          ) : null,
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {VOTE_OPTIONS.map((opt) => (
          <span key={opt.value} className="inline-flex items-center gap-1.5">
            <span className={cn('size-2 rounded-full', TONE[opt.value])} aria-hidden="true" />
            {opt.label}: <strong className="text-foreground">{counts[opt.value]}</strong>
          </span>
        ))}
      </div>
    </div>
  )
}

function RankedList({
  items,
}: {
  items: { id: string; label: string; sub?: string; votes: Record<string, VoteValue> }[]
}) {
  const ranked = useMemo(
    () =>
      [...items]
        .map((it) => ({ ...it, ...tally(it.votes) }))
        .sort((a, b) => b.score - a.score || b.total - a.total),
    [items],
  )

  const anyVotes = ranked.some((r) => r.total > 0)
  if (!anyVotes) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
        <Inbox className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
        <p className="mt-2 text-sm text-muted-foreground">
          No votes recorded in this browser yet.
        </p>
      </div>
    )
  }

  return (
    <ul className="grid gap-3">
      {ranked.map((item, idx) => (
        <li
          key={item.id}
          className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                {idx + 1}
              </span>
              <div>
                <p className="font-medium leading-snug text-foreground">{item.label}</p>
                {item.sub && (
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {item.sub}
                  </p>
                )}
              </div>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums',
                item.score > 0
                  ? 'bg-green/15 text-green'
                  : item.score < 0
                    ? 'bg-destructive/15 text-destructive'
                    : 'bg-secondary text-secondary-foreground',
              )}
            >
              {item.score > 0 ? `+${item.score}` : item.score}
            </span>
          </div>
          <div className="mt-3">
            <VoteBar votes={item.votes} />
          </div>
        </li>
      ))}
    </ul>
  )
}

function Section({
  title,
  desc,
  children,
}: {
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-serif text-2xl font-semibold text-foreground">{title}</h2>
      <p className="mt-1 mb-5 text-sm text-muted-foreground">{desc}</p>
      {children}
    </section>
  )
}

export function ResultsView() {
  const { getVotes } = usePlanning()

  const decisionItems = DECISIONS.flatMap((d) =>
    d.options.map((o) => ({
      id: decisionOptionVoteId(d.id, o.id),
      label: o.label,
      sub: d.title,
      votes: getVotes(decisionOptionVoteId(d.id, o.id)),
    })),
  )

  const activityItems = ACTIVITIES.map((a) => ({
    id: activityVoteId(a.id),
    label: a.name,
    sub: a.category,
    votes: getVotes(activityVoteId(a.id)),
  }))

  return (
    <div>
      <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm leading-relaxed text-foreground/80">
        <strong>Private admin view.</strong> These tallies reflect votes, notes, tasks, and contributions saved by authenticated users in the shared planning database.
      </div>

      <Section
        title="Group decisions"
        desc="Ranked by net score across every option. Higher is stronger group support. Island concept votes are included here."
      >
        <RankedList items={decisionItems} />
      </Section>

      <Section title="Activities" desc="Every activity ranked by enthusiasm. Skips and no-thanks pull the score down.">
        <RankedList items={activityItems} />
      </Section>

      <div className="mt-12 flex flex-col items-start gap-3 rounded-2xl border border-border bg-navy p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-lg font-semibold">Missing a vote?</p>
          <p className="text-sm text-primary-foreground/75">
            Jump back into the rooms and make your picks count.
          </p>
        </div>
        <Link
          href="/activities"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Back to activities
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
