'use client'

import type { CSSProperties } from 'react'
import { VOTE_OPTIONS, type VoteValue } from '@/lib/trip-data'
import { usePlanning } from '@/components/planning-provider'
import { cn } from '@/lib/utils'

const VOTE_COLOR: Record<VoteValue, string> = {
  must: 'var(--green)',
  interested: 'var(--azure)',
  skip: 'oklch(0.62 0.06 70)',
  no: 'var(--destructive)',
}

export function VoteControls({
  itemId,
  label,
}: {
  itemId: string
  label?: string
}) {
  const { getMyVote, getVotes, castVote } = usePlanning()
  const myVote = getMyVote(itemId)
  const votes = getVotes(itemId)
  const total = Object.keys(votes).length

  return (
    <div>
      {label && (
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      )}
      <div
        className="grid grid-cols-2 gap-1.5 sm:grid-cols-4"
        role="group"
        aria-label={label ? `Vote: ${label}` : 'Vote'}
      >
        {VOTE_OPTIONS.map((opt) => {
          const active = myVote === opt.value
          const color = VOTE_COLOR[opt.value]
          const count = Object.values(votes).filter((v) => v === opt.value).length
          const style: CSSProperties = active
            ? {
                backgroundColor: `color-mix(in oklab, ${color} 16%, transparent)`,
                borderColor: `color-mix(in oklab, ${color} 55%, transparent)`,
                color: `color-mix(in oklab, ${color} 80%, var(--charcoal))`,
              }
            : {}
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => castVote(itemId, opt.value)}
              style={style}
              className={cn(
                'flex min-h-11 flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center text-[0.8rem] font-medium leading-tight transition-colors',
                active
                  ? 'shadow-sm'
                  : 'border-border bg-background text-foreground/75 hover:border-foreground/25 hover:bg-muted',
              )}
            >
              <span>{opt.label}</span>
              {count > 0 && (
                <span className="text-[0.68rem] font-semibold opacity-70">{count}</span>
              )}
            </button>
          )
        })}
      </div>
      {total > 0 && (
        <p className="mt-1.5 text-[0.7rem] text-muted-foreground">
          {total} {total === 1 ? 'vote' : 'votes'} in this browser
        </p>
      )}
    </div>
  )
}
