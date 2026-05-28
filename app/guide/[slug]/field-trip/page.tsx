'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getGuide } from '@/data/guides'

const MOCK_PARTICIPANTS = [
  { id: 'a', initial: 'P', color: '#B85C38' },
  { id: 'b', initial: 'J', color: '#4E7253' },
  { id: 'c', initial: 'M', color: '#6B5F7A' },
]

function generateCode(): string {
  const words = ['FIELD', 'COAST', 'BIRCH', 'ROVER', 'ATLAS', 'CREEK', 'FLINT', 'GROVE']
  return words[Math.floor(Math.random() * words.length)] + '-' +
    Math.floor(100 + Math.random() * 900)
}

type Phase = 'lobby' | 'active' | 'done'

export default function FieldTripPage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)
  const [sessionCode] = useState(generateCode)
  const [phase, setPhase] = useState<Phase>('lobby')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(sessionCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-dust">
        Guide not found. <Link href="/" className="underline ml-2">Go home</Link>
      </div>
    )
  }

  const stop = guide.stops[currentIdx]
  const isLast = currentIdx === guide.stops.length - 1

  if (phase === 'lobby') {
    return (
      <div className="min-h-screen flex flex-col bg-parchment">
        <nav className="px-6 py-4 border-b border-dashed border-fog flex items-center justify-between">
          <Link href={`/guide/${guide.slug}`} className="font-mono text-[11px] text-dust hover:text-ink transition-colors">
            ← {guide.title}
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-widest text-dust">Field Trip</span>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-md w-full animate-slide-up">

            <div className="text-center mb-10">
              <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-3">
                Session Lobby
              </div>
              <h1 className="font-mono text-3xl font-bold mb-3">{guide.title}</h1>
              <p className="font-serif text-sm text-ink/70">
                Share your code. When everyone&apos;s ready, you&apos;ll explore each stop together — at the same time.
              </p>
            </div>

            {/* Session code */}
            <div className="bg-cream card-rough p-6 mb-8 text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-3">
                Your session code
              </div>
              <div className="font-mono text-4xl font-bold tracking-widest mb-4" style={{ color: guide.accentColor }}>
                {sessionCode}
              </div>
              <button
                onClick={handleCopy}
                className="font-mono text-[11px] text-dust hover:text-ink transition-colors underline underline-offset-4"
              >
                {copied ? '✓ Copied!' : 'Copy to clipboard'}
              </button>
            </div>

            {/* Waiting participants */}
            <div className="mb-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-4">
                Waiting room
              </div>
              <div className="flex flex-col gap-3">
                {/* Host (you) */}
                <div className="flex items-center gap-3 bg-cream card-rough px-4 py-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold text-cream"
                    style={{ backgroundColor: guide.accentColor }}
                  >
                    P
                  </div>
                  <div>
                    <div className="font-mono text-[12px] font-bold">You (host)</div>
                    <div className="font-mono text-[10px] text-dust">ready</div>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-sage" />
                </div>
                {/* Mock pending participants */}
                {[1, 2].map(n => (
                  <div key={n} className="flex items-center gap-3 bg-cream card-rough px-4 py-3 opacity-40">
                    <div className="w-8 h-8 rounded-full border border-dashed border-fog flex items-center justify-center font-mono text-sm text-dust">
                      ?
                    </div>
                    <div className="font-mono text-[12px] text-dust">waiting for someone...</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPhase('active')}
              className="w-full font-mono text-sm py-3.5 px-6 bg-ink text-cream hover:bg-ink/90 transition-colors"
            >
              Begin Field Trip →
            </button>
            <p className="font-mono text-[10px] text-dust text-center mt-3">
              You can start solo — others can join mid-trip
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (phase === 'active') {
    return (
      <div className="min-h-screen flex flex-col bg-parchment">

        {/* Progress */}
        <div className="h-0.5 bg-fog">
          <div
            className="h-full transition-all duration-500 bg-ink"
            style={{ width: `${(currentIdx / guide.stops.length) * 100}%` }}
          />
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar */}
          <aside className="w-64 border-r border-dashed border-fog flex flex-col bg-cream hidden md:flex">
            <div className="px-5 py-4 border-b border-dashed border-fog">
              <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-1">Field Trip</div>
              <div className="font-mono text-sm font-bold truncate">{guide.title}</div>
            </div>

            {/* Participants */}
            <div className="px-5 py-4 border-b border-dashed border-fog">
              <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-3">Travelers</div>
              <div className="flex flex-col gap-2">
                {MOCK_PARTICIPANTS.map(p => (
                  <div key={p.id} className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-cream flex-shrink-0"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.initial}
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                    <div className="font-mono text-[11px] text-dust truncate">synced</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stop list */}
            <div className="px-5 py-4 flex-1 overflow-y-auto">
              <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-3">Stops</div>
              <div className="space-y-2">
                {guide.stops.map((s, i) => (
                  <div
                    key={s.id}
                    className={`flex items-center gap-2.5 font-mono text-[11px] ${
                      i === currentIdx ? 'text-ink font-bold' : i < currentIdx ? 'text-dust line-through' : 'text-fog'
                    }`}
                  >
                    <span>{i + 1}.</span>
                    <span className="truncate">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Session code */}
            <div className="px-5 py-4 border-t border-dashed border-fog">
              <div className="font-mono text-[10px] text-dust">Code: <span className="text-ink font-bold">{sessionCode}</span></div>
            </div>
          </aside>

          {/* Main stop content */}
          <main className="flex-1 flex flex-col">

            {/* Stop header */}
            <div className="px-8 py-5 border-b border-dashed border-fog flex items-center justify-between">
              <div className="font-mono text-[11px] text-dust">
                Stop {currentIdx + 1} of {guide.stops.length}
              </div>
              <div className="font-mono text-[11px] text-dust">
                {MOCK_PARTICIPANTS.length} travelers synced
              </div>
            </div>

            {/* Stop body */}
            <div className="flex-1 flex items-center justify-center px-8 py-10">
              <div className="max-w-lg w-full animate-slide-up">

                <div className="flex items-center gap-3 mb-6">
                  <div className="stop-badge" style={{ color: guide.accentColor, borderColor: guide.accentColor }}>
                    {currentIdx + 1}
                  </div>
                </div>

                <h2 className="font-mono text-2xl md:text-3xl font-bold mb-4">{stop.title}</h2>
                <p className="font-serif leading-relaxed text-ink/80 mb-5">{stop.description}</p>

                {stop.curatorNote && (
                  <div className="border-l-2 pl-4 mb-8" style={{ borderColor: guide.accentColor }}>
                    <p className="font-serif italic text-sm text-dust">{stop.curatorNote}</p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <a
                    href={stop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center font-mono text-sm py-3.5 px-6 bg-ink text-cream hover:bg-ink/90 transition-colors"
                  >
                    Open stop ↗
                  </a>

                  {/* Host controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                      disabled={currentIdx === 0}
                      className="flex-1 font-mono text-[11px] py-2.5 border border-dashed border-fog text-dust hover:border-dust transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← prev
                    </button>
                    <button
                      onClick={() => isLast ? setPhase('done') : setCurrentIdx(i => i + 1)}
                      className="flex-[2] font-mono text-[11px] py-2.5 border border-dashed border-dust text-ink hover:border-ink transition-colors"
                    >
                      {isLast ? 'End trip →' : 'Next stop → (all travelers advance)'}
                    </button>
                  </div>
                  <p className="font-mono text-[10px] text-dust text-center">
                    As host, you control the pace for everyone
                  </p>
                </div>
              </div>
            </div>

            {/* Stop trail */}
            <div className="px-8 py-4 border-t border-dashed border-fog">
              <div className="flex gap-1.5">
                {guide.stops.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full flex-1 transition-colors"
                    style={{
                      backgroundColor:
                        i <= currentIdx ? guide.accentColor : '#CFC4B4',
                    }}
                  />
                ))}
              </div>
            </div>

          </main>
        </div>
      </div>
    )
  }

  // phase === 'done'
  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-6">
      <div className="max-w-sm w-full text-center animate-slide-up">
        <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-4">Field Trip Complete</div>
        <h1 className="font-mono text-3xl font-bold mb-4">{guide.title}</h1>
        <p className="font-serif text-ink/70 mb-8">
          You and your travelers explored {guide.stops.length} stops together.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href={`/recap/${guide.slug}`}
            className="block font-mono text-sm py-3 px-6 bg-ink text-cream hover:bg-ink/90 transition-colors"
          >
            View the scrapbook →
          </Link>
          <Link
            href="/"
            className="block font-mono text-sm py-3 px-6 border border-dashed border-dust text-ink hover:border-ink transition-colors"
          >
            Back to Field Guides
          </Link>
        </div>
      </div>
    </div>
  )
}
