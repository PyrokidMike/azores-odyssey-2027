import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { PageHeader } from '@/components/page-header'
import { ResultsView } from '@/components/results-view'

export const metadata: Metadata = {
  title: 'Admin Dashboard — Azores Odyssey 2027',
  description:
    'Private admin view of shared group votes, comments, tasks, and contributions.',
}

export default async function ResultsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  if (session.user.email.toLowerCase() !== (process.env.ADMIN_EMAIL ?? 'admin@test.com').toLowerCase()) redirect('/')

  return (
    <>
      <PageHeader
        eyebrow="Admin only"
        title="Admin Dashboard"
        intro="A private view of shared group votes, ranked by support. Use the admin control room for recent comments, follow-ups, research notes, and reported links."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ResultsView />
      </div>
    </>
  )
}
