import { redirect } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'
import { desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { comment, contribution, task, vote } from '@/lib/db/schema'
import { PageHeader } from '@/components/page-header'
import { AdminReviewPanel } from '@/components/admin-review-panel'
import { AdminCommentReply } from '@/components/admin-comment-reply'
import { AccommodationAdmin } from '@/components/accommodation-admin'
import { accommodation } from '@/lib/db/schema'
import { ReviewApprovalQueue } from '@/components/review-approval-queue'
import { SavedReviewList } from '@/components/saved-review-list'
import { ACTIVITIES, DECISIONS, ISLAND_CONCEPTS } from '@/lib/trip-data'
import { CheckCircle2, CircleAlert, ClipboardList, MessageSquare, ShieldCheck, Vote } from 'lucide-react'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  if (session.user.email.toLowerCase() !== (process.env.ADMIN_EMAIL ?? 'admin@test.com').toLowerCase()) redirect('/')
  const [votes, comments, tasks, contributions, accommodations] = await Promise.all([
    db.select().from(vote).orderBy(desc(vote.updatedAt)),
    db.select().from(comment).orderBy(desc(comment.createdAt)),
    db.select().from(task).orderBy(desc(task.createdAt)),
    db.select().from(contribution).orderBy(desc(contribution.createdAt)),
    db.select().from(accommodation).orderBy(desc(accommodation.updatedAt)),
  ])
  const openTasks = tasks.filter((item) => item.status !== 'done')
  const recentVotes = votes.slice(0, 8)
  const recentComments = comments.slice(0, 5)
  const recentContributions = contributions.filter((item) => item.itemLabel !== 'Admin review').slice(0, 5)
  const recentReviews = contributions.filter((item) => item.itemLabel === 'Admin review').slice(0, 5)
  const lastReviewAt = recentReviews[0]?.createdAt.getTime() ?? 0
  const reviewItems = [
    ...comments.map((item) => {
      const isAgentResponse = item.authorName.trim().toLowerCase() === 'agent max'
      const isQuestion = /\?|^(who|what|where|when|why|how|can|could|does|do|is|are|will|would|should)\b/i.test(item.body.trim())
      const normalizedThreadId = item.threadId === 'act:canyoning-cabrito' && /caldeir(?:õ|o)es|age 6|120 cm|20 kg/i.test(item.body) ? 'act:canyoning-caldeiroes' : item.threadId
      const activity = ACTIVITIES.find((entry) => `act:${entry.id}` === normalizedThreadId)
      return { kind: isAgentResponse ? 'agent_response' : isQuestion ? 'visitor_question' : 'visitor_comment', sourceId: `comment_${item.id}`, threadId: normalizedThreadId, threadTitle: activity?.name ?? normalizedThreadId, author: item.authorName, title: activity?.name ?? normalizedThreadId, detail: item.body, researchStatus: isAgentResponse ? 'answered' : isQuestion ? 'pending' : 'not_a_question', answeredAt: isAgentResponse ? item.createdAt.toISOString() : null, latestAnswerId: isAgentResponse ? `comment_${item.id}` : null, createdAt: item.createdAt.toISOString() }
    }),
    ...contributions.filter((item) => item.itemLabel !== 'Admin review').map((item) => ({ kind: item.kind === 'link' ? 'group_information_request' : 'contribution', sourceId: `contribution_${item.id}`, threadId: null, threadTitle: null, author: item.authorName, title: item.title ?? item.itemLabel ?? item.kind, detail: item.body ?? item.photoPathname ?? 'Added to the workspace', createdAt: item.createdAt.toISOString() })),
    ...tasks.map((item) => ({ kind: 'action_item', sourceId: `task_${item.id}`, threadId: null, threadTitle: null, author: item.creatorName, title: item.title, detail: `${item.status} · ${item.detail ?? 'Follow-up task'}`, createdAt: item.createdAt.toISOString() })),
    ...votes.map((item) => {
      const activityId = item.itemId.replace(/^activity:/, '')
      const activity = ACTIVITIES.find((entry) => entry.id === activityId)
      const decision = DECISIONS.find((entry) => item.itemId === `decision:${entry.id}` || item.itemId === `dec:${entry.id}`)
      const concept = ISLAND_CONCEPTS.find((entry) => item.itemId === `concept:${entry.id}` || item.itemId === `dec:${entry.id}`)
      const threadId = activity ? `act:${activity.id}` : decision ? `dec:${decision.id}` : concept ? `dec:${concept.id}` : null
      return { kind: 'vote', sourceId: `vote_${item.id}`, threadId, threadTitle: activity?.name ?? decision?.title ?? concept?.title ?? null, author: item.authorName, title: activity?.name ?? decision?.title ?? concept?.title ?? item.itemId, detail: `Choice: ${item.choice}`, choice: item.choice, createdAt: item.updatedAt.toISOString() }
    }),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageHeader eyebrow="Private admin" title="Trip control room" intro="A live summary of what the group has decided, what needs attention, and what people have added." />
      <section className="mb-6 rounded-2xl border border-border bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl">Accommodation research</h2><p className="mt-1 text-sm text-muted-foreground">Review submissions, update research status, and manage the shared property catalogue.</p></div><Link className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" href="/accommodation">Open accommodation</Link></div></section>
      <AccommodationAdmin properties={accommodations} />
      <AdminReviewPanel items={reviewItems} activityCatalog={ACTIVITIES.map(({ id, name, islands, groupFit, fitNote, intensity, notes, urgency, status, link }) => ({ id, name, islands, groupFit, fitNote, intensity, notes, urgency, status, link }))} />
      <ReviewApprovalQueue reviews={recentReviews.map((item) => ({ id: item.id, createdAt: item.createdAt.toISOString(), body: item.body ?? '' }))} comments={comments.map((item) => ({ id: item.id, threadId: item.threadId, body: item.body, authorName: item.authorName }))} />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Votes recorded', count: votes.length, detail: 'Group positions saved', icon: Vote, tone: 'bg-cyan-400 text-slate-950' },
          { label: 'Comments', count: comments.length, detail: 'Discussion notes', icon: MessageSquare, tone: 'bg-lime-400 text-slate-950' },
          { label: 'Open tasks', count: openTasks.length, detail: openTasks.length ? 'Needs follow-up' : 'Nothing outstanding', icon: ClipboardList, tone: openTasks.length ? 'bg-yellow-300 text-slate-950' : 'bg-muted text-muted-foreground' },
          { label: 'Research / reports', count: contributions.length, detail: 'Items added by the group', icon: ShieldCheck, tone: 'bg-fuchsia-400 text-slate-950' },
        ].map(({ label, count, detail, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-2 font-serif text-4xl text-foreground">{count}</p></div>
              <span className={`flex size-10 items-center justify-center rounded-xl ${tone}`}><Icon className="size-5" aria-hidden="true" /></span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-serif text-2xl">Latest group votes</h2>
          <p className="mt-1 text-sm text-muted-foreground">The latest position from each person and the item they voted on.</p>
          <div className="mt-4 space-y-3">{recentVotes.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border/70 bg-background p-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-slate-950"><Vote className="size-4" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="truncate font-medium">{item.itemId}</p><p className="text-sm text-muted-foreground">{item.authorName} · {item.updatedAt.toISOString()}</p></div><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">{item.choice}</span></div>)}{recentVotes.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No votes have been recorded yet.</p>}</div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-serif text-2xl">What needs attention</h2>
          <p className="mt-1 text-sm text-muted-foreground">Open follow-ups, link reports, and research notes.</p>
          <div id="attention" className="mt-4 space-y-3">{openTasks.slice(0, 6).map((item) => <details key={`task-${item.id}`} id={`task-${item.id}`} className="group rounded-xl border border-yellow-300/50 bg-yellow-300/10 p-3"><summary className="flex cursor-pointer list-none items-start gap-3"><CircleAlert className="mt-0.5 size-5 shrink-0 text-yellow-500" aria-hidden="true" /><span className="min-w-0"><span className="block font-medium">{item.title}</span><span className="block text-sm text-muted-foreground">{item.status} · {item.assigneeName ?? 'Unassigned'}{item.itemLabel ? ` · ${item.itemLabel}` : ''}</span></span></summary><p className="mt-3 border-t border-yellow-300/40 pt-3 text-sm leading-relaxed text-foreground">{item.detail ?? 'No additional detail was provided.'}</p></details>)}{recentContributions.map((item) => <details key={`contribution-${item.id}`} id={`contribution-${item.id}`} className="group rounded-xl border border-fuchsia-400/40 bg-fuchsia-400/10 p-3"><summary className="flex cursor-pointer list-none items-start gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-fuchsia-500" aria-hidden="true" /><span className="min-w-0"><span className="block font-medium">{item.title ?? item.kind}</span><span className="block text-sm text-muted-foreground">{item.authorName} · {item.itemLabel ?? 'General contribution'}</span></span></summary><p className="mt-3 border-t border-fuchsia-400/40 pt-3 text-sm leading-relaxed text-foreground">{item.body ?? item.photoPathname ?? 'No additional detail was provided.'}</p></details>)}{openTasks.length === 0 && recentContributions.length === 0 && <p className="flex items-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground"><CheckCircle2 className="size-4 text-lime-500" aria-hidden="true" />Nothing needs attention yet.</p>}</div>
        </section>
      </div>
      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3"><div><h2 className="font-serif text-2xl">Saved AI reviews</h2><p className="mt-1 text-sm text-muted-foreground">Your pasted research summaries and action-item notes.</p></div><span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">{recentReviews.length}</span></div>
        <SavedReviewList reviews={recentReviews.map((item) => ({ id: item.id, createdAt: item.createdAt.toISOString(), authorName: item.authorName, body: item.body }))} />
      </section>
      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-serif text-2xl">Recent comments</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{recentComments.map((item) => <div key={item.id} className="rounded-xl border border-border/70 bg-secondary/40 p-4"><div className="flex items-center gap-2"><MessageSquare className="size-4 text-lime-500" aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.authorName}</span></div><p className="mt-2 text-sm leading-relaxed">“{item.body}”</p><p className="mt-3 text-xs text-muted-foreground">Related to {item.threadId}</p><AdminCommentReply comment={{ ...item, createdAt: item.createdAt.toISOString() }} /></div>)}{recentComments.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No comments yet.</p>}</div>
      </section>
    </main>
  )
}
