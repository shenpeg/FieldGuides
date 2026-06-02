// Domains that cannot be embedded due to CSP restrictions
export const UNEMBEDDABLE_DOMAINS = [
  'neal.fun',
  'openai.com',
  'github.com',
  'archive.org',
  'poolside.fm',
  'earth.nullschool.net',
]

export function isEmbeddable(url: string): boolean {
  try {
    const domain = new URL(url).hostname
    return !UNEMBEDDABLE_DOMAINS.some(d => domain.includes(d))
  } catch {
    return true
  }
}
