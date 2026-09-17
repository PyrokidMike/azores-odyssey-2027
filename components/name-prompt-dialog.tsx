'use client'

import { useEffect, useRef, useState } from 'react'
import { UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePlanning } from '@/components/planning-provider'

export function NamePromptDialog() {
  const { namePromptOpen, closeNamePrompt, setDisplayName, displayName, clearName } =
    usePlanning()
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (namePromptOpen) {
      setValue(displayName ?? '')
      // Focus after the dialog paints.
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [namePromptOpen, displayName])

  useEffect(() => {
    if (!namePromptOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNamePrompt()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [namePromptOpen, closeNamePrompt])

  if (!namePromptOpen) return null

  const submit = () => {
    if (value.trim()) setDisplayName(value)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/55 p-4 backdrop-blur-sm sm:items-center"
      role="presentation"
      onClick={closeNamePrompt}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="name-dialog-title"
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-azure/15 text-azure">
            <UserRound className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="name-dialog-title" className="font-serif text-xl text-foreground">
              What should we call you?
            </h2>
            <p className="text-sm text-muted-foreground">Used to label your votes and comments.</p>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="display-name" className="text-sm font-medium text-foreground">
            Display name
          </label>
          <input
            id="display-name"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                e.preventDefault()
                submit()
              }
            }}
            placeholder="e.g. Maria, Dad, The Silvas"
            maxLength={40}
            className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Saved to this browser only. No account, no server.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          {displayName ? (
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                clearName()
                setValue('')
              }}
            >
              Clear name
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="lg" onClick={closeNamePrompt}>
              Cancel
            </Button>
            <Button size="lg" onClick={submit} disabled={!value.trim()}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
