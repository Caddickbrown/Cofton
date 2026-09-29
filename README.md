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
| Ascott's | Local landmark | Long known as Ben's Ben's Ben's. The name changed. The name didn't really. |
| Cofton Park | Park | The obvious one |
| The Troll Bridge | Bridge / landmark | Considerably more personality than its official designation presumably suggests |
| Rabbit Trails | Path / shortcut | Turn right on the way from home towards the Troll Bridge |
| The Muddy Path | Path | Not on the plan. Muddy in a way that has stuck as a description. |

---

## Design Direction

Editorial / modern / understated / photographic.

Somewhere between a beautifully designed local guide, an independent magazine, a coffee-table book, and a subtle digital map.

**Not** Wikipedia. Not Google Maps. Not a tourist board.

**Visual language:** large photography, cream backgrounds, dark charcoal text, large serif display type, generous whitespace.

---

## Stack

No build step, no framework, no dependencies to install.

- **`index.html`** — the site: markup, styles, rendering
- **`edit.html`** — the editor: frame and trace the map, pin places, add photos, publish
- **`places.js`** — all the content and all the map geometry. The editor writes it
- **`map.js`** / **`map.css`** — map code and sketch styles shared by both pages
- **`images/`** — photographs

Static-first, no database, no CMS. Serve the folder with anything
(`python3 -m http.server`) and open `index.html` or `edit.html`.

---

## Content Model

Everything lives in `places.js`, under a single `window.COFTON` object. The
cards, the "Seven, for now" count, the pins and the lines under them are all
generated from it, so adding a place is one block of text.

```js
{
  slug:  'muddy-path',
  name:  'The Muddy Path',
  type:  'Path',
  desc:  'Not on the plan. Muddy in a way that has stuck as a description.',
  photos: ['images/muddy-path-01.jpg'],
  lat:   52.3705,          // optional
  lng:   -1.9965,          // optional
  map:   { x: 466, y: 430, above: true }   // fallback position on the sketch
}
```

| Field | Required | What it does |
|---|---|---|
| `slug` | yes | Links the card, the pin and the lightbox together |
| `name` | yes | The title |
| `type` | yes | The small label above the title |
| `desc` | yes | The one-line description |
| `photos` | no | Cover image for the card, plus a lightbox. Any number |
| `lat` / `lng` | no | Real position. Takes over from `map` once `bounds` is set |
| `map.x` / `map.y` | no | Where the pin sits on the hand-drawn sketch (0-800 x 0-600) |
| `map.above` | no | Lifts the label above the pin instead of below |
| `tone` | no | Card colour wash, 1-6. Cycles automatically if omitted |

### Photos

The easy way is the editor: drop photos onto a place and publish. By hand:
drop files into `images/` and list them under `photos`. The first is the card
cover. A path that 404s is dropped silently and the card falls back to its
colour wash, so it is safe to list a photo before it exists. See
[`images/README.md`](images/README.md) for sizes and the object form that
takes alt text and captions.

---

## The Map

The site has two views, and switching between them is the point.

**Drawn** is the map people see: a sketch wobbled by an SVG displacement
filter, with the places pinned on it. It needs no tiles and nothing online.

**Real** fades the hand-drawn lines out and fades in OpenStreetMap tiles
covering exactly the same area, with the pins staying put. Visitors can't
change anything with it. It is there to show that the drawing is the real place.

Both views are framed by `bounds` in `places.js`: a box of real coordinates
that the 800 × 600 sketch covers exactly. Pins (`lat`/`lng`) and traced scenery
(`pts`) are real coordinates put into that box, so they always line up with
each other and with the real map.

## Editing — `edit.html`

Open `edit.html` from wherever the site is served (or locally). It is not
linked from the site and is marked `noindex`. Without a GitHub token it can't
change anything.

1. **Frame.** Move and zoom the real map until it covers the area you want
   drawn, then press **Use this view as the frame**. The 4:3 box you see is the
   drawing.
2. **Trace.** **Fetch from OpenStreetMap** pulls the roads, lanes, paths,
   railway, streams, water, parks, woods and (optionally) buildings inside the
   frame. Tick the kinds you want and put them on the drawing. Then tidy up:
   - **Select** (4) — click a line to change its kind, drag its dots to
     reshape it, right-click a dot to remove it, press Delete to drop the line.
   - **Draw** (3) — click to add points; double-click or Enter to finish. Use
     it for things OpenStreetMap doesn't have, like the Muddy Path.
   - The **Real map** slider fades the tiles out so you can see the drawing on
     its own. **Wobble** previews it the way the site draws it.
3. **Places.** Use **Pin** (2) and click the map, or drag any pin (dashed ones
   aren't placed yet). Pinning moves on to the next unpinned place. Edit the
   name, type and description in the panel, reorder with the arrows, add or
   delete places.
4. **Photos.** Drop photos onto a place, or choose files. They are resized in
   the browser (about 1600 px, under about 300 KB, JPEG) and named
   `images/<slug>-01.jpg` and so on. Make one the cover, add captions, remove them.
5. **Publish.** Makes **one commit** to `main` with the new `places.js`, the
   new photos, and deletes photos you removed. That push triggers the
   cooperativesausage sync.

Everything is autosaved as a draft in the browser, photos included, until you
publish. Reloading loses nothing, and **Undo** (Ctrl/⌘ Z) works on every edit.

### Connecting GitHub (once)

Make a [fine-grained token](https://github.com/settings/personal-access-tokens/new):
**Only select repositories** → `Caddickbrown/cofton`, and **Repository
permissions → Contents: Read and write**. Nothing else. Paste it under
*GitHub connection* in the Publish panel and press **Save and test**. It is
stored in that browser's `localStorage` only; **Forget token** removes it.

If `places.js` on GitHub has changed since you started (another browser, say),
Publish stops and tells you. Press it again to overwrite, or use **Load
latest from GitHub** to start from what's there.

No token? **Download places.js** still works. Replace the file, then commit
the photos in `images/` yourself.

> The editor writes the whole of `places.js` again each time, so comments
> you add inside it by hand are not kept. Keep notes here instead.

---

## Structure

```
cofton/
├── index.html      # the site
├── edit.html       # the editor — frame, trace, pin, photos, publish
├── places.js       # content + map geometry (written by the editor)
├── map.js          # shared map maths, scenery drawing, tile layer
├── map.css         # sketch styles, one class per scenery kind
├── images/         # photographs
├── README.md
└── SPEC.md
```

---

## MVP

- [x] Homepage with hero + editorial intro
- [x] Place grid, generated from `places.js`
- [x] Hand-drawn sketch map with pins
- [x] Real map, lined up exactly under the drawn one
- [x] Editor: trace from OpenStreetMap, pin, add photos, publish to GitHub
- [x] Photos, with a lightbox per place
- [x] Dark mode with system default and manual toggle
- [ ] Individual place pages
- [ ] Deploy

**Success criterion:** someone opens it and thinks *"oh, I get it — this is Cofton, but it's their Cofton."*
