'use client'

import { useState } from 'react'
import { MessageSquareReply, Send } from 'lucide-react'
import { addAdminCommentReply } from '@/app/actions/trip-hub'

type AdminComment = { id: number; authorName: string; threadId: string; body: string; createdAt: string }

export function AdminCommentReply({ comment }: { comment: AdminComment }) {
  const [reply, setReply] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function submitReply() {
    if (!reply.trim()) return
    setStatus('saving')
    try {
      await addAdminCommentReply(comment.threadId, reply)
      setReply('')
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mt-3 border-t border-border/70 pt-3">
      <label htmlFor={`reply-${comment.id}`} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
        <MessageSquareReply className="size-3.5" aria-hidden="true" />
        Admin response
      </label>
      <div className="mt-2 flex gap-2">
        <input id={`reply-${comment.id}`} value={reply} onChange={(event) => { setReply(event.target.value); setStatus('idle') }} placeholder="Share an update on this request…" className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40" />
        <button type="button" onClick={submitReply} disabled={!reply.trim() || status === 'saving'} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40"><Send className="size-4" aria-hidden="true" />{status === 'saving' ? 'Sending' : 'Reply'}</button>
      </div>
      {status === 'saved' && <p className="mt-2 text-xs text-accent">Response added to this thread.</p>}
      {status === 'error' && <p className="mt-2 text-xs text-destructive">Could not add the response. Please try again.</p>}
    </div>
  )
}
