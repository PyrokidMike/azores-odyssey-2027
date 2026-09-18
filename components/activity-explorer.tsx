'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import {
  ACTIVITIES,
  CATEGORIES,
  COLLECTIONS,
  INTENSITIES,
  ISLANDS,
  OPTIONAL_THEMES,
  type CategoryId,
  type Collection,
  type Intensity,
  type Island,
  type OptionalTheme,
} from '@/lib/trip-data'
import { ActivityCard } from '@/components/activity-card'
import { cn } from '@/lib/utils'

type CatFilter = CategoryId | 'all'

export function ActivityExplorer({
  initialProgress = [],
}: {
  initialProgress?: { activityId: string; state: string }[]
}) {
  const [query, setQuery] = useState('')
  const [collection, setCollection] = useState<Collection>('core')
  const [category, setCategory] = useState<CatFilter>('all')
  const [island, setIsland] = useState<Island | 'all'>('all')
  const [intensity, setIntensity] = useState<Intensity | 'all'>('all')
  const [theme, setTheme] = useState<OptionalTheme | 'all'>('all')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ACTIVITIES.filter((a) => {
      if ((a.collection ?? 'core') !== collection) return false
      if (collection === 'optional' && theme !== 'all' && a.theme !== theme) return false
      if (category !== 'all' && a.category !== category) return false
      if (island !== 'all' && !a.islands.includes(island)) return false
      if (intensity !== 'all' && a.intensity !== intensity) return false
      if (q && !(`${a.name} ${a.notes} ${a.fitNote}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [query, collection, theme, category, island, intensity])

  const collectionTotal = useMemo(
    () => ACTIVITIES.filter((a) => (a.collection ?? 'core') === collection).length,
    [collection],
  )

  const activeCollection = COLLECTIONS.find((c) => c.id === collection)

  const hasFilters =
    query !== '' ||
    category !== 'all' ||
    island !== 'all' ||
    intensity !== 'all' ||
    theme !== 'all'

  const reset = () => {
    setQuery('')
    setCategory('all')
    setIsland('all')
    setIntensity('all')
    setTheme('all')
  }

  const selectCollection = (id: Collection) => {
    setCollection(id)
    setTheme('all')
  }

  const catTabs: { id: CatFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...CATEGORIES.map((c) => ({ id: c.id as CatFilter, label: c.label })),
  ]

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Activity collections">
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={collection === c.id}
              onClick={() => selectCollection(c.id)}
              className={cn(
                'min-h-11 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition-colors',
                collection === c.id
                  ? 'border-navy bg-navy text-primary-foreground'
                  : 'border-border bg-card text-foreground/80 hover:border-foreground/25',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        {activeCollection && (
          <p className="max-w-2xl text-pretty text-sm text-muted-foreground">
            {activeCollection.blurb}
          </p>
        )}
      </div>

      <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5 sm:shadow-sm">
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          className="flex min-h-11 w-full items-center justify-between gap-3 text-left"
        >
          <span>
            <span className="block text-sm font-semibold text-foreground">Filter activities</span>
            <span className="block text-xs text-muted-foreground">
              {filtered.length} of {collectionTotal} showing{hasFilters ? ' · filters active' : ''}
            </span>
          </span>
          <ChevronDown className={cn('size-5 text-muted-foreground transition-transform', filtersOpen && 'rotate-180')} aria-hidden="true" />
        </button>

        {filtersOpen && (
          <div className="pt-3">
        {collection === 'optional' && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Theme
            </span>
            <button
              type="button"
              onClick={() => setTheme('all')}
              aria-pressed={theme === 'all'}
              className={cn(
                'min-h-9 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                theme === 'all'
                  ? 'bg-accent text-accent-foreground'
                  : 'border border-border bg-background text-foreground/75 hover:border-foreground/25',
              )}
            >
              All
            </button>
            {OPTIONAL_THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
                className={cn(
                  'min-h-9 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  theme === t
                    ? 'bg-accent text-accent-foreground'
                    : 'border border-border bg-background text-foreground/75 hover:border-foreground/25',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}
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
            {filtered.length} of {collectionTotal} in this collection
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
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filtered.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              reviewed={initialProgress.some((item) => item.activityId === activity.id && item.state === 'reviewed')}
            />
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
