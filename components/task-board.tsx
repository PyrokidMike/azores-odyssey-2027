'use client'

import { useState } from 'react'
import { createTask, updateTask } from '@/app/actions/trip-hub'

type Task = { id: number; title: string; detail: string | null; status: string; assigneeName: string | null; dueDate: Date | null; findings: string | null }
type Person = { id: string; name: string; email: string }

export function TaskBoard({ initialTasks, people }: { initialTasks: Task[]; people: Person[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [pending, setPending] = useState(false)

  async function add(event: React.FormEvent) {
    event.preventDefault()
    if (!title.trim()) return
    setPending(true)
    await createTask({ title, detail })
    setTasks([{ id: Date.now(), title, detail: detail || null, status: 'todo', assigneeName: null, dueDate: null, findings: null }, ...tasks])
    setTitle(''); setDetail(''); setPending(false)
  }

  async function finish(task: Task) {
    await updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })
    setTasks(tasks.map((item) => item.id === task.id ? { ...item, status: item.status === 'done' ? 'todo' : 'done' } : item))
  }

  return <div className="flex flex-col gap-6"><form onSubmit={add} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"><h2 className="font-serif text-2xl">Add a follow-up</h2><input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Confirm Pico ferry capacity" className="min-h-11 rounded-md border border-border bg-background px-3 text-base" /><textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="What needs checking?" className="min-h-24 rounded-md border border-border bg-background p-3 text-base" /><button disabled={pending} className="min-h-11 rounded-md bg-primary px-4 font-medium text-primary-foreground">{pending ? 'Saving…' : 'Create task'}</button></form><div className="flex flex-col gap-3">{tasks.length === 0 && <p className="text-muted-foreground">No tasks yet.</p>}{tasks.map((task) => <article key={task.id} className="rounded-xl border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-medium">{task.title}</h3>{task.detail && <p className="mt-2 text-sm leading-6 text-muted-foreground">{task.detail}</p>}</div><button onClick={() => finish(task)} className="min-h-11 shrink-0 rounded-md border border-border px-3 text-sm">{task.status === 'done' ? 'Reopen' : 'Done'}</button></div><p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{task.assigneeName ?? 'Unassigned'} · {task.status}</p>{task.findings && <p className="mt-2 border-t border-border pt-2 text-sm">{task.findings}</p>}</article>)}</div></div>
}
