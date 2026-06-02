import Link from 'next/link'
import { notFound } from 'next/navigation'
import { guides, getGuide } from '@/data/guides'

export function generateStaticParams() {
  return guides.map(g => ({ slug: g.slug }))
}

export default function GuideDetailPage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)
  if (!guide) notFound()

  return (
    <div className="min-h-screen flex flex-col">

      {/* Nav */}
      <nav className="px-8 md:px-16 py-5 border-b border-dashed border-fog flex items-center justify-between">
        <Link href="/" className="font-mono text-sm text-dust hover:text-ink transition-colors">
          ← Field Guides
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-widest text-dust">
          {guide.mood}
        </span>
      </nav>

      <main className="flex-1 px-8 md:px-16 py-12">
        <div className="max-w-2xl mx-auto">

          {/* Guide header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-2 h-6 rounded-sm"
                style={{ backgroundColor: guide.accentColor }}
                aria-hidden
              />
              <span className="font-mono text-[11px] uppercase tracking-widest text-dust">
                {guide.stops.length} stops
              </span>
            </div>

            <h1 className="font-mono text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {guide.title}
            </h1>

            <p className="font-serif text-lg leading-relaxed text-ink/80 mb-4">
              {guide.longDescription ?? guide.description}
            </p>

            <p className="font-mono text-[11px] text-dust">
              Curated by {guide.curator} · {new Date(guide.created).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <hr className="divider-dashed mb-10" />

          {/* Stops list */}
          <div className="space-y-8 mb-14">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-dust">
              The Stops
            </h2>

            {guide.stops.map((stop, i) => (
              <div key={stop.id} className="flex gap-5">
                <div
                  className="stop-badge text-dust mt-1"
                  aria-label={`Stop ${i + 1}`}
                >
                  {i + 1}
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
                    <h3 className="font-mono font-bold text-base">{stop.title}</h3>
                    <a
                      href={stop.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-dust hover:text-ink underline underline-offset-4 transition-colors"
                    >
                      {new URL(stop.url).hostname}
                    </a>
                  </div>
                  <p className="font-serif text-sm leading-relaxed text-ink/80 mb-2">
                    {stop.description}
                  </p>
                  {stop.curatorNote && (
                    <p className="font-serif italic text-[13px] text-dust">
                      &ldquo;{stop.curatorNote}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Begin CTAs */}
          <div className="bg-cream card-rough p-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-dust mb-5">
              Ready to begin?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/guide/${guide.slug}/field-trip?solo=true`}
                className="flex-1 text-center font-mono text-sm py-3 px-5 bg-ink text-cream hover:bg-ink/90 transition-colors"
              >
                Explore Solo →
              </Link>
              <Link
                href={`/guide/${guide.slug}/field-trip`}
                className="flex-1 text-center font-mono text-sm py-3 px-5 border border-dashed border-dust text-ink hover:border-ink transition-colors"
              >
                Start Field Trip
              </Link>
            </div>
          </div>

        </div>
      </main>

    </div>
  )
}
