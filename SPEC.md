# Cofton — MVP specification

A polished, editorial field guide to Cofton Hackett as experienced by the people who live there.

## Visual direction

Quietly premium; independent magazine / modern travel guide / coffee-table book. Cream paper, charcoal ink, muted natural tones, serif display typography, clean sans-serif UI, large photography and generous whitespace.

Avoid wiki aesthetics, generic property sites, neon, excessive cards/shadows and map-first layouts.

## Initial places

- The Triangle
- Swan Lake
- Ascott's
- Cofton Park
- The Troll Bridge
- Rabbit Trails
- The Muddy Path

## Map

Two views of the same places, switchable in place.

- **Drawn** — the public map. A hand-drawn SVG sketch, wobbled by a
  displacement filter, with a numbered pin per place. No tiles, no network.
- **Real** — OpenStreetMap tiles (configurable) covering exactly the same
  frame. Scenery fades out, pins stay. View only.

The sketch is framed by `bounds`, real coordinates the 800 × 600 drawing covers
exactly. Pins and traced scenery are real coordinates, so the drawing is the
real layout drawn in a looser hand.

## Editor

`edit.html`, maintainer-only. Set the frame, trace scenery from OpenStreetMap
(Overpass), reshape it or draw extra lines, pin and edit places, add photos
(resized in the browser), and publish everything as one commit to `main`
through the GitHub API using a token limited to this repo. Work is kept as
a local draft until published.

## Photos

Optional per place, in `images/`. The first is the card cover; the rest get a
lightbox with thumbnails and arrow-key navigation. Missing files fall back to
the card's colour wash, so a photo can be listed before it exists.

## Future

Dedicated place pages, field notes, stories, search, and potentially a content
CMS. Content is currently a single `places.js` config — that file is the thing
a CMS would eventually replace.

## Content principle

Document lived geography rather than attempting to establish official geographic truth. Unofficial names are valid because they communicate shared meaning.
