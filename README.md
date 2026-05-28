# Field Guides
A little app for exploring the internet on purpose.

## What is it?
Field Guides lets you move through a curated set of web destinations — called a Field Guide — either on your own or with friends during a live “Internet Field Trip.”

Each guide is a short sequence of hand-picked stops (websites). You open each stop, spend some time there, mark it visited, and move on. When the guide ends, you get a small scrapbook-style recap of everywhere you went. 

There's no infinite engagement or algorithmic dark patterns; just a finite journey through things another human thought were worth experiencing.

## The idea
A lot of online experiences now are optimized for constant novelty and engagement, but after spending hours online it can feel like you haven't actually been anywhere. Everything blends together into the same feed.
At the same time, some of the most memorable internet experiences we've had were much smaller and more personal:
falling into a rabbit hole with friends
wandering through old internet archives or blogs
finding browser art or abandoned pages that felt unexpectedly human

We became interested in the idea that maybe the internet doesn't need more content but it needs better ways to rediscover and experience what already exists.

Field Guides is an attempt to design around that feeling of less endless retention and more intentional exploration, creative discovery and sharing experiences with friends instead of performing them.

## What's here right now
This is a frontend-only prototype — no backend, no accounts, no real-time sync yet.
- **Homepage** — grid of available guides
- **Guide detail** — full list of stops before you begin
- **Solo explore** — move through stops one at a time, open each site, mark it visited
- **Field Trip** — placeholder UI for the synchronized group experience (lobby, session code, host controls)
- **Recap** — scrapbook view of everywhere you went

There are three hardcoded guides to start, including one personal one (Peggy's picks).

## Running it
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires Node 18+.

## Adding a guide
Guides live in [`data/guides.ts`](data/guides.ts). Each one is just a plain object — add a new entry to the array and it'll show up on the homepage. Stops only need a title, description, and URL. Curator notes are optional.

## What's next
- User-created guides / playlists
- Real-time synchronized Field Trips
- Notes and annotations during/after a journey
- Auth and saving
---

Made with intention, not algorithms.
