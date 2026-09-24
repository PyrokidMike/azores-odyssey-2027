'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Pencil, X, CornerUpLeft, Users, ListChecks, Link2, AlertTriangle } from 'lucide-react'
import { addContribution, createTask, publishAgentMaxReply } from '@/app/actions/trip-hub'

type Review = { id: number; createdAt: string; body: string }
type Comment = { id: number; threadId: string; body: string; authorName: string }
type Category = 'reply' | 'group' | 'task' | 'link' | 'unaligned'
type Proposal = {
  id: string
  category: Category
  text: string
  status: 'pending'
  threadId?: string
  threadTitle?: string
  question?: string
  questionAuthor?: string
  reason?: string
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function safeJson(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  try {
    const parsed = JSON.parse(trimmed)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        const parsed = JSON.parse(trimmed.slice(start, end + 1))
        return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
      } catch {
        return null
      }
    }
    return null
  }
}

function proposalsFromJson(review: Review, data: Record<string, unknown>): Proposal[] {
  const out: Proposal[] = []
  const array = (key: string) => (Array.isArray(data[key]) ? (data[key] as Record<string, unknown>[]) : [])

  array('visitorReplies').forEach((reply, index) => {
    const response = asString(reply.responseText)
    if (!response) return
    const threadId = asString(reply.threadId)
    const aligned = Boolean(threadId) && threadId.toUpperCase() !== 'UNALIGNED'
    out.push({
      id: `${review.id}-reply-${index}`,
      category: aligned ? 'reply' : 'unaligned',
      text: response,
      status: 'pending',
      threadId: aligned ? threadId : undefined,
      threadTitle: asString(reply.threadTitle) || undefined,
      question: asString(reply.questionText) || undefined,
      questionAuthor: asString(reply.questionAuthor) || undefined,
      reason: aligned ? undefined : 'Agent Max did not tie this answer to a source thread.',
    })
  })

  array('groupInformationRequests').forEach((request, index) => {
    const text = asString(request.requestText)
    if (!text) return
    out.push({
      id: `${review.id}-group-${index}`,
      category: 'group',
      text,
      status: 'pending',
      threadTitle: asString(request.threadTitle) || undefined,
      reason: asString(request.reason) || undefined,
    })
  })

  array('actionItems').forEach((action, index) => {
    const text = asString(action.text)
    if (!text) return
    const priority = asString(action.priority)
    const owner = asString(action.owner)
    out.push({
      id: `${review.id}-task-${index}`,
      category: 'task',
      text: [priority && `[${priority}]`, text, owner && `— ${owner}`].filter(Boolean).join(' '),
      status: 'pending',
    })
  })

  array('linkChecks').forEach((link, index) => {
    const text = asString(link.text)
    if (!text) return
    out.push({ id: `${review.id}-link-${index}`, category: 'link', text, status: 'pending' })
  })

  array('unalignedItems').forEach((item, index) => {
    const text = asString(item.originalText)
    if (!text) return
    out.push({
      id: `${review.id}-unaligned-${index}`,
      category: 'unaligned',
      text,
      status: 'pending',
      reason: asString(item.reason) || undefined,
    })
  })

  return out
}

function extractProposals(review: Review): Proposal[] {
  const data = safeJson(review.body)
  if (data) return proposalsFromJson(review, data)
  return [{
    id: `${review.id}-legacy`,
    category: 'unaligned',
    text: review.body.trim().slice(0, 4000),
    status: 'pending',
    reason: 'This saved review is not in the current JSON format. Regenerate it with the current Copy prompt.',
  }]
}

const sections: { key: Category; title: string; icon: typeof CornerUpLeft; hint: string }[] = [
  { key: 'reply', title: 'Answers to post in activity threads', icon: CornerUpLeft, hint: 'Posts as Agent Max in the exact thread the question was asked.' },
  { key: 'group', title: 'Information the group needs', icon: Users, hint: 'Saved as a group note — not a reply to any single thread.' },
  { key: 'task', title: 'Action items', icon: ListChecks, hint: 'Added to the task list.' },
  { key: 'link', title: 'Link checks', icon: Link2, hint: 'Saved as a note for follow-up.' },
  { key: 'unaligned', title: 'Needs a source thread — cannot post automatically', icon: AlertTriangle, hint: 'No verified thread. Save as a group note or dismiss.' },
]

export function ReviewApprovalQueue({ reviews, comments }: { reviews: Review[]; comments: Comment[] }) {
  const resolve = (proposals: Proposal[]) => proposals.map((proposal) => {
    if (proposal.category !== 'reply') return proposal
    const match = proposal.threadId && comments.find((comment) => comment.threadId === proposal.threadId)
    if (!match) {
      return { ...proposal, category: 'unaligned' as const, threadId: undefined, reason: 'The thread ID in this answer does not match any current activity thread.' }
    }
    return { ...proposal, threadTitle: proposal.threadTitle }
  })

  const [appliedIds, setAppliedIds] = useState<Set<string>>(() => new Set())
  const [items, setItems] = useState(() => resolve(reviews.flatMap(extractProposals)))
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null)

  useEffect(() => {
    setItems(resolve(reviews.flatMap(extractProposals)).filter((item) => !appliedIds.has(item.id)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews, comments, appliedIds])

  const pending = items.filter((item) => item.status === 'pending' && !appliedIds.has(item.id))
  const grouped = useMemo(() => sections.map((section) => ({ ...section, entries: pending.filter((item) => item.category === section.key) })), [pending])

  function updateItem(id: string, text: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, text } : item)))
    setEditing(null)
  }

  function dismiss(item: Proposal) {
    setAppliedIds((current) => new Set(current).add(item.id))
    setItems((current) => current.filter((entry) => entry.id !== item.id))
  }

  async function approve(item: Proposal) {
    setSaving(item.id)
    setError(null)
    try {
      if (item.category === 'reply') {
        if (!item.threadId) throw new Error('This answer has no verified source thread and cannot be posted as a reply.')
        await publishAgentMaxReply(item.threadId, item.text)
      } else if (item.category === 'task') {
        await createTask({ title: item.text, detail: 'Approved from AI review', itemLabel: 'AI review action item' })
      } else {
        await addContribution({
          kind: 'note',
          title: item.category === 'link' ? 'Link review' : 'Group information',
          body: item.text,
          itemLabel: item.category === 'link' ? 'AI review link check' : 'AI review note',
        })
      }
      setAppliedIds((current) => new Set(current).add(item.id))
      setItems((current) => current.filter((entry) => entry.id !== item.id))
      setAppliedMessage(item.category === 'reply' ? 'Posted as an Agent Max reply in its thread.' : 'Saved as a group note.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Approval could not be saved.')
    } finally {
      setSaving(null)
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Admin approval queue</p>
          <h2 className="mt-1 font-serif text-2xl">Apply review findings</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Each answer is tied to the thread its question came from. Nothing is posted until you approve it.</p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{pending.length} pending</span>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {appliedMessage && <p role="status" className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">{appliedMessage} It now appears in Recent updates.</p>}

      {reviews.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Copy the review packet into Agent Max, then paste the JSON response back to generate proposals here.</p>
      ) : pending.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">All caught up — no pending findings to apply.</p>
      ) : (
        <div className="mt-5 space-y-6">
          {grouped.map((section) => section.entries.length > 0 && (
            <div key={section.key}>
              <div className="flex items-center gap-2">
                <section.icon className={`size-4 ${section.key === 'unaligned' ? 'text-destructive' : 'text-accent'}`} aria-hidden="true" />
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">{section.entries.length}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{section.hint}</p>
              <div className="mt-2 space-y-2">
                {section.entries.map((item) => (
                  <div key={item.id} className={`rounded-xl border p-3 ${item.category === 'unaligned' ? 'border-destructive/30 bg-destructive/5' : 'border-border/70 bg-background'}`}>
                    {item.category === 'reply' && (
                      <div className="mb-3 space-y-2 rounded-lg border border-border/70 bg-muted/40 p-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Thread</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{item.threadTitle ?? item.threadId}</p>
                        </div>
                        {item.question && (
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Question{item.questionAuthor ? ` · ${item.questionAuthor}` : ''}</p>
                            <p className="mt-1 text-sm leading-relaxed text-foreground">{item.question}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {item.category === 'group' && item.reason && (
                      <p className="mb-2 text-xs text-muted-foreground">Why: {item.reason}</p>
                    )}

                    {item.category === 'unaligned' && item.reason && (
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-destructive"><AlertTriangle className="size-3.5" aria-hidden="true" />{item.reason}</p>
                    )}

                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {item.category === 'reply' ? 'Suggested answer' : item.category === 'group' ? 'Information needed' : item.category === 'task' ? 'Action item' : item.category === 'link' ? 'Link note' : 'Text'}
                    </p>
                    {editing === item.id ? (
                      <textarea
                        autoFocus
                        defaultValue={item.text}
                        onBlur={(event) => updateItem(item.id, event.currentTarget.value)}
                        className="min-h-20 w-full rounded-lg border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                        aria-label="Edit proposed item"
                      />
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{item.text}</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => approve(item)}
                        disabled={saving === item.id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90 disabled:opacity-40"
                      >
                        <Check className="size-3.5" aria-hidden="true" />
                        {saving === item.id ? 'Applying…' : item.category === 'reply' ? 'Post reply as Agent Max' : item.category === 'task' ? 'Add action item' : item.category === 'link' ? 'Save link note' : 'Save as group note'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => dismiss(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                      >
                        <X className="size-3.5" aria-hidden="true" />Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
