# Field Guides

A little app for exploring the internet on purpose.

## What is it?

Field Guides lets you move through a curated set of web destinations — called a **Field Guide** — either on your own or in sync with friends on a live **Internet Field Trip**.

Each guide is a hand-picked collection of 5–7 sites: weird browser art, internet archives, forgotten personal pages, things that don't fit anywhere else. You open each stop, spend some time there, mark it visited, and move on. When you're done, you get a small recap of everywhere you went.

There's no algorithm. No infinite scroll. No engagement metrics. Just a short journey with a clear ending.

## The idea

This came out of a frustration with how the internet feels right now — like you can spend two hours online and feel like you haven't actually *been* anywhere.

The inspiration was less "social media app" and more "going on a late-night internet rabbit hole with a friend" — where someone shares a weird link, you both end up somewhere unexpected, and you close the laptop actually having seen something new.

Field Guides is an attempt to design for that. Finite, intentional, and built around shared discovery instead of retention.

Some things we actively don't want to build: recommended feeds, watch time tracking, notifications, anything that makes you feel like you should keep going after the guide is done.

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

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- No backend yet

## Adding a guide

Guides live in [`data/guides.ts`](data/guides.ts). Each one is just a plain object — add a new entry to the array and it'll show up on the homepage. Stops only need a title, description, and URL. Curator notes are optional.

## What's next

- User-created guides / playlists
- Real-time synchronized Field Trips
- Notes and annotations during/after a journey
- Auth and saving

---

Made with intention, not algorithms.
