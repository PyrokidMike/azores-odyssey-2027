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
  const packet = {
    packetId: `review_packet_${new Date().toISOString()}`,
    tripFacts: {
      trip: 'Azores family trip',
      travelWindow: 'June 2027; exact dates not yet finalized',
      currentHeadcount: { adults: 6, children: 7, total: 13 },
      possibleFinalHeadcounts: [9, 13],
      families: 3,
      knownConstraints: [
        'Swimming ability, motion sickness, heights/cliffs, cave comfort, hiking tolerance, and hard no preferences must be checked against the supplied comments and votes.',
        'Activities may need split-group treatment when age, height, weight, comfort, or weather constraints apply.',
      ],
    },
    activities: activityCatalog,
    items: items.map((item) => ({
      sourceId: item.sourceId,
      threadId: item.threadId,
      threadTitle: item.threadTitle,
      author: firstNameOnly(item.author),
      type: item.kind,
      text: item.detail,
      choice: item.choice ?? null,
      researchStatus: item.researchStatus ?? (item.kind === 'visitor_question' ? 'pending' : item.kind === 'agent_response' ? 'answered' : item.kind === 'visitor_comment' ? 'not_a_question' : null),
      answeredAt: item.answeredAt ?? null,
      latestAnswerId: item.latestAnswerId ?? null,
      createdAt: item.createdAt,
    })),
  }
  const prompt = `<text_attachment>\n\n<url>\nhttps://blobs.vusercontent.net/blob/%5BPasted%2070%20lines%5D-pEWMI21NZCnvaWdsOnHTg9SRq4WRq9\n</url>\n\n</text_attachment>\n\nYou are Perplexity, the research assistant supporting Agent Max for the Azores 2027 family trip. Follow this instruction before analyzing the packet: research each unanswered visitor question using current, authoritative sources; answer only questions tied to an exact sourceId and threadId; preserve every sourceId, threadId, threadTitle, author, and question text exactly; and return the JSON object requested below so it can be pasted back into the trip control room and automatically posted to the original activity thread. Never guess a destination or combine questions from different threads.\n\nYou are Agent Max, the curated Azores 2027 family-trip planning reviewer.

Before writing your output, reason internally through a four-perspective council. Do NOT include this reasoning in your output.
1. Family logistics — headcount, children, ages/heights/weights, room and vehicle capacity, activity group limits, booking logistics, island-transfer friction.
2. Adventure and safety — swimming ability, motion sickness, fear of heights/cliffs, cave comfort, hiking difficulty, weather exposure, age/height/weight gates, split-group suitability.
3. Itinerary strategy — whether preferences support São Miguel only, São Miguel + Terceira, São Miguel + Faial/Pico, or a larger multi-island expedition; account for early/mid/late June and 7/11/13-night implications.
4. Skeptical reviewer — contradictions, vague comments, unverified assumptions, broken/outdated links, duplicates, data-entry mistakes.

Trip context:
- June 2027 Azores family trip. Three families, currently modeled as 6 adults and 7 children. Possible final headcount: 9 or 13.
- The group uses Azores Odyssey 2027 as a curated presentation and voting app. Do not do autonomous travel research, make bookings, or make final decisions. Do not invent facts beyond the supplied updates.

Privacy:
- First names only. No surnames, emails, account IDs, tokens, or private profile details. Preserve source links only when present and relevant.

Interpretation rules:
- "Must" is a strong individual priority, not a group decision. "No" is a likely personal hard no; distinguish it from "skip."
- Comments are context, not verified facts. If votes and comments conflict, flag the conflict instead of resolving it.
- Treat an activity as whole-group only if no eligibility/comfort constraint suggests otherwise; otherwise classify it as a possible split-group option.

OUTPUT CONTRACT — return ONE JSON object, and nothing else. No prose, no Markdown, no code fences.

Rules for alignment:
- Research only items with type visitor_question and researchStatus pending. Do not answer agent_response, visitor_comment, vote, contribution, or action_item records.
- For every pending visitor_question, produce one visitorReplies entry when an answer is appropriate. Copy sourceId, threadId, threadTitle, author, and text EXACTLY from that packet item; use them as questionAuthor and questionText. Put your answer in responseText.
- If a visitor_question already has a matching agent_response in the same thread, mark it as answered in unalignedItems or omit it from visitorReplies rather than creating a duplicate.
- Canonical IDs are mandatory: activities use act:<activity-slug>; itinerary decisions use dec:<decision-slug>. Votes include their exact threadId/threadTitle when linked. Interpret must/interested/skip/no only in the context of that exact threadTitle. Never detach or relink a vote.
- A vote with no exact threadId is an unresolved data-quality item; report it in groupInformationRequests and do not infer its destination.
- Use tripFacts, knownConstraints, and the activities catalog as the review context. Activity entries include provider link, islands/location, group fit, fit notes, intensity, urgency, research status, and curated notes. Do not invent missing age, height, weight, group-size, weather, or date facts; flag them in groupInformationRequests or linkChecks.
- NEVER invent, guess, or word-match a threadId. If you cannot tie an answer to an exact packet item, put it in unalignedItems instead.
- Put operational facts the group must decide/provide (that are not a direct reply to a thread question) in groupInformationRequests.
- Put tasks in actionItems and link problems in linkChecks.

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
        <div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Review packet</h3><button type="button" onClick={copyPrompt} className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"><CopyIcon className="size-4" aria-hidden="true" />{copied ? 'Copied' : 'Copy prompt'}</button></div><p className="mt-2 text-xs text-muted-foreground">Includes trip facts, known constraints, the full curated activity catalog with provider links and rules, and all current visitor comments, votes, tasks, and group information with stable source IDs, exact thread IDs, first names, and dates.</p><div className="mt-3 max-h-64 overflow-auto rounded-lg bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground">{items.map((item, index) => <div key={`${item.kind}-${item.createdAt}-${index}`} className="border-b border-border/50 py-2 last:border-0"><span className="font-semibold text-foreground">{item.kind} · {item.title}</span><br />{firstNameOnly(item.author)} · {item.detail}</div>)}{items.length === 0 && <p>No new updates yet.</p>}</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold">Paste AI review</h3><textarea value={result} onChange={(event) => { setResult(event.target.value); setSaved(false) }} placeholder="Paste the action items, broken-link notes, and information requests here…" className="mt-3 min-h-44 w-full resize-y rounded-lg border border-input bg-background p-3 text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring/40" /><div className="mt-3 flex items-center justify-between gap-3"><p className="text-xs text-muted-foreground">Saved reviews stay in this admin dashboard as notes.</p><button type="button" onClick={saveResult} disabled={!result.trim()} className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-40"><Save className="size-4" aria-hidden="true" />{saved ? 'Saved' : 'Save review'}</button></div></div>
      </div>
    </section>
  )
}
