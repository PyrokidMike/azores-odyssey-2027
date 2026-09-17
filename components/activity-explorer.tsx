'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import {
  ACTIVITIES,
  CATEGORIES,
  INTENSITIES,
  ISLANDS,
  type CategoryId,
  type Intensity,
  type Island,
} from '@/lib/trip-data'
import { ActivityCard } from '@/components/activity-card'
import { cn } from '@/lib/utils'

type CatFilter = CategoryId | 'all'

export function ActivityExplorer() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CatFilter>('all')
  const [island, setIsland] = useState<Island | 'all'>('all')
  const [intensity, setIntensity] = useState<Intensity | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ACTIVITIES.filter((a) => {
      if (category !== 'all' && a.category !== category) return false
      if (island !== 'all' && !a.islands.includes(island)) return false
      if (intensity !== 'all' && a.intensity !== intensity) return false
      if (q && !(`${a.name} ${a.notes} ${a.fitNote}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [query, category, island, intensity])

  const hasFilters =
    query !== '' || category !== 'all' || island !== 'all' || intensity !== 'all'

  const reset = () => {
    setQuery('')
    setCategory('all')
    setIsland('all')
    setIntensity('all')
  }

  const catTabs: { id: CatFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...CATEGORIES.map((c) => ({ id: c.id as CatFilter, label: c.label })),
  ]

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-background/85 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5 sm:shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {catTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id)}
              aria-pressed={category === tab.id}
              className={cn(
                'min-h-9 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                category === tab.id
                  ? 'bg-navy text-primary-foreground'
                  : 'border border-border bg-background text-foreground/75 hover:border-foreground/25',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search activities…"
              aria-label="Search activities"
              className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="island-filter">
              Filter by island
            </label>
            <div className="relative">
              <SlidersHorizontal
                className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <select
                id="island-filter"
                value={island}
                onChange={(e) => setIsland(e.target.value as Island | 'all')}
                className="h-11 rounded-lg border border-input bg-background pl-8 pr-8 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <option value="all">All islands</option>
                {ISLANDS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <label className="sr-only" htmlFor="intensity-filter">
              Filter by intensity
            </label>
            <select
              id="intensity-filter"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as Intensity | 'all')}
              className="h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <option value="all">Any intensity</option>
              {INTENSITIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {ACTIVITIES.length} activities
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filtered.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <p className="font-serif text-lg text-foreground">No activities match these filters.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try widening your search or clearing the filters.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
