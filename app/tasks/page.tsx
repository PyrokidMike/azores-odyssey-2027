import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { listPeople, listTasks } from '@/app/actions/trip-hub'
import { PageHeader } from '@/components/page-header'
import { TaskBoard } from '@/components/task-board'

export default async function TasksPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const [tasks, people] = await Promise.all([listTasks(), listPeople()])
  return <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6"><PageHeader eyebrow="Shared workroom" title="Follow-up tasks" intro="Assign research, track due dates, and add findings so every discovery comes back to the trip." /><div className="mt-8"><TaskBoard initialTasks={tasks} people={people} /></div></main>
}
