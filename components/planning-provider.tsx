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
import { addComment as saveComment, saveVote as saveSharedVote } from '@/app/actions/trip-hub'
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
  comments: Record<string, CommentEntry[]>
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
  const [sharedLoaded, setSharedLoaded] = useState(false)
  const [namePromptOpen, setNamePromptOpen] = useState(false)
  const pendingVote = useRef<{ itemId: string; value: VoteValue } | null>(null)

  // Pull the shared (account) history from the server. Safe to call repeatedly.
  const loadShared = useCallback(async () => {
    try {
      const response = await fetch('/api/hub/state', { cache: 'no-store' })
      if (!response.ok) return
      const data = await response.json()
      if (!data?.user) return
      const votes: PersistedState['votes'] = {}
      for (const entry of data.votes ?? []) {
        const itemVotes = (votes[entry.itemId] ??= {})
        itemVotes[entry.authorName || entry.userId] = entry.choice as VoteValue
      }
      const comments: PersistedState['comments'] = {}
      for (const entry of data.comments ?? []) {
        const threadComments = (comments[entry.threadId] ??= [])
        threadComments.push({
          id: String(entry.id),
          author: entry.authorName,
          text: entry.body,
          ts: new Date(entry.createdAt).getTime(),
        })
      }
      setState((previous) => ({
        displayName: data.user.name ?? previous.displayName,
        votes,
        comments,
      }))
      setSharedLoaded(true)
    } catch {
      // Network/parse failure — keep whatever we already have.
    }
  }, [])

  // Load the local fallback first, then replace it with the signed-in account history.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState
        const cachedComments = Object.fromEntries(
          Object.entries(parsed.comments ?? {}).map(([threadId, entries]) => [
            threadId,
            entries.filter((entry) => entry.author !== 'Agent Max'),
          ]),
        )
        setState({
          displayName: parsed.displayName ?? null,
          votes: parsed.votes ?? {},
          comments: cachedComments,
        })
      }
    } catch {
      // Corrupt or unavailable storage — start clean.
    }

    void loadShared().finally(() => setReady(true))
  }, [loadShared])

  // Keep shared state fresh: refetch when the tab regains focus/visibility and on a short interval.
  // Without this, comments and published Agent Max replies only appear after a full page reload,
  // because the provider lives in the root layout and never remounts during in-app navigation.
  useEffect(() => {
    const refetch = () => {
      if (document.visibilityState === 'visible') void loadShared()
    }
    window.addEventListener('focus', refetch)
    document.addEventListener('visibilitychange', refetch)
    const interval = window.setInterval(refetch, 20000)
    return () => {
      window.removeEventListener('focus', refetch)
      document.removeEventListener('visibilitychange', refetch)
      window.clearInterval(interval)
    }
  }, [loadShared])

  // Keep a browser fallback for offline rendering, without overwriting account history during hydration.
  useEffect(() => {
    if (!ready || !sharedLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore write failures (private mode, quota, etc.).
    }
  }, [state, ready, sharedLoaded])

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
        void saveSharedVote(pending.itemId, pending.value)
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
      void saveSharedVote(itemId, value)
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
      void saveComment(threadId, entry.text)
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
      comments: state.comments,
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
