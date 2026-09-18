import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AuthForm, AuthShell } from '@/components/auth-form'

export default async function SignUpPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/')
  return <AuthShell title="Join the crew" detail="Create your account so your votes, tasks, findings, notes, links, and photos are attributed to you across the shared hub."><AuthForm mode="sign-up" /><p className="mt-5 text-center text-sm text-muted-foreground">Already have an account? <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/sign-in">Sign in</Link></p></AuthShell>
}
