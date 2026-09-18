'use client'

import { useState } from 'react'
import { addContribution } from '@/app/actions/trip-hub'

export function ContributionBoard() {
  const [kind, setKind] = useState<'note' | 'link'>('note')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saved, setSaved] = useState(false)
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!body.trim()) return; await addContribution({ kind, title, body }); setTitle(''); setBody(''); setSaved(true) }
  return <form onSubmit={submit} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4"><div className="flex gap-2">{(['note', 'link'] as const).map((option) => <button type="button" key={option} onClick={() => setKind(option)} className={`min-h-11 rounded-md border px-4 text-sm ${kind === option ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}>{option === 'note' ? 'Note' : 'Link'}</button>)}</div><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title" className="min-h-11 rounded-md border border-border bg-background px-3 text-base" /><textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder={kind === 'link' ? 'Paste a source link and what it tells us…' : 'Share a finding, constraint, or idea…'} className="min-h-32 rounded-md border border-border bg-background p-3 text-base" /><button className="min-h-11 rounded-md bg-primary px-4 font-medium text-primary-foreground">Add to trip</button>{saved && <p className="text-sm text-muted-foreground">Saved to the shared trip hub.</p>}</form>
}
