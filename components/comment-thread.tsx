'use client'

import { useState } from 'react'
import { deleteComment } from '@/app/actions/trip-hub'
import { MessageSquare, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePlanning } from '@/components/planning-provider'

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
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const submit = () => {
    if (!text.trim()) return
    addComment(threadId, text)
    setText('')
  }

  const removeComment = async (id: string) => {
    if (!window.confirm('Delete this comment?')) return
    setDeleteError(null)
    const numericId = Number(id)
    if (!Number.isInteger(numericId) || numericId <= 0) {
      setDeleteError('This comment could not be identified. Refresh the page and try again.')
      return
    }
    try {
      await deleteComment(numericId)
      window.location.reload()
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Comment deletion failed.')
    }
  }

  return (
    <div className="border-t border-border pt-3">
      <div className="flex w-full items-center gap-2 text-sm font-medium text-foreground">
        <MessageSquare className="size-4 text-muted-foreground" aria-hidden="true" />
        Comments
        {comments.length > 0 && (
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {comments.length}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-3">
          {comments.length === 0 && (
            <p className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
              No comments yet. Add the first note for the group.
            </p>
          )}
          {deleteError && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{deleteError}</p>}
          {comments.length > 0 && (
            <ul className="space-y-2.5">
              {comments.map((c) => (
                <li key={c.id} className="rounded-lg bg-muted/60 px-2.5 py-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">{c.author}</span>
                    <div className="flex items-center gap-2"><span className="text-[0.7rem] text-muted-foreground">{timeAgo(c.ts)}</span>{c.author === 'Agent Max' && <button type="button" onClick={() => removeComment(c.id)} className="text-[0.7rem] font-semibold text-destructive hover:underline" aria-label="Delete Agent Max comment"><Trash2 className="size-3" aria-hidden="true" /></button>}</div>
                  </div>
                  <p className="mt-0.5 text-[0.8rem] leading-relaxed text-foreground/85">{c.text}</p>
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
Notes are saved to your account and shared with the planning group.
          </p>
        </div>
    </div>
  )
}
