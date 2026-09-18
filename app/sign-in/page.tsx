import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AuthForm, AuthShell } from '@/components/auth-form'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/')
  return <AuthShell title="Welcome back" detail="Sign in to see the shared trip hub, family votes, tasks, notes, links, and photos."><AuthForm mode="sign-in" /><p className="mt-5 text-center text-sm text-muted-foreground">New to the trip hub? <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/sign-up">Create an account</Link></p></AuthShell>
}
