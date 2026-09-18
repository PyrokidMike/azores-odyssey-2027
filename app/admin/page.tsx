import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { comment, contribution, task, vote } from '@/lib/db/schema'
import { PageHeader } from '@/components/page-header'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const [votes, comments, tasks, contributions] = await Promise.all([db.select().from(vote), db.select().from(comment).orderBy(desc(comment.createdAt)), db.select().from(task).orderBy(desc(task.createdAt)), db.select().from(contribution).orderBy(desc(contribution.createdAt))])
  return <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6"><PageHeader eyebrow="Private admin" title="Trip control room" intro="Shared votes, comments, follow-ups, and contributions from the authenticated trip hub." /><div className="mt-8 grid gap-4 sm:grid-cols-4">{[['Votes', votes.length], ['Comments', comments.length], ['Open tasks', tasks.filter((item) => item.status !== 'done').length], ['Contributions', contributions.length]].map(([label, count]) => <div key={label} className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-serif text-3xl">{count}</p></div>)}</div><section className="mt-8 rounded-xl border border-border bg-card p-4"><h2 className="font-serif text-2xl">Outstanding items</h2><div className="mt-4 flex flex-col gap-3">{tasks.filter((item) => item.status !== 'done').slice(0, 10).map((item) => <div key={item.id} className="flex flex-col gap-1 border-b border-border pb-3 last:border-0"><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.assigneeName ?? 'Unassigned'} · {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No due date'}</p></div>)}{tasks.filter((item) => item.status !== 'done').length === 0 && <p className="text-sm text-muted-foreground">No outstanding tasks.</p>}</div></section></main>
}
