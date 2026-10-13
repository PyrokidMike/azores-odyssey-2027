'use client'

import { getKpi, KPI_ROWS, migrateLegacyKpis, renderKpi } from '@/lib/accommodation-kpis'

export function AccommodationKpiGrid({ property }: { property: Record<string, any> }) {
  const kpis = property.kpis && Object.keys(property.kpis).length ? property.kpis : migrateLegacyKpis(property)
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{KPI_ROWS.map(([label, path]) => <div key={path} className="min-h-14 rounded-lg border border-border/70 bg-secondary/30 p-2"><strong className="block text-foreground">{renderKpi(getKpi(kpis, path))}</strong><span className="text-xs text-muted-foreground">{label}</span></div>)}</div>
}
