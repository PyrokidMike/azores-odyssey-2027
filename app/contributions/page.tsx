import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { ContributionBoard } from '@/components/contribution-board'
import { PageHeader } from '@/components/page-header'

export default async function ContributionsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6"><PageHeader eyebrow="Shared workroom" title="Trip contributions" intro="Add notes and links that become part of the shared planning record. Photo uploads are supported through the private trip storage route." /><div className="mt-8"><ContributionBoard /></div></main>
}
