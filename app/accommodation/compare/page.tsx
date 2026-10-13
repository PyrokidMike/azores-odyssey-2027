import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getAccommodation } from '@/app/actions/accommodations'
import { PageHeader } from '@/components/page-header'
import Link from 'next/link'
import { getKpi, KPI_ROWS, migrateLegacyKpis, renderKpi } from '@/lib/accommodation-kpis'

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() }); if (!session?.user) redirect('/sign-in')
  const params = await searchParams; const ids = (params.ids ?? '').split(',').map(Number).filter(Boolean).slice(0, 4); const records = (await Promise.all(ids.map(getAccommodation))).filter(Boolean) as NonNullable<Awaited<ReturnType<typeof getAccommodation>>>[]
  const rows = KPI_ROWS
  return <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><PageHeader eyebrow="Side-by-side review" title="Compare places" intro="Compare the facts we have without treating missing price or availability data as a ranking." />{records.length < 2 ? <div className="rounded-2xl border border-dashed border-border p-8 text-center"><p>Select two to four places from the catalogue first.</p><Link className="mt-3 inline-block underline" href="/accommodation">Back to accommodation</Link></div> : <div className="overflow-x-auto rounded-2xl border border-border"><table className="min-w-[720px] w-full border-collapse text-left text-sm"><thead><tr className="bg-muted"><th className="sticky left-0 bg-muted p-4">Attribute</th>{records.map(({ property }) => <th key={property.id} className="p-4 align-top"><Link className="font-serif text-lg underline" href={`/accommodation/${property.id}`}>{property.name}</Link></th>)}</tr></thead><tbody>{rows.map(([label, key]) => <tr key={key} className="border-t border-border"><th className="sticky left-0 bg-card p-4 font-medium">{label}</th>{records.map(({ property }) => <td key={property.id} className="p-4">{renderKpi(getKpi(property.kpis && Object.keys(property.kpis).length ? property.kpis : migrateLegacyKpis(property), key))}</td>)}</tr>)}<tr className="border-t border-border"><th className="sticky left-0 bg-card p-4">Amenities</th>{records.map(({ property }) => <td key={property.id} className="p-4">{Object.entries(property.amenities ?? {}).filter(([, value]) => value === true).map(([name]) => name).join(', ') || 'Unknown'}</td>)}</tr></tbody></table></div>}</main>
}
