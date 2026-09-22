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
  if (session.user.email.toLowerCase() !== (process.env.ADMIN_EMAIL ?? 'admin@test.com').toLowerCase()) redirect('/')
  const [votes, comments, tasks, contributions] = await Promise.all([
    db.select().from(vote).orderBy(desc(vote.updatedAt)),
    db.select().from(comment).orderBy(desc(comment.createdAt)),
    db.select().from(task).orderBy(desc(task.createdAt)),
    db.select().from(contribution).orderBy(desc(contribution.createdAt)),
  ])
  const openTasks = tasks.filter((item) => item.status !== 'done')
  const recentVotes = votes.slice(0, 8)
  const recentComments = comments.slice(0, 5)
  const recentContributions = contributions.slice(0, 5)

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageHeader eyebrow="Private admin" title="Trip control room" intro="A live summary of what the group has decided, what needs attention, and what people have added." />
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[['Votes recorded', votes.length], ['Comments', comments.length], ['Open tasks', openTasks.length], ['Research / reports', contributions.length]].map(([label, count]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-serif text-3xl">{count}</p></div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-serif text-2xl">Latest group votes</h2>
          <p className="mt-1 text-sm text-muted-foreground">The latest position from each person and the item they voted on.</p>
          <div className="mt-4 space-y-3">{recentVotes.map((item) => <div key={item.id} className="border-b border-border pb-3 last:border-0"><p className="font-medium">{item.itemId}</p><p className="text-sm text-muted-foreground">{item.authorName} chose <span className="font-semibold text-foreground">{item.choice}</span> · {new Date(item.updatedAt).toLocaleDateString()}</p></div>)}{recentVotes.length === 0 && <p className="text-sm text-muted-foreground">No votes have been recorded yet.</p>}</div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-serif text-2xl">What needs attention</h2>
          <p className="mt-1 text-sm text-muted-foreground">Open follow-ups, link reports, and research notes.</p>
          <div className="mt-4 space-y-3">{openTasks.slice(0, 6).map((item) => <div key={`task-${item.id}`} className="border-b border-border pb-3 last:border-0"><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.status} · {item.assigneeName ?? 'Unassigned'}{item.itemLabel ? ` · ${item.itemLabel}` : ''}</p></div>)}{recentContributions.map((item) => <div key={`contribution-${item.id}`} className="border-b border-border pb-3 last:border-0"><p className="font-medium">{item.title ?? item.kind}</p><p className="text-sm text-muted-foreground">{item.authorName} · {item.itemLabel ?? 'General contribution'}</p></div>)}{openTasks.length === 0 && recentContributions.length === 0 && <p className="text-sm text-muted-foreground">Nothing needs attention yet.</p>}</div>
        </section>
      </div>
      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-serif text-2xl">Recent comments</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{recentComments.map((item) => <div key={item.id} className="rounded-lg bg-secondary/50 p-3"><p className="text-sm leading-relaxed">“{item.body}”</p><p className="mt-2 text-xs text-muted-foreground">{item.authorName} · {item.threadId}</p></div>)}{recentComments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}</div>
      </section>
    </main>
  )
}
