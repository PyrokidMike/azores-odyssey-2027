'use client'

import dynamic from 'next/dynamic'

const SiteNav = dynamic(() => import('@/components/site-nav').then((module) => module.SiteNav), {
  ssr: false,
})

export function ClientSiteNav() {
  return <SiteNav />
}
