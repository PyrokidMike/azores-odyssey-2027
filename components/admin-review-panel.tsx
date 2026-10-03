'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Clipboard, Check, Save, Sparkles } from 'lucide-react'
import { saveReviewReport } from '@/app/actions/trip-hub'

type ReviewItem = { kind: string; sourceId: string; threadId: string | null; threadTitle: string | null; author?: string; title: string; detail: string; choice?: string; researchStatus?: string; answeredAt?: string | null; latestAnswerId?: string | null; createdAt: string }
type ActivityCatalogItem = { id: string; name: string; islands: string[]; groupFit: string; fitNote: string; intensity: string; notes: string; urgency: string; status: string; link: string }

function firstNameOnly(name?: string) {
  const firstName = name?.trim().split(/\s+/)[0]
  return firstName || 'Unknown'
}

export function AdminReviewPanel({ items, activityCatalog }: { items: ReviewItem[]; activityCatalog: ActivityCatalogItem[] }) {
  const router = useRouter()
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const pendingQuestions = items.filter((item) => item.kind === 'visitor_question' && item.researchStatus !== 'answered')
  const pendingThreadIds = new Set(pendingQuestions.map((item) => item.threadId).filter(Boolean))
  const linkedVotes = items.filter((item) => item.kind === 'vote' && item.threadId && pendingThreadIds.has(item.threadId))
  const relevantActivities = activityCatalog.filter((activity) => pendingThreadIds.has(`act:${activity.id}`))
  const packet = {
    packetId: `review_packet_${new Date().toISOString()}`,
    trip: { date: 'June 2027', adults: 6, children: 7, possibleTotals: [9, 13] },
    questions: pendingQuestions.map((item) => ({ id: item.sourceId, thread: item.threadId, activity: item.threadTitle, by: firstNameOnly(item.author), question: item.detail })),
    votes: linkedVotes.map((item) => ({ thread: item.threadId, activity: item.threadTitle, by: firstNameOnly(item.author), choice: item.choice })),
    activities: relevantActivities.map(({ id, name, islands, groupFit, fitNote, intensity, notes, link }) => ({ id: `act:${id}`, name, islands, groupFit, fitNote, intensity, notes, link })),
    groupContext: 'Check swimming, motion sickness, heights/cliffs, caves, hiking, age/height/weight gates, weather, and split-group needs. Do not invent missing facts.',
  }
  const prompt = `<text_attachment>\n\n<url>\nhttps://blobs.vusercontent.net/blob/%5BPasted%2070%20lines%5D-pEWMI21NZCnvaWdsOnHTg9SRq4WRq9\n</url>\n\n</text_attachment>\n\nYou are Perplexity. Research each pending question below with current authoritative sources. Preserve every id, thread, activity, author, and question exactly. Never guess or combine threads. Return only the JSON below so answers can be posted to the original threads.\n\n

Use the trip and activity context. Review logistics, safety, fit, missing facts, and links. Do not invent facts or make bookings. Return one JSON object only—no prose, Markdown, or code fences.

For each question, return one visitorReplies item. Copy id, thread, activity, by, and question exactly; never guess or combine threads. Put group follow-ups in groupInformationRequests, not visitorReplies. Use this shape:
{
  "packetId": "exact packetId",
  "visitorReplies": [{ "sourceId": "question id", "threadId": "thread", "threadTitle": "activity", "questionAuthor": "author", "questionText": "question", "responseText": "researched answer" }],
  "groupInformationRequests": [{ "requestText": "needed input", "reason": "why", "threadTitle": "activity or null" }],
  "actionItems": [{ "text": "task", "priority": "High|Medium|Low", "owner": "owner" }],
  "linkChecks": [{ "text": "issue" }],
  "unalignedItems": [{ "sourceId": "id or null", "originalText": "text", "reason": "why" }]
}

Use exactly this shape:
{
  "packetId": "copy the packetId exactly",
  "visitorReplies": [{ "sourceId": "exact sourceId", "threadId": "exact threadId", "threadTitle": "exact threadTitle", "questionAuthor": "exact first name", "questionText": "exact text", "responseText": "your answer" }],
  "groupInformationRequests": [{ "requestText": "information the group needs", "reason": "why it matters", "threadTitle": "related activity or null" }],
  "actionItems": [{ "text": "specific task", "priority": "High|Medium|Low", "owner": "Name, Group, or Trip organizer" }],
  "linkChecks": [{ "text": "the link issue, or 'No link issues identified from the supplied updates.'" }],
  "unalignedItems": [{ "sourceId": "sourceId or null", "originalText": "text", "reason": "why it cannot align to a thread" }]
}

REVIEW PACKET JSON:
${JSON.stringify(packet, null, 2)}

Return valid JSON only, matching the shape above, with no Markdown or code fences.`

  const CopyIcon = copied ? Check : Clipboard

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function saveResult() {
    if (!result.trim()) return
    try {
      await saveReviewReport(result.trim())
      setSaved(true)
      setResult('')
      router.refresh()
    } catch {
      setSaved(false)
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div><div className="flex items-center gap-2"><Sparkles className="size-5 text-accent" aria-hidden="true" /><h2 className="font-serif text-2xl">Admin review queue</h2></div><p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">The packet includes the complete current set of visitor comments, votes, tasks, and group information. Copy it into Perplexity, then paste Perplexity&apos;s JSON response back here so aligned replies can return to their original threads and group requests can be collected separately.</p></div>
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">{items.length} updates ready</span>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Review packet</h3><button type="button" onClick={copyPrompt} className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"><CopyIcon className="size-4" aria-hidden="true" />{copied ? 'Copied' : 'Copy prompt'}</button></div><p className="mt-2 text-xs text-muted-foreground">Includes only pending visitor questions, their linked votes, and the relevant activity details to stay within Perplexity&apos;s character limit.</p><div className="mt-3 max-h-64 overflow-auto rounded-lg bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground">{items.map((item, index) => <div key={`${item.kind}-${item.createdAt}-${index}`} className="border-b border-border/50 py-2 last:border-0"><span className="font-semibold text-foreground">{item.kind} · {item.title}</span><br />{firstNameOnly(item.author)} · {item.detail}</div>)}{items.length === 0 && <p>No new updates yet.</p>}</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold">Paste AI review</h3><textarea value={result} onChange={(event) => { setResult(event.target.value); setSaved(false) }} placeholder="Paste the action items, broken-link notes, and information requests here…" className="mt-3 min-h-44 w-full resize-y rounded-lg border border-input bg-background p-3 text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring/40" /><div className="mt-3 flex items-center justify-between gap-3"><p className="text-xs text-muted-foreground">Saved reviews stay in this admin dashboard as notes.</p><button type="button" onClick={saveResult} disabled={!result.trim()} className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-40"><Save className="size-4" aria-hidden="true" />{saved ? 'Saved' : 'Save review'}</button></div></div>
      </div>
    </section>
  )
}
