export interface Stop {
  id: string
  title: string
  description: string
  url: string
  curatorNote?: string
  screenshot?: string
  bridgeNote?: string
}

export interface Guide {
  slug: string
  title: string
  description: string
  longDescription?: string
  curator: string
  mood: string
  stops: Stop[]
  created: string
  accentColor: string
}
