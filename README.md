# Cofton

> *The places we know.*

A visual field guide to Cofton Hackett as experienced by the people who live there — the unofficial names, landmarks, routes and character that don't appear on any map.

---

## Concept

There is the Cofton that appears on a map. And then there is the Cofton we actually know.

The places we pass every day. The shortcuts. The landmarks. The names that somehow stuck.

This is that map.

---

## Places

| Name | Type | Notes |
|---|---|---|
| The Triangle | Junction / landmark | The triangular bit where the roads meet on the way towards Barnt Green |
| Swan Lake | Ponds / landmark | A collection of ponds near the reservoir. Not technically a lake. Obviously. |
| Asket's | Local landmark | Formerly associated with the place known as Ben's |
| Cofton Park | Park | The obvious one |
| The Troll Bridge | Bridge / landmark | Considerably more personality than its official designation presumably suggests |
| Rabbit Trails | Path / shortcut | Turn right on the way from home towards the Troll Bridge |

---

## Design Direction

Editorial / modern / understated / photographic.

Somewhere between a beautifully designed local guide, an independent magazine, a coffee-table book, and a subtle digital map.

**Not** Wikipedia. Not Google Maps. Not a tourist board.

**Visual language:** large photography, cream backgrounds, dark charcoal text, large serif display type, generous whitespace.

---

## Stack

- **Next.js** + TypeScript
- **Tailwind CSS**
- **MDX** for place content
- **Vercel** for deployment
- Static-first, no database, no CMS — content lives in `/content/places/`

---

## Content Model

Each place is a Markdown file with frontmatter:

```yaml
name: The Triangle
slug: the-triangle
type: landmark
description: ...
origin: ...
coordinates:
  lat: 52.378
  lng: -1.992
images:
  - triangle-01.jpg
related:
  - troll-bridge
  - rabbit-trails
```

---

## Structure

```
cofton/
├── app/
│   ├── page.tsx
│   ├── places/
│   │   └── [slug]/page.tsx
│   └── map/page.tsx
├── content/
│   └── places/
│       ├── triangle.md
│       ├── swan-lake.md
│       ├── askets.md
│       ├── cofton-park.md
│       ├── troll-bridge.md
│       └── rabbit-trails.md
├── components/
│   ├── PlaceCard.tsx
│   ├── PlaceHero.tsx
│   ├── Map.tsx
│   └── Navigation.tsx
└── public/
    └── images/
```

---

## MVP

- [ ] Homepage with hero + editorial intro
- [ ] Place grid (6 locations)
- [ ] Individual place pages
- [ ] Basic interactive map
- [ ] Deploy to Vercel

**Success criterion:** someone opens it and thinks *"oh, I get it — this is Cofton, but it's their Cofton."*
