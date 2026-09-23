'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteSavedReview } from '@/app/actions/trip-hub'

type SavedReview = { id: number; createdAt: string; authorName: string; body: string | null }

export function SavedReviewList({ reviews }: { reviews: SavedReview[] }) {
  const router = useRouter()

  async function removeReview(id: number) {
    if (!window.confirm('Delete this saved AI review? This cannot be undone.')) return
    await deleteSavedReview(id)
    router.refresh()
  }

  if (reviews.length === 0) return <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No AI reviews saved yet.</p>

  const stableTimestamp = (value: string) => value.replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC')

  return <div className="mt-4 space-y-3">{reviews.map((item) => <details key={item.id} className="rounded-xl border border-border/70 bg-secondary/30 p-4"><summary className="cursor-pointer font-medium"><time dateTime={item.createdAt}>{stableTimestamp(item.createdAt)}</time> · {item.authorName}</summary><div className="mt-3 flex items-start justify-between gap-4"><p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{item.body}</p><button type="button" onClick={() => removeReview(item.id)} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-destructive/30 px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"><Trash2 className="size-3.5" aria-hidden="true" />Delete</button></div></details>)}</div>
}
