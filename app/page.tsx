import Link from 'next/link'
import GuideCard from '@/components/GuideCard'
import { guides } from '@/data/guides'

const cardRotations = [-1.2, 0.6, -0.8, 1.3]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="px-8 py-10 md:px-16 md:py-14 border-b border-dashed border-fog">
        <div className="max-w-5xl mx-auto flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-dust mb-3">
              Est. 2026
            </div>
            <h1 className="font-mono text-4xl md:text-6xl font-bold tracking-tight leading-none">
              Field Guides
            </h1>
            <p className="font-serif italic text-dust mt-3 text-base md:text-lg">
              Curated internet journeys for curious explorers
            </p>
          </div>
          <div className="font-mono text-[11px] text-dust max-w-[220px] leading-relaxed text-right hidden md:block">
            Finite journeys.<br />
            No infinite scroll.<br />
            No algorithms.<br />
            Just the web.
          </div>
        </div>
      </header>

      {/* Intro strip */}
      <div className="bg-cream border-b border-dashed border-fog">
        <div className="max-w-5xl mx-auto px-8 md:px-16 py-6">
          <p className="font-serif text-sm md:text-base text-ink/70 leading-relaxed max-w-2xl">
            Each Field Guide is a hand-picked set of 5–7 web destinations — experimental sites, internet archives, browser art, and weird corners of the web. Explore solo at your own pace, or invite friends for a synchronized <em>Internet Field Trip.</em>
          </p>
        </div>
      </div>

      {/* Guides grid */}
      <main className="flex-1 px-8 md:px-16 py-14">
        <div className="max-w-5xl mx-auto">

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-dust mb-10">
            {guides.length} guides available
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
            {guides.map((guide, i) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                rotation={cardRotations[i % cardRotations.length]}
              />
            ))}
          </div>

          {/* Coming soon hint */}
          <div className="mt-16 pt-10 border-t border-dashed border-fog">
            <p className="font-mono text-[11px] text-dust text-center tracking-wider">
              ↓ more guides being assembled ↓
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dashed border-fog px-8 md:px-16 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[11px] text-dust">
            Field Guides — optimized for wonder, not engagement
          </span>
          <span className="font-mono text-[11px] text-dust">
            <Link href="/about" className="hover:text-ink transition-colors underline underline-offset-4">
              about this project
            </Link>
          </span>
        </div>
      </footer>

    </div>
  )
}
