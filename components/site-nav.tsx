'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, UserRound, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePlanning } from '@/components/planning-provider'
import { useSession, signOut } from '@/lib/auth-client'

const ADMIN_EMAIL = 'admin@test.com'

const NAV = [
  { href: '/', label: 'Overview' },
  { href: '/decisions', label: 'Group Decisions' },
  { href: '/activities', label: 'Activity Explorer' },
  { href: '/concepts', label: 'Island Concepts' },
  { href: '/accommodation', label: 'Accommodation' },
]

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { displayName, openNamePrompt } = usePlanning()
  const { data: session } = useSession()
  const isAdmin = session?.user?.email?.toLowerCase() === ADMIN_EMAIL
  const visibleNav = isAdmin
    ? [...NAV, { href: '/admin', label: 'Admin Dashboard' }]
    : NAV

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-navy text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-full bg-azure/20 text-azure ring-1 ring-azure/40">
            <Compass className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-base font-semibold tracking-tight">
              Azores Odyssey
            </span>
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-primary-foreground/60">
              2027 Expedition
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary-foreground/12 text-primary-foreground'
                  : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openNamePrompt}
            className="hidden items-center gap-1.5 rounded-full border border-primary-foreground/20 px-3 py-1.5 text-xs font-medium text-primary-foreground/85 transition-colors hover:border-primary-foreground/40 hover:text-primary-foreground sm:flex"
          >
            <UserRound className="size-3.5" aria-hidden="true" />
            {displayName ?? 'Set your name'}
          </button>
          {session?.user ? (
            <button
              type="button"
              onClick={() => signOut({ fetchOptions: { onSuccess: () => window.location.reload() } })}
              className="hidden rounded-full border border-primary-foreground/20 px-3 py-1.5 text-xs font-medium text-primary-foreground/85 transition-colors hover:border-primary-foreground/40 hover:text-primary-foreground sm:inline-flex"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="hidden rounded-full border border-primary-foreground/20 px-3 py-1.5 text-xs font-medium text-primary-foreground/85 transition-colors hover:border-primary-foreground/40 hover:text-primary-foreground sm:inline-flex"
            >
              Sign in
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-primary-foreground/10 bg-navy px-4 pb-4 pt-2 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {visibleNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block rounded-md px-3 py-3 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary-foreground/12 text-primary-foreground'
                      : 'text-primary-foreground/75 hover:bg-primary-foreground/10',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              {session?.user ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    signOut({ fetchOptions: { onSuccess: () => window.location.reload() } })
                  }}
                  className="mt-1 flex w-full items-center gap-2 rounded-md border border-primary-foreground/20 px-3 py-3 text-sm font-medium text-primary-foreground/85"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="mt-1 flex w-full items-center rounded-md border border-primary-foreground/20 px-3 py-3 text-sm font-medium text-primary-foreground/85"
                >
                  Sign in
                </Link>
              )}
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  openNamePrompt()
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-md border border-primary-foreground/20 px-3 py-3 text-sm font-medium text-primary-foreground/85"
              >
                <UserRound className="size-4" aria-hidden="true" />
                {displayName ? `Signed as ${displayName}` : 'Set your name'}
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
