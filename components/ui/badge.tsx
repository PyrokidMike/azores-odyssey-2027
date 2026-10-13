import * as React from 'react'
import { cn } from '@/lib/utils'
export function Badge({ className, variant = 'default', ...props }: React.ComponentProps<'span'> & { variant?: 'default' | 'secondary' | 'outline' }) { return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', variant === 'outline' ? 'border border-border text-foreground' : variant === 'secondary' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground', className)} {...props} /> }
