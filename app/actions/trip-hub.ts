'use server'

import { and, asc, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { activityProgress, comment, contribution, member, task, user, vote } from '@/lib/db/schema'

async function currentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export async function saveActivityProgress(activityId: string, state = 'reviewed') {
  const current = await currentUser()
  await db.insert(activityProgress).values({ userId: current.id, activityId, state, lastViewedAt: new Date(), updatedAt: new Date() }).onConflictDoUpdate({ target: [activityProgress.userId, activityProgress.activityId], set: { state, lastViewedAt: new Date(), updatedAt: new Date() } })
  revalidatePath('/activities')
  return { ok: true }
}

export async function saveVote(itemId: string, choice: string) {
  const current = await currentUser()
  await db.insert(member).values({ userId: current.id }).onConflictDoNothing({ target: member.userId })
  await db.insert(vote).values({ userId: current.id, authorName: current.name, itemId, choice }).onConflictDoUpdate({ target: [vote.userId, vote.itemId], set: { choice, authorName: current.name, updatedAt: new Date() } })
  revalidatePath('/')
  return { ok: true }
}

export async function addComment(threadId: string, body: string) {
  const current = await currentUser()
  const clean = body.trim()
  if (!clean || clean.length > 2000) throw new Error('Invalid comment')
  await db.insert(comment).values({ userId: current.id, authorName: current.name, threadId, body: clean })
  revalidatePath('/')
  return { ok: true }
}

export async function addAdminCommentReply(threadId: string, body: string) {
  const current = await currentUser()
  if (current.email.toLowerCase() !== (process.env.ADMIN_EMAIL ?? 'admin@test.com').toLowerCase()) throw new Error('Unauthorized')
  const clean = body.trim()
  if (!clean || clean.length > 2000) throw new Error('Invalid comment')
  await db.insert(comment).values({ userId: current.id, authorName: current.name, threadId, body: clean })
  revalidatePath('/admin')
  revalidatePath('/')
  return { ok: true }
}

export async function listPeople() {
  await currentUser()
  return db.select({ id: user.id, name: user.name, email: user.email }).from(user).innerJoin(member, eq(member.userId, user.id)).orderBy(asc(user.name))
}

export async function createTask(input: { title: string; detail?: string; assigneeId?: string; dueDate?: string; itemRef?: string; itemLabel?: string }) {
  const current = await currentUser()
  const assignee = input.assigneeId ? (await db.select({ id: user.id, name: user.name }).from(user).where(eq(user.id, input.assigneeId)).limit(1))[0] : undefined
  await db.insert(task).values({ creatorId: current.id, creatorName: current.name, title: input.title.trim(), detail: input.detail?.trim() || null, assigneeId: assignee?.id ?? null, assigneeName: assignee?.name ?? null, dueDate: input.dueDate ? new Date(input.dueDate) : null, itemRef: input.itemRef ?? null, itemLabel: input.itemLabel ?? null })
  revalidatePath('/tasks')
  return { ok: true }
}

export async function updateTask(id: number, input: { status?: string; findings?: string }) {
  const current = await currentUser()
  const existing = (await db.select({ creatorId: task.creatorId, assigneeId: task.assigneeId }).from(task).where(eq(task.id, id)).limit(1))[0]
  if (!existing || (existing.creatorId !== current.id && existing.assigneeId !== current.id)) throw new Error('Unauthorized')
  await db.update(task).set({ ...(input.status ? { status: input.status } : {}), ...(input.findings !== undefined ? { findings: input.findings } : {}), updatedAt: new Date() }).where(eq(task.id, id))
  revalidatePath('/tasks')
  return { ok: true }
}

export async function listTasks() {
  await currentUser()
  return db.select().from(task).orderBy(desc(task.createdAt))
}

export async function saveReviewReport(body: string) {
  const current = await currentUser()
  if (current.email.toLowerCase() !== (process.env.ADMIN_EMAIL ?? 'admin@test.com').toLowerCase()) throw new Error('Unauthorized')
  const clean = body.trim()
  if (!clean || clean.length > 20000) throw new Error('Invalid review')
  await db.insert(contribution).values({ userId: current.id, authorName: current.name, kind: 'note', title: 'AI group review', body: clean, itemLabel: 'Admin review' })
  revalidatePath('/admin')
  return { ok: true }
}

export async function addContribution(input: { kind: 'note' | 'link' | 'photo'; title?: string; body?: string; photoPathname?: string; taskId?: number; itemRef?: string; itemLabel?: string }) {
  const current = await currentUser()
  await db.insert(contribution).values({ userId: current.id, authorName: current.name, kind: input.kind, title: input.title?.trim() || null, body: input.body?.trim() || null, photoPathname: input.photoPathname ?? null, taskId: input.taskId ?? null, itemRef: input.itemRef ?? null, itemLabel: input.itemLabel ?? null })
  revalidatePath('/contributions')
  return { ok: true }
}
