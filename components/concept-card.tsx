'use client'

import { MapPin, Sparkles, GitCompareArrows } from 'lucide-react'
import { type IslandConcept, conceptThreadId, conceptVoteId } from '@/lib/trip-data'
import { IslandBadge, Pill } from '@/components/badges'
import { VoteControls } from '@/components/vote-controls'
import { CommentThread } from '@/components/comment-thread'

export function ConceptCard({ concept }: { concept: IslandConcept }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {concept.islands.map((i) => (
            <IslandBadge key={i} island={i} />
          ))}
          {concept.minNights && <Pill tone="amber">{concept.minNights}</Pill>}
        </div>
        <h3 className="text-balance font-serif text-2xl font-semibold leading-snug text-foreground">
          {concept.title}
        </h3>
        <p className="text-pretty leading-relaxed text-foreground/85">{concept.summary}</p>
      </header>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="flex gap-2.5 rounded-xl bg-secondary/50 p-3.5">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-green" aria-hidden="true" />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Best for
            </dt>
            <dd className="mt-0.5 text-sm leading-relaxed text-foreground/85">{concept.bestFor}</dd>
          </div>
        </div>
        <div className="flex gap-2.5 rounded-xl bg-secondary/50 p-3.5">
          <GitCompareArrows className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tradeoff
            </dt>
            <dd className="mt-0.5 text-sm leading-relaxed text-foreground/85">{concept.tradeoff}</dd>
          </div>
        </div>
      </dl>

      <VoteControls itemId={conceptVoteId(concept.id)} />

      <CommentThread threadId={conceptThreadId(concept.id)} />
    </article>
  )
}
