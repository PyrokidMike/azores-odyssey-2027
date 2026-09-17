'use client'

import { useState } from 'react'
import { MessageSquare, Send, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePlanning } from '@/components/planning-provider'
import { cn } from '@/lib/utils'

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function CommentThread({ threadId }: { threadId: string }) {
  const { getComments, addComment, displayName, openNamePrompt } = usePlanning()
  const comments = getComments(threadId)
  const [text, setText] = useState('')
  const [expanded, setExpanded] = useState(false)

  const open = expanded || comments.length === 0

  const submit = () => {
    if (!text.trim()) return
    addComment(threadId, text)
    setText('')
    setExpanded(true)
  }

  return (
    <div className="border-t border-border pt-3">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-sm font-medium text-foreground"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <MessageSquare className="size-4 text-muted-foreground" aria-hidden="true" />
          Comments
          {comments.length > 0 && (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {comments.length}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {comments.length > 0 && (
            <ul className="space-y-2.5">
              {comments.map((c) => (
                <li key={c.id} className="rounded-lg bg-muted/60 px-3 py-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">{c.author}</span>
                    <span className="text-[0.7rem] text-muted-foreground">{timeAgo(c.ts)}</span>
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-foreground/85">{c.text}</p>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing &&
                  e.keyCode !== 229
                ) {
                  e.preventDefault()
                  submit()
                }
              }}
              rows={2}
              placeholder={
                displayName ? `Add a comment as ${displayName}…` : 'Add a comment…'
              }
              className="min-h-11 flex-1 resize-y rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 sm:text-sm"
            />
            <Button
              size="icon-lg"
              onClick={submit}
              disabled={!text.trim()}
              aria-label="Post comment"
            >
              <Send className="size-4" />
            </Button>
          </div>

          {!displayName && (
            <button
              type="button"
              onClick={openNamePrompt}
              className="text-xs font-medium text-accent underline-offset-2 hover:underline"
            >
              Set your display name to sign comments
            </button>
          )}

          <p className="rounded-md bg-secondary/70 px-3 py-2 text-[0.72rem] leading-relaxed text-secondary-foreground/80">
            Prototype: saved only in this browser. Shared comments will be enabled later with
            Supabase.
          </p>
        </div>
      )}
    </div>
  )
}
