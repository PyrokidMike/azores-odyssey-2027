import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { comment, contribution, task, vote } from '@/lib/db/schema'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [votes, comments, tasks, contributions] = await Promise.all([
    db.select().from(vote),
    db.select().from(comment).orderBy(desc(comment.createdAt)),
    db.select().from(task).orderBy(desc(task.createdAt)),
    db.select().from(contribution).orderBy(desc(contribution.createdAt)),
  ])
  return NextResponse.json({
    user: { id: session.user.id, name: session.user.name },
    votes,
    comments,
    tasks,
    contributions,
  })
}
