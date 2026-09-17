'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { VoteValue } from '@/lib/trip-data'

const STORAGE_KEY = 'azores-odyssey-2027:v1'

export interface CommentEntry {
  id: string
  author: string
  text: string
  ts: number
}

interface PersistedState {
  displayName: string | null
  // itemId -> voterName -> vote
  votes: Record<string, Record<string, VoteValue>>
  // threadId -> comments
  comments: Record<string, CommentEntry[]>
}

const EMPTY: PersistedState = { displayName: null, votes: {}, comments: {} }

interface PlanningContextValue {
  ready: boolean
  displayName: string | null
  setDisplayName: (name: string) => void
  clearName: () => void
  /** Current voter's vote for an item, if any. */
  getMyVote: (itemId: string) => VoteValue | undefined
  /** All votes for an item across everyone who voted in this browser. */
  getVotes: (itemId: string) => Record<string, VoteValue>
  /** Cast (or toggle off) a vote. Opens the name prompt if no name is set. */
  castVote: (itemId: string, value: VoteValue) => void
  getComments: (threadId: string) => CommentEntry[]
  addComment: (threadId: string, text: string) => void
  /** Name-prompt dialog control. */
  namePromptOpen: boolean
  openNamePrompt: () => void
  closeNamePrompt: () => void
}

const PlanningContext = createContext<PlanningContextValue | null>(null)

export function PlanningProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(EMPTY)
  const [ready, setReady] = useState(false)
  const [namePromptOpen, setNamePromptOpen] = useState(false)
  const pendingVote = useRef<{ itemId: string; value: VoteValue } | null>(null)

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState
        setState({
          displayName: parsed.displayName ?? null,
          votes: parsed.votes ?? {},
          comments: parsed.comments ?? {},
        })
      }
    } catch {
      // Corrupt or unavailable storage — start clean.
    }
    setReady(true)
  }, [])

  // Persist on change (after initial load).
  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore write failures (private mode, quota, etc.).
    }
  }, [state, ready])

  const applyVote = useCallback(
    (name: string, itemId: string, value: VoteValue) => {
      setState((prev) => {
        const forItem = { ...(prev.votes[itemId] ?? {}) }
        if (forItem[name] === value) {
          delete forItem[name] // toggle off
        } else {
          forItem[name] = value
        }
        const votes = { ...prev.votes }
        if (Object.keys(forItem).length === 0) {
          delete votes[itemId]
        } else {
          votes[itemId] = forItem
        }
        return { ...prev, votes }
      })
    },
    [],
  )

  const setDisplayName = useCallback(
    (name: string) => {
      const clean = name.trim().slice(0, 40)
      if (!clean) return
      setState((prev) => ({ ...prev, displayName: clean }))
      setNamePromptOpen(false)
      const pending = pendingVote.current
      if (pending) {
        pendingVote.current = null
        applyVote(clean, pending.itemId, pending.value)
      }
    },
    [applyVote],
  )

  const clearName = useCallback(() => {
    setState((prev) => ({ ...prev, displayName: null }))
  }, [])

  const castVote = useCallback(
    (itemId: string, value: VoteValue) => {
      const name = state.displayName
      if (!name) {
        pendingVote.current = { itemId, value }
        setNamePromptOpen(true)
        return
      }
      applyVote(name, itemId, value)
    },
    [state.displayName, applyVote],
  )

  const addComment = useCallback(
    (threadId: string, text: string) => {
      const clean = text.trim()
      if (!clean) return
      const author = state.displayName?.trim() || 'Anonymous'
      const entry: CommentEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        author,
        text: clean.slice(0, 1000),
        ts: Date.now(),
      }
      setState((prev) => ({
        ...prev,
        comments: {
          ...prev.comments,
          [threadId]: [...(prev.comments[threadId] ?? []), entry],
        },
      }))
    },
    [state.displayName],
  )

  const value = useMemo<PlanningContextValue>(
    () => ({
      ready,
      displayName: state.displayName,
      setDisplayName,
      clearName,
      getMyVote: (itemId) =>
        state.displayName ? state.votes[itemId]?.[state.displayName] : undefined,
      getVotes: (itemId) => state.votes[itemId] ?? {},
      castVote,
      getComments: (threadId) => state.comments[threadId] ?? [],
      addComment,
      namePromptOpen,
      openNamePrompt: () => setNamePromptOpen(true),
      closeNamePrompt: () => {
        pendingVote.current = null
        setNamePromptOpen(false)
      },
    }),
    [ready, state, setDisplayName, clearName, castVote, addComment, namePromptOpen],
  )

  return <PlanningContext.Provider value={value}>{children}</PlanningContext.Provider>
}

export function usePlanning() {
  const ctx = useContext(PlanningContext)
  if (!ctx) throw new Error('usePlanning must be used within PlanningProvider')
  return ctx
}
