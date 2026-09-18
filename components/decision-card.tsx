'use client'

import { Info } from 'lucide-react'
import {
  type Decision,
  decisionOptionVoteId,
  decisionThreadId,
} from '@/lib/trip-data'
import { VoteControls } from '@/components/vote-controls'
import { CommentThread } from '@/components/comment-thread'

export function DecisionCard({ decision }: { decision: Decision }) {
  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {decision.title}
        </p>
        <h3 className="text-balance font-serif text-2xl font-semibold leading-snug text-foreground">
          {decision.question}
        </h3>
      </header>

      <div className="flex gap-2.5 rounded-xl bg-secondary/60 p-3.5">
        <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-secondary-foreground/85">{decision.notes}</p>
      </div>

      <div className="space-y-3">
        {decision.options.map((opt) => (
          <div key={opt.id} className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">{opt.label}</p>
                {decision.baselineOptionId === opt.id && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-accent">
                    Current baseline
                  </span>
                )}
              </div>
              {opt.detail && (
                <p className="mt-0.5 text-sm text-muted-foreground">{opt.detail}</p>
              )}
            </div>
            <VoteControls itemId={opt.voteId ?? decisionOptionVoteId(decision.id, opt.id)} />
          </div>
        ))}
      </div>

      <CommentThread threadId={decisionThreadId(decision.id)} />
    </article>
  )
}
