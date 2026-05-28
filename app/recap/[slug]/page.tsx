'use client'

import Link from 'next/link'
import { getGuide, guides } from '@/data/guides'

const stampAngles = [-2.5, 1.5, -1, 2, -1.8, 0.8]

export default function RecapPage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)
  const otherGuides = guides.filter(g => g.slug !== params.slug)

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-dust">
        Guide not found. <Link href="/" className="underline ml-2">Go home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-parchment">

      {/* Header */}
      <div className="px-6 md:px-16 py-10 border-b border-dashed border-fog">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-dust mb-3">
            Journey Complete
          </div>
          <h1 className="font-mono text-4xl md:text-5xl font-bold mb-4">
            {guide.title}
          </h1>
          <p className="font-serif text-ink/70 text-base md:text-lg">
            You explored {guide.stops.length} stops.
            {guide.curator !== 'Field Guides Editorial' && (
              <span> Curated for you by <em>{guide.curator}</em>.</span>
            )}
          </p>
        </div>
      </div>

      <main className="px-6 md:px-16 py-14">
        <div className="max-w-2xl mx-auto">

          {/* Scrapbook grid */}
          <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-8">
            Your stops
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
            {guide.stops.map((stop, i) => (
              <div
                key={stop.id}
                className="bg-cream card-rough p-5 relative"
                style={{
                  transform: `rotate(${stampAngles[i % stampAngles.length]}deg)`,
                }}
              >
                {/* Visited stamp */}
                <div
                  className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 flex items-center justify-center opacity-80"
                  style={{ borderColor: guide.accentColor, color: guide.accentColor }}
                  aria-label="Visited"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="stop-badge mb-3" style={{ color: guide.accentColor, borderColor: guide.accentColor }}>
                  {i + 1}
                </div>

                <h3 className="font-mono text-sm font-bold mb-1.5 pr-10">{stop.title}</h3>
                <p className="font-serif text-xs text-ink/70 leading-relaxed mb-3">
                  {stop.description.split('.')[0]}.
                </p>
                <a
                  href={stop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-dust hover:text-ink transition-colors underline underline-offset-4"
                >
                  revisit ↗
                </a>
              </div>
            ))}
          </div>

          <hr className="divider-dashed mb-10" />

          {/* Notes section — placeholder */}
          <div className="mb-14">
            <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-5">
              Field Notes
            </div>
            <div className="bg-cream card-rough p-6 min-h-[100px] border-dashed">
              <p className="font-serif italic text-sm text-dust">
                What did you find? Notes and annotations coming soon — for now, let it sit with you for a bit.
              </p>
            </div>
          </div>

          {/* Next guides */}
          {otherGuides.length > 0 && (
            <div className="mb-10">
              <div className="font-mono text-[10px] uppercase tracking-widest text-dust mb-5">
                More to explore
              </div>
              <div className="flex flex-col gap-3">
                {otherGuides.slice(0, 2).map(g => (
                  <div key={g.slug} className="bg-cream card-rough px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-mono text-sm font-bold">{g.title}</div>
                      <div className="font-mono text-[10px] text-dust mt-0.5">
                        {g.stops.length} stops · {g.mood}
                      </div>
                    </div>
                    <Link
                      href={`/guide/${g.slug}/explore`}
                      className="font-mono text-[11px] px-3 py-2 border border-dashed border-dust text-ink hover:border-ink transition-colors flex-shrink-0"
                    >
                      Explore →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/"
              className="inline-block font-mono text-sm py-3 px-8 bg-ink text-cream hover:bg-ink/90 transition-colors"
            >
              Back to Field Guides
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <div className="border-t border-dashed border-fog px-6 py-6 mt-6">
        <p className="font-mono text-[10px] text-dust text-center">
          Every journey ends. That&apos;s what makes it a journey.
        </p>
      </div>

    </div>
  )
}
