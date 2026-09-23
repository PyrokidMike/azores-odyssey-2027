'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { addContribution, createTask, publishAgentMaxReply } from '@/app/actions/trip-hub'

type Review = { id: number; createdAt: string; body: string }
type Comment = { id: number; threadId: string; body: string; authorName: string }
type Proposal = { id: string; kind: 'task' | 'note' | 'question' | 'link'; text: string; source: string; status: 'pending' | 'approved' | 'dismissed'; replyThreadId?: string; threadLabel?: string; question?: string; questionAuthor?: string; aligned: boolean }

function findExactThread(text: string, comments: Comment[]) {
  const normalizedText = text.toLowerCase()
  const matches = comments.filter((comment) => {
    const thread = comment.threadId.toLowerCase()
    const activitySlug = thread.replace(/^act:/, '').replace(/[-_]/g, ' ')
    return activitySlug.length > 3 && normalizedText.includes(activitySlug)
  })
  return matches.length === 1 ? matches[0].threadId : undefined
}

const sectionKinds: Record<string, Proposal['kind']> = {
  'ACTION ITEMS': 'task',
  'INFORMATION THE GROUP NEEDS': 'note',
  'OPEN QUESTIONS': 'question',
  'BROKEN OR QUESTIONABLE LINKS': 'link',
}

function extractProposals(review: Review): Proposal[] {
  const normalized = review.body.replace(/\r\n/g, '\n')
  const sectionPattern = /(?:^|\n)\s*(?:#{1,6}\s*)?(COUNCIL FLAGS|ACTION ITEMS|BROKEN OR QUESTIONABLE LINKS|INFORMATION THE GROUP NEEDS|OPEN QUESTIONS|SHORT SUMMARY)\s*:?[ \t]*(?=\n|$)/gi
  const matches = [...normalized.matchAll(sectionPattern)]
  const proposals: Proposal[] = []

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index]
    const heading = match[1].trim()
    const kind = sectionKinds[heading.toUpperCase()]
    if (!kind) continue
    const start = (match.index ?? 0) + match[0].length
    const end = matches[index + 1]?.index ?? normalized.length
    const body = normalized.slice(start, end)
    const lines = body.split('\n').map((line) => line.trim()).filter(Boolean)
    const bullets = lines.filter((line) => /^(?:[-*•]|\d+[.)])\s+/.test(line))
    const candidates = bullets.length > 0 ? bullets : lines.filter((line) => !/^\[?priority:/i.test(line) && !/^no link issues identified/i.test(line))
    candidates.forEach((line, itemIndex) => {
      const text = line.replace(/^(?:[-*•]|\d+[.)])\s+/, '').trim()
      if (!text) return
      const metadata = text.match(/^THREAD:\s*(.+?)\s*\|\s*QUESTION BY:\s*(.+?)\s*\|\s*QUESTION:\s*(.+?)\s*\|\s*RESPONSE:\s*(.+)$/i)
      proposals.push({
        id: `${review.id}-${heading}-${itemIndex}`,
        kind,
        text: metadata?.[4]?.trim() ?? text,
        source: heading,
        status: 'pending',
        replyThreadId: metadata?.[1]?.trim() !== 'UNALIGNED' ? metadata?.[1]?.trim() : undefined,
        threadLabel: metadata?.[1]?.trim(),
        questionAuthor: metadata?.[2]?.trim(),
        question: metadata?.[3]?.trim(),
        aligned: Boolean(metadata && metadata[1].trim() !== 'UNALIGNED'),
      })
    })
  }

  return proposals
}

export function ReviewApprovalQueue({ reviews, comments }: { reviews: Review[]; comments: Comment[] }) {
  const threadOptions: Comment[] = []
  const withMatchedThreads = (proposals: Proposal[]) => proposals.map((proposal) => {
    const hasThread = Boolean(proposal.replyThreadId && comments.some((comment) => comment.threadId === proposal.replyThreadId))
    return { ...proposal, aligned: proposal.aligned && hasThread }
  })
  const [items, setItems] = useState(() => withMatchedThreads(reviews.flatMap(extractProposals)))
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [appliedIds, setAppliedIds] = useState<Set<string>>(() => new Set())
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null)
  useEffect(() => {
    setItems(withMatchedThreads(reviews.flatMap(extractProposals)).filter((item) => !appliedIds.has(item.id)))
  }, [reviews, comments, appliedIds])

  const pending = items.filter((item) => item.status === 'pending' && !appliedIds.has(item.id))

  const grouped = useMemo(() => ({
    question: pending.filter((item) => item.kind === 'question'),
    note: pending.filter((item) => item.kind === 'note'),
    task: pending.filter((item) => item.kind === 'task'),
    link: pending.filter((item) => item.kind === 'link'),
  }), [pending])

  function updateItem(id: string, text: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, text } : item))
    setEditing(null)
  }

  async function approve(item: Proposal) {
    setSaving(item.id)
    setError(null)
    try {
      if (item.kind === 'question' || item.kind === 'note') {
        if (!item.aligned || !item.replyThreadId) throw new Error('This review item has no verified source thread. Regenerate the review with THREAD, QUESTION BY, QUESTION, and RESPONSE metadata.')
        await publishAgentMaxReply(item.replyThreadId, item.text)
      } else if (item.kind === 'task') {
        await createTask({ title: item.text, detail: `Approved from AI review · ${item.source}`, itemLabel: 'AI review action item' })
      } else {
        await addContribution({ kind: 'note', title: item.kind === 'link' ? 'Link review' : 'Group information', body: item.text, itemLabel: item.kind === 'link' ? 'AI review link check' : 'AI review note' })
      }
      setAppliedIds((current) => new Set(current).add(item.id))
      setItems((current) => current.filter((entry) => entry.id !== item.id))
      setAppliedMessage(`${item.kind === 'question' ? 'Agent Max reply' : 'Review finding'} applied successfully.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Approval could not be saved.')
    } finally {
      setSaving(null)
    }
  }

  return <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Admin approval queue</p><h2 className="mt-1 font-serif text-2xl">Apply review findings</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Review each AI suggestion before it becomes visible to the group. Nothing is applied automatically.</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{pending.length} pending</span></div>
    {error && <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    {appliedMessage && <p role="status" className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">{appliedMessage} It now appears in the original thread and Recent updates.</p>}
    {reviews.length === 0 ? <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Save an AI review first to generate proposed action items and group notes.</p> : <div className="mt-5 space-y-5">{Object.entries(grouped).map(([kind, entries]) => entries.length > 0 && <div key={kind}><h3 className="text-sm font-semibold capitalize text-foreground">{kind === 'task' ? 'Action items' : kind === 'note' ? 'Information for the group' : kind === 'question' ? 'Open questions' : 'Link checks'}</h3><div className="mt-2 space-y-2">{entries.map((item) => <div key={item.id} className="rounded-xl border border-border/70 bg-background p-3"><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><div className="mb-3 space-y-2 rounded-lg border border-border/70 bg-muted/40 p-3"><div><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Thread</p><p className="mt-1 text-sm font-medium text-foreground">{item.threadLabel ?? 'Needs alignment'}</p></div><div><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Question{item.questionAuthor ? ` · ${item.questionAuthor}` : ''}</p><p className="mt-1 text-sm leading-relaxed text-foreground">{item.question ?? 'Needs alignment — no source question was provided.'}</p></div></div><p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Suggested answer</p>{editing === item.id ? <textarea autoFocus defaultValue={item.text} onBlur={(event) => updateItem(item.id, event.currentTarget.value)} className="min-h-20 w-full rounded-lg border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring/40" aria-label="Edit proposed item" /> : <p className="text-sm leading-relaxed text-foreground">{item.text}</p>}<p className="mt-2 text-xs text-muted-foreground">From {item.source}</p>{false && <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={Boolean(item.replyThreadId)} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, replyThreadId: event.target.checked ? findExactThread(entry.text, comments) ?? threadOptions[0].threadId : undefined } : entry))} /> Post this answer in the matched thread as Agent Max</label>}{item.replyThreadId && <p className="mt-2 rounded-lg bg-accent/10 px-2.5 py-2 text-xs text-foreground">Approve this to post the answer above in the selected thread as <strong>Agent Max</strong>.</p>}{item.replyThreadId && <select value={item.replyThreadId} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, replyThreadId: event.target.value } : entry))} className="mt-2 w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs" aria-label="Choose comment thread for Agent Max reply">{threadOptions.map((thread) => <option key={thread.threadId} value={thread.threadId}>{thread.body.slice(0, 90)}{thread.body.length > 90 ? '…' : ''} · {thread.threadId}</option>)}</select>}</div><div className="flex shrink-0 items-center gap-1"><button type="button" onClick={() => setEditing(item.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Edit proposed item"><Pencil className="size-4" /></button><button type="button" disabled={saving === item.id} onClick={() => approve(item)} className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground disabled:opacity-50"><Check className="mr-1 inline size-3" />Approve</button><button type="button" onClick={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'dismissed' } : entry))} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Dismiss proposed item"><X className="size-4" /></button></div></div></div>)}</div></div>)}</div>}
  </section>
}
