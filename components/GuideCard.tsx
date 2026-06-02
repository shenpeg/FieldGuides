import Link from 'next/link'
import { Guide } from '@/types'

interface GuideCardProps {
  guide: Guide
  rotation: number
}

export default function GuideCard({ guide, rotation }: GuideCardProps) {
  const moodLabels: Record<string, string> = {
    playful: 'playful',
    contemplative: 'contemplative',
    curious: 'curious',
    nostalgic: 'nostalgic',
  }

  return (
    <article
      className="bg-cream card-rough p-6 flex flex-col gap-4 transition-transform duration-300 hover:scale-[1.02] hover:shadow-md"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
          style={{ backgroundColor: guide.accentColor }}
          aria-hidden
        />
        <span className="font-mono text-[10px] uppercase tracking-widest text-dust ml-auto">
          {moodLabels[guide.mood] ?? guide.mood}
        </span>
      </div>

      {/* Title */}
      <div>
        <h2 className="font-mono text-xl font-bold leading-tight mb-2">
          {guide.title}
        </h2>
        <p className="font-serif text-sm leading-relaxed text-ink/80">
          {guide.description}
        </p>
      </div>

      <hr className="divider-dashed my-1" />

      {/* Meta */}
      <div className="font-mono text-[11px] text-dust space-y-1">
        <div>{guide.stops.length} STOPS</div>
        <div>by {guide.curator}</div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2 mt-auto pt-2">
        <Link
          href={`/guide/${guide.slug}/field-trip?solo=true`}
          className="block text-center font-mono text-sm py-2.5 px-4 bg-ink text-cream hover:bg-ink/90 transition-colors"
        >
          Explore Solo →
        </Link>
        <Link
          href={`/guide/${guide.slug}/field-trip`}
          className="block text-center font-mono text-sm py-2.5 px-4 border border-dashed border-dust text-ink hover:border-ink transition-colors"
        >
          Start Field Trip
        </Link>
      </div>

      {/* Detail link */}
      <Link
        href={`/guide/${guide.slug}`}
        className="font-mono text-[11px] text-dust hover:text-ink underline underline-offset-4 transition-colors text-center"
      >
        View all stops
      </Link>
    </article>
  )
}
