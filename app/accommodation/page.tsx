import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { listAccommodations } from '@/app/actions/accommodations'
import { PageHeader } from '@/components/page-header'
import { AccommodationCatalogue } from '@/components/accommodation-catalogue'

export const metadata: Metadata = { title: 'Accommodation — Azores Odyssey 2027', description: 'Shared family accommodation review workspace for the June 2027 Azores trip.' }
export default async function AccommodationPage() {
  const session = await auth.api.getSession({ headers: await headers() }); if (!session?.user) redirect('/sign-in')
  const properties = await listAccommodations()
  return <main><PageHeader eyebrow="Where we stay" title="Accommodation" intro="Review places that can work for 13 travelers, share questions, and help the group choose a base for June 2027." /><AccommodationCatalogue properties={properties} /></main>
}
