'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const result = isSignUp
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password })
      if (result.error) {
        setError('We could not complete that request. Check your details and try again.')
        return
      }
      router.push('/')
      router.refresh()
    } catch {
      setError('We could not reach the sign-in service. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {isSignUp && <label className="flex flex-col gap-2 text-sm">Name<input required value={name} onChange={(e) => setName(e.target.value)} className="min-h-11 rounded-md border border-border bg-background px-3 text-base" autoComplete="name" /></label>}
      <label className="flex flex-col gap-2 text-sm">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-11 rounded-md border border-border bg-background px-3 text-base" autoComplete="email" /></label>
      <label className="flex flex-col gap-2 text-sm">Password<input required minLength={4} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="min-h-11 rounded-md border border-border bg-background px-3 text-base" autoComplete={isSignUp ? 'new-password' : 'current-password'} /></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button disabled={pending} className="min-h-11 rounded-md bg-primary px-4 font-medium text-primary-foreground disabled:opacity-60">{pending ? 'Working…' : isSignUp ? 'Create account' : 'Sign in'}</button>
    </form>
  )
}

export function AuthShell({ children, title, detail }: { children: React.ReactNode; title: string; detail: string }) {
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10"><section className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm"><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Azores Odyssey 2027</p><h1 className="mt-4 font-serif text-4xl text-foreground">{title}</h1><p className="mt-3 leading-6 text-muted-foreground">{detail}</p><div className="mt-6">{children}</div></section></main>
}
