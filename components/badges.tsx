import type { CSSProperties } from 'react'
import { CircleCheck, CircleAlert, CircleSlash, Clock, CalendarClock, CloudSun, Waves } from 'lucide-react'
import type { GroupFit, Intensity, ResearchStatus, Urgency } from '@/lib/trip-data'
import { cn } from '@/lib/utils'

type Tone = 'green' | 'blue' | 'sand' | 'amber' | 'red' | 'neutral'

const TONE_VARS: Record<Tone, string> = {
  green: 'var(--green)',
  blue: 'var(--azure)',
  sand: 'oklch(0.62 0.06 70)',
  amber: 'oklch(0.62 0.12 74)',
  red: 'var(--destructive)',
  neutral: 'oklch(0.45 0.02 256)',
}

export function Pill({
  children,
  tone = 'neutral',
  className,
  icon,
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
  icon?: React.ReactNode
}) {
  const c = TONE_VARS[tone]
  const style: CSSProperties = {
    backgroundColor: `color-mix(in oklab, ${c} 12%, transparent)`,
    color: `color-mix(in oklab, ${c} 78%, var(--charcoal))`,
    borderColor: `color-mix(in oklab, ${c} 34%, transparent)`,
  }
  return (
    <span
      style={style}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-tight',
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

const STATUS_TONE: Record<ResearchStatus, Tone> = {
  'Confirmed research': 'green',
  'Needs 2027 confirmation': 'amber',
  'Hold / unavailable': 'red',
}

export function ResearchBadge({ status }: { status: ResearchStatus }) {
  const icon =
    status === 'Confirmed research' ? (
      <CircleCheck className="size-3.5" aria-hidden="true" />
    ) : status === 'Needs 2027 confirmation' ? (
      <CircleAlert className="size-3.5" aria-hidden="true" />
    ) : (
      <CircleSlash className="size-3.5" aria-hidden="true" />
    )
  return (
    <Pill tone={STATUS_TONE[status]} icon={icon}>
      {status}
    </Pill>
  )
}

const URGENCY_TONE: Record<Urgency, Tone> = {
  'Book early': 'red',
  'Confirm before booking': 'amber',
  Flexible: 'green',
  'Weather dependent': 'blue',
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const icon =
    urgency === 'Weather dependent' ? (
      <CloudSun className="size-3.5" aria-hidden="true" />
    ) : urgency === 'Book early' ? (
      <CalendarClock className="size-3.5" aria-hidden="true" />
    ) : (
      <Clock className="size-3.5" aria-hidden="true" />
    )
  return (
    <Pill tone={URGENCY_TONE[urgency]} icon={icon}>
      {urgency}
    </Pill>
  )
}

const INTENSITY_TONE: Record<Intensity, Tone> = {
  Easy: 'green',
  Moderate: 'amber',
  High: 'red',
}

export function IntensityBadge({ intensity }: { intensity: Intensity }) {
  return <Pill tone={INTENSITY_TONE[intensity]}>{intensity} intensity</Pill>
}

export function GroupFitBadge({ fit }: { fit: GroupFit }) {
  const tone: Tone = fit === 'Weather-flexible' ? 'blue' : 'sand'
  return (
    <Pill tone={tone} icon={<Waves className="size-3.5" aria-hidden="true" />}>
      {fit}
    </Pill>
  )
}

export function IslandBadge({ island }: { island: string }) {
  return <Pill tone="neutral">{island}</Pill>
}
