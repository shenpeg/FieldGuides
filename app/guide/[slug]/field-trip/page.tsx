'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getGuide } from '@/data/guides'
import { isEmbeddable } from '@/lib/iframeChecker'

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

type Phase = 'lobby' | 'active' | 'done' | 'joined' | 'loading'

export default function FieldTripPage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)
  const [sessionCode] = useState(generateCode)
  const [phase, setPhase] = useState<Phase>('loading')
  const [isSolo, setIsSolo] = useState(false)

  useEffect(() => {
    const solo = new URLSearchParams(window.location.search).get('solo') === 'true'
    setIsSolo(solo)
    setPhase(solo ? 'active' : 'lobby')
  }, [])
  const [joinedSessionCode, setJoinedSessionCode] = useState('')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [joinedParticipants, setJoinedParticipants] = useState([
    { id: 'host', initial: 'S', color: '#B85C38', name: 'Sarah', ready: true },
  ])
  const [failedIframes, setFailedIframes] = useState<Set<number>>(new Set())
  const [showInterstitial, setShowInterstitial] = useState(false)

  function handleIframeError(stopIdx: number) {
    setFailedIframes(prev => new Set([...prev, stopIdx]))
  }

  function handleIframeLoad(stopIdx: number, el: HTMLIFrameElement | null) {
    if (!el) return
    try {
      const doc = el.contentDocument
      if (doc?.documentElement?.getAttribute('data-proxy-error') === 'true') {
        handleIframeError(stopIdx)
      }
    } catch {
      // cross-origin: proxy didn't run, treat as failed
      handleIframeError(stopIdx)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(sessionCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    // Prototype: Simulate participants joining when viewing joined session
    if (phase === 'joined') {
      const timers = [
        setTimeout(() => {
          setJoinedParticipants(prev => [...prev, { id: 'p1', initial: 'M', color: '#4E7253', name: 'Mike', ready: false }])
        }, 1500),
        setTimeout(() => {
          setJoinedParticipants(prev => prev.map(p => p.id === 'p1' ? { ...p, ready: true } : p))
        }, 2800),
        setTimeout(() => {
          setJoinedParticipants(prev => [...prev, { id: 'p2', initial: 'J', color: '#6B5F7A', name: 'Jordan', ready: false }])
        }, 3500),
        setTimeout(() => {
          setJoinedParticipants(prev => prev.map(p => p.id === 'p2' ? { ...p, ready: true } : p))
        }, 4800),
      ]
      return () => timers.forEach(t => clearTimeout(t))
    }
  }, [phase])

  function handleJoinFieldTrip() {
    setJoinError('')
    if (!joinCode.trim()) {
      setJoinError('Please enter a session code')
      return
    }
    // Prototype: If user enters FIELD-510, show the joined session
    if (joinCode.toUpperCase() === 'FIELD-510') {
      setJoinedSessionCode(joinCode.toUpperCase())
      setPhase('joined')
      setShowJoinModal(false)
      setJoinCode('')
    } else {
      setJoinError('For prototype, please enter FIELD-510')
    }
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-dust">
        Guide not found. <Link href="/" className="underline ml-2">Go home</Link>
      </div>
    )
  }

  if (phase === 'loading') {
    return <div className="min-h-screen bg-parchment" />
  }

  const stop = guide.stops[currentIdx]
  const isLast = currentIdx === guide.stops.length - 1

  if (phase === 'lobby') {
    return (
      <div className="min-h-screen flex flex-col bg-parchment">
        <nav className="px-6 py-4 border-b border-dashed border-fog flex items-center justify-between">
          <Link href="/" className="font-mono text-[11px] text-dust hover:text-ink transition-colors">
            ← Field Guides
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
            <button
              onClick={() => setShowJoinModal(true)}
              className="w-full font-mono text-sm py-3.5 px-6 bg-cream text-ink border border-dashed border-fog hover:bg-fog/20 transition-colors mt-3"
            >
              Join friend's field trip
            </button>
            <p className="font-mono text-[10px] text-dust text-center mt-3">
              You can start solo — others can join mid-trip
            </p>
          </div>
        </main>

        {/* Join Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center px-6 z-50">
            <div className="bg-cream card-rough p-8 max-w-md w-full animate-slide-up">
              <div className="mb-6">
                <h2 className="font-mono text-xl font-bold mb-2">Join field trip</h2>
                <p className="font-serif text-sm text-ink/70">
                  Enter the session code your friend shared with you
                </p>
              </div>

              <div className="mb-6">
                <label className="font-mono text-[10px] uppercase tracking-widest text-dust block mb-2">
                  Session code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value.toUpperCase())
                    setJoinError('')
                  }}
                  placeholder="e.g., FIELD-510"
                  className="w-full font-mono text-lg font-bold tracking-wider bg-parchment border border-dashed border-fog px-4 py-3 focus:outline-none focus:border-ink"
                />
                {joinError && (
                  <p className="font-mono text-[10px] text-rust mt-2">{joinError}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowJoinModal(false)
                    setJoinCode('')
                    setJoinError('')
                  }}
                  className="flex-1 font-mono text-sm py-3 px-4 bg-fog/30 text-ink hover:bg-fog/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinFieldTrip}
                  className="flex-1 font-mono text-sm py-3 px-4 bg-ink text-cream hover:bg-ink/90 transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'joined') {
    return (
      <div className="min-h-screen flex flex-col bg-parchment">
        <nav className="px-6 py-4 border-b border-dashed border-fog flex items-center justify-between">
          <button onClick={() => setPhase('lobby')} className="font-mono text-[11px] text-dust hover:text-ink transition-colors">
            ← Back to lobby
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest text-dust">Field Trip</span>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-md w-full animate-slide-up">

            <div className="text-center mb-10">
              <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-3">
                Joined Session
              </div>
              <h1 className="font-mono text-3xl font-bold mb-3">{guide?.title}</h1>
              <p className="font-serif text-sm text-ink/70">
                You've joined Sarah's field trip. Waiting for the group to begin exploring...
              </p>
            </div>

            {/* Session code */}
            <div className="bg-cream card-rough p-6 mb-8 text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-3">
                Session code
              </div>
              <div className="font-mono text-4xl font-bold tracking-widest" style={{ color: guide?.accentColor }}>
                {joinedSessionCode}
              </div>
            </div>

            {/* Participants */}
            <div className="mb-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-4">
                Travelers ({joinedParticipants.length})
              </div>
              <div className="flex flex-col gap-3">
                {joinedParticipants.map(p => (
                  <div key={p.id} className={`flex items-center gap-3 bg-cream card-rough px-4 py-3 transition-all ${!p.ready ? 'opacity-60' : ''}`}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold text-cream"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.initial}
                    </div>
                    <div>
                      <div className="font-mono text-[12px] font-bold">{p.name}</div>
                      <div className="font-mono text-[10px] text-dust">{p.ready ? 'ready' : 'joining...'}</div>
                    </div>
                    {p.ready && <div className="ml-auto w-2 h-2 rounded-full bg-sage" />}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPhase('active')}
              className="w-full font-mono text-sm py-3.5 px-6 bg-ink text-cream hover:bg-ink/90 transition-colors disabled:opacity-50"
              disabled={joinedParticipants.some(p => !p.ready)}
            >
              Begin Field Trip →
            </button>
            <p className="font-mono text-[10px] text-dust text-center mt-3">
              Waiting for all travelers to be ready...
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (phase === 'active' && showInterstitial) {
    const nextStop = guide.stops[currentIdx + 1]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ink px-8 py-12">
        <div className="max-w-lg w-full animate-slide-up">
          <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mb-8">
            Stop {currentIdx + 1} of {guide.stops.length} — Reflection
          </div>

          {stop.curatorNote && (
            <blockquote className="font-serif text-lg leading-relaxed text-cream/80 italic mb-6 border-l-2 border-cream/20 pl-5">
              &ldquo;{stop.curatorNote}&rdquo;
            </blockquote>
          )}

          {stop.bridgeNote && (
            <p className="font-serif text-base leading-relaxed text-cream/60 mb-10">
              {stop.bridgeNote}
            </p>
          )}

          {nextStop && (
            <div className="border-t border-cream/10 pt-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-cream/30 mb-2">
                Next
              </div>
              <div className="font-mono text-sm font-bold text-cream/70">
                {currentIdx + 2}. {nextStop.title}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setShowInterstitial(false)
              setCurrentIdx(i => i + 1)
            }}
            className="mt-10 w-full font-mono text-sm py-3.5 px-6 bg-cream text-ink hover:bg-cream/90 transition-colors"
          >
            Continue →
          </button>
        </div>
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
                {(isSolo ? MOCK_PARTICIPANTS.slice(0, 1) : MOCK_PARTICIPANTS).map(p => (
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
            {!isSolo && (
              <div className="px-5 py-4 border-t border-dashed border-fog">
                <div className="font-mono text-[10px] text-dust">Code: <span className="text-ink font-bold">{sessionCode}</span></div>
              </div>
            )}

            {/* Back to lobby */}
            <div className="px-5 py-4 border-t border-dashed border-fog">
              <button
                onClick={() => setPhase('lobby')}
                className="font-mono text-[11px] text-dust hover:text-ink transition-colors"
              >
                ← Back to lobby
              </button>
            </div>
          </aside>

          {/* Main stop content */}
          <main className="flex-1 flex flex-col">
            {/* Iframe or fallback UI */}
            {!isEmbeddable(stop.url) || failedIframes.has(currentIdx) ? (
              <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {stop.screenshot ? (
                  <>
                    <img
                      src={stop.screenshot}
                      alt={stop.title}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-parchment" />
                )}
                <div className="relative z-10 max-w-md w-full text-center px-8">
                  <h2 className={`font-mono text-lg font-bold mb-3 ${stop.screenshot ? 'text-cream' : 'text-ink'}`}>
                    {stop.title}
                  </h2>
                  <p className={`font-serif text-sm mb-6 ${stop.screenshot ? 'text-cream/80' : 'text-ink/70'}`}>
                    This website can&apos;t be embedded directly. Open it in a new tab to explore.
                  </p>
                  <a
                    href={stop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center font-mono text-sm py-3.5 px-6 bg-cream text-ink hover:bg-cream/90 transition-colors"
                  >
                    Open in new tab ↗
                  </a>
                </div>
              </div>
            ) : (
              <iframe
                src={`/api/proxy?url=${encodeURIComponent(stop.url)}`}
                className="flex-1 w-full border-none"
                title={`Stop: ${stop.title}`}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
                onError={() => handleIframeError(currentIdx)}
                onLoad={(e) => handleIframeLoad(currentIdx, e.currentTarget)}
              />
            )}

            {/* Fixed navigation at bottom */}
            <div className="border-t border-dashed border-fog bg-parchment px-8 py-4 space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                  disabled={currentIdx === 0}
                  className="flex-1 font-mono text-[11px] py-2.5 border border-dashed border-fog text-dust hover:border-dust transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← prev
                </button>
                <button
                  onClick={() => {
                    if (isLast) {
                      setPhase('done')
                    } else if (stop.bridgeNote || stop.curatorNote) {
                      setShowInterstitial(true)
                    } else {
                      setCurrentIdx(i => i + 1)
                    }
                  }}
                  className="flex-[2] font-mono text-[11px] py-2.5 border border-dashed border-dust text-ink hover:border-ink transition-colors"
                >
                  {isLast ? 'End trip →' : 'Next stop → (all travelers advance)'}
                </button>
              </div>
              <p className="font-mono text-[10px] text-dust text-center">
                As host, you control the pace for everyone
              </p>
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
