import test from 'node:test'
import assert from 'node:assert/strict'
// @ts-expect-error Node's strip-types runner resolves the explicit TypeScript extension.
import { KPI_ROWS, emptyKpis, getKpi, normalizeKpis, renderKpi } from '../lib/accommodation-kpis.ts'

test('complete canonical property keeps every KPI row', () => {
  const kpis = emptyKpis()
  kpis.capacity.maximumGuests = { status: 'available', value: 13 }
  kpis.distances.beach = { status: 'available', distanceKm: 1.2, durationMinutes: 15, travelMode: 'walk', destination: 'Beach', value: '1.2 km' }
  assert.equal(KPI_ROWS.length > 20, true)
  assert.equal(renderKpi(getKpi(kpis, 'capacity.maximumGuests')), '13')
  assert.equal((getKpi(kpis, 'distances.beach') as { status?: string }).status, 'available')
  const airportDriveTime = { status: 'available' as const, durationMinutes: 24, travelMode: 'driving' as const, destination: 'Ponta Delgada Airport' }
  const imported = normalizeKpis({ distances: { airport: { status: 'available', value: '18 km' }, airportDriveTime } })
  assert.equal((getKpi(imported, 'distances.airportDriveTime') as { durationMinutes?: number }).durationMinutes, 24)
  assert.equal(KPI_ROWS.some(([label, path]) => label === 'Distance to airport' && path === 'distances.airport'), true)
  assert.equal(KPI_ROWS.some(([label, path]) => label === 'Drive time from airport' && path === 'distances.airportDriveTime'), true)
})

test('missing canonical values render not verified', () => {
  const kpis = normalizeKpis(undefined)
  for (const [, path] of KPI_ROWS) assert.equal(renderKpi(getKpi(kpis, path)), 'Not verified')
})
