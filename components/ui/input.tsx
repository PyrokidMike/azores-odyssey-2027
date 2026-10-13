import * as React from 'react'
import { cn } from '@/lib/utils'
export function Input({ className, ...props }: React.ComponentProps<'input'>) { return <input className={cn('min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40', className)} {...props} /> }
