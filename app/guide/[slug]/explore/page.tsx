'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getGuide } from '@/data/guides'
import { Stop } from '@/types'

export default function ExplorePage({ params }: { params: { slug: string } }) {
  const router = useRouter()

  const [currentIdx, setCurrentIdx] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(new Set())
  const [opened, setOpened] = useState(false)

  const guide = getGuide(params.slug)

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-dust">
        Guide not found. <Link href="/" className="underline ml-2">Go home</Link>
      </div>
    )
  }

  const stop: Stop = guide.stops[currentIdx]
  const isLast = currentIdx === guide.stops.length - 1
  const progress = ((currentIdx) / guide.stops.length) * 100

  function handleOpen() {
    window.open(stop.url, '_blank', 'noopener,noreferrer')
    setOpened(true)
  }

  function handleAdvance() {
    setVisited(prev => new Set(Array.from(prev).concat(currentIdx)))
    setOpened(false)
    if (isLast) {
      router.push(`/recap/${params.slug}`)
    } else {
      setCurrentIdx(prev => prev + 1)
    }
  }

  function handlePrev() {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1)
      setOpened(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-parchment">

      {/* Progress bar */}
      <div className="h-0.5 bg-fog relative">
        <div
          className="h-full bg-ink transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top bar */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-dashed border-fog">
        <Link
          href={`/guide/${guide.slug}`}
          className="font-mono text-[11px] text-dust hover:text-ink transition-colors"
        >
          ← {guide.title}
        </Link>
        <div className="font-mono text-[11px] text-dust tracking-wider">
          Stop {currentIdx + 1} of {guide.stops.length}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full animate-slide-up">

          {/* Stop number */}
          <div className="flex items-center gap-3 mb-8">
            <div className="stop-badge" style={{ color: guide.accentColor, borderColor: guide.accentColor }}>
              {currentIdx + 1}
            </div>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: guide.accentColor, opacity: 0.3 }}
            />
          </div>

          {/* Stop content */}
          <div className="mb-10">
            <h1 className="font-mono text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {stop.title}
            </h1>
            <p className="font-serif text-base md:text-lg leading-relaxed text-ink/80 mb-5">
              {stop.description}
            </p>
            {stop.curatorNote && (
              <div className="border-l-2 pl-4 py-1" style={{ borderColor: guide.accentColor }}>
                <p className="font-serif italic text-sm text-dust">
                  {stop.curatorNote}
                </p>
              </div>
            )}
          </div>

          {/* URL display */}
          <div className="font-mono text-[11px] text-dust mb-8 flex items-center gap-2">
            <span className="opacity-50">→</span>
            <span>{stop.url}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleOpen}
              className="w-full font-mono text-sm py-3.5 px-6 bg-ink text-cream hover:bg-ink/90 transition-colors text-left flex items-center justify-between group"
            >
              <span>Open this stop</span>
              <span className="group-hover:translate-x-1 transition-transform">↗</span>
            </button>

            {opened && (
              <button
                onClick={handleAdvance}
                className="w-full font-mono text-sm py-3.5 px-6 border border-dashed border-dust text-ink hover:border-ink transition-colors animate-fade-in"
                style={{ borderColor: guide.accentColor, color: guide.accentColor }}
              >
                {isLast ? 'Complete this journey →' : "I've been here · move on →"}
              </button>
            )}

            {!opened && currentIdx > 0 && (
              <button
                onClick={handlePrev}
                className="font-mono text-[11px] text-dust hover:text-ink transition-colors underline underline-offset-4 text-center mt-2"
              >
                ← back to previous stop
              </button>
            )}
          </div>

        </div>
      </main>

      {/* Stop trail */}
      <div className="px-6 py-5 border-t border-dashed border-fog">
        <div className="max-w-xl mx-auto flex gap-2 items-center">
          {guide.stops.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full flex-1 transition-colors duration-300"
              style={{
                backgroundColor:
                  i < currentIdx
                    ? guide.accentColor
                    : i === currentIdx
                    ? guide.accentColor + '88'
                    : '#CFC4B4',
              }}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
