'use client'

import { useMemo, useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { addContribution, createTask } from '@/app/actions/trip-hub'

type Review = { id: number; createdAt: string; body: string }
type Proposal = { id: string; kind: 'task' | 'note' | 'question' | 'link'; text: string; source: string; status: 'pending' | 'approved' | 'dismissed' }

const sectionKinds: Record<string, Proposal['kind']> = {
  'ACTION ITEMS': 'task',
  'INFORMATION THE GROUP NEEDS': 'note',
  'OPEN QUESTIONS': 'question',
  'BROKEN OR QUESTIONABLE LINKS': 'link',
}

function extractProposals(review: Review): Proposal[] {
  const sections = review.body.split(/^##\s+/m).slice(1)
  return sections.flatMap((section) => {
    const [heading, ...lines] = section.split('\n')
    const kind = sectionKinds[heading.trim().toUpperCase()]
    if (!kind) return []
    return lines.filter((line) => /^\s*[-*]/.test(line)).map((line, index) => ({
      id: `${review.id}-${heading}-${index}`,
      kind,
      text: line.replace(/^\s*[-*]\s*/, '').trim(),
      source: heading.trim(),
      status: 'pending' as const,
    }))
  })
}

export function ReviewApprovalQueue({ reviews }: { reviews: Review[] }) {
  const [items, setItems] = useState(() => reviews.flatMap(extractProposals))
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const pending = items.filter((item) => item.status === 'pending')

  const grouped = useMemo(() => ({
    task: pending.filter((item) => item.kind === 'task'),
    note: pending.filter((item) => item.kind === 'note'),
    question: pending.filter((item) => item.kind === 'question'),
    link: pending.filter((item) => item.kind === 'link'),
  }), [pending])

  function updateItem(id: string, text: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, text } : item))
    setEditing(null)
  }

  async function approve(item: Proposal) {
    setSaving(item.id)
    if (item.kind === 'task') await createTask({ title: item.text, detail: `Approved from AI review · ${item.source}`, itemLabel: 'AI review action item' })
    else await addContribution({ kind: 'note', title: item.kind === 'question' ? 'Group question' : item.kind === 'link' ? 'Link review' : 'Group information', body: item.text, itemLabel: item.kind === 'question' ? 'AI review question' : item.kind === 'link' ? 'AI review link check' : 'AI review note' })
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'approved' } : entry))
    setSaving(null)
  }

  return <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Admin approval queue</p><h2 className="mt-1 font-serif text-2xl">Apply review findings</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Review each AI suggestion before it becomes visible to the group. Nothing is applied automatically.</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{pending.length} pending</span></div>
    {reviews.length === 0 ? <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Save an AI review first to generate proposed action items and group notes.</p> : <div className="mt-5 space-y-5">{Object.entries(grouped).map(([kind, entries]) => entries.length > 0 && <div key={kind}><h3 className="text-sm font-semibold capitalize text-foreground">{kind === 'task' ? 'Action items' : kind === 'note' ? 'Information for the group' : kind === 'question' ? 'Open questions' : 'Link checks'}</h3><div className="mt-2 space-y-2">{entries.map((item) => <div key={item.id} className="rounded-xl border border-border/70 bg-background p-3"><div className="flex items-start gap-3"><div className="min-w-0 flex-1">{editing === item.id ? <textarea autoFocus defaultValue={item.text} onBlur={(event) => updateItem(item.id, event.currentTarget.value)} className="min-h-20 w-full rounded-lg border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring/40" aria-label="Edit proposed item" /> : <p className="text-sm leading-relaxed text-foreground">{item.text}</p>}<p className="mt-2 text-xs text-muted-foreground">From {item.source}</p></div><div className="flex shrink-0 items-center gap-1"><button type="button" onClick={() => setEditing(item.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Edit proposed item"><Pencil className="size-4" /></button><button type="button" disabled={saving === item.id} onClick={() => approve(item)} className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground disabled:opacity-50"><Check className="mr-1 inline size-3" />Approve</button><button type="button" onClick={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'dismissed' } : entry))} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Dismiss proposed item"><X className="size-4" /></button></div></div></div>)}</div></div>)}</div>}
  </section>
}
