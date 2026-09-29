/* ---------------------------------------------------------------------------
 * Cofton — content + map
 *
 * Written by edit.html. You can edit it by hand too, but the editor rewrites
 * the whole file when it publishes, so comments added here are not kept —
 * put notes in the README instead.
 *
 *   center, zoom  where the editor's real map opens
 *   tiles         the real map: a tile url with {z} {x} {y}, and its credit
 *   bounds        the drawing's frame, { north, south, east, west }. The
 *                 800 x 600 sketch is exactly this area, so pins and traced
 *                 lines sit where they really are.
 *   places[]      the field guide entries, in page order
 *   scenery[]     the hand-drawn layer under the pins
 *
 * A place:
 *   slug          used for links, pins and photo names
 *   name, type, desc
 *   tone          optional card colour wash, 1-6 (cycles if left out)
 *   photos        optional, first is the cover: 'images/x.jpg', or
 *                 { src, caption } to add a caption
 *   lat, lng      the real position
 *   map           { x, y } fallback spot on the sketch; above: true lifts the label
 *
 * A scenery item:
 *   kind          road, lane, track, rail, stream, water, green, wood,
 *                 building, contour or bridge (styles live in map.css)
 *   pts           [[lat, lng], ...] on the real map, or
 *   d             an SVG path drawn straight onto the 800 x 600 sketch
 *   closed        an area rather than a line
 *   pencil        drawn twice, slightly apart, to look hand-drawn
 *   osm           traced from OpenStreetMap; tracing again replaces these
 * ------------------------------------------------------------------------- */

window.COFTON = {

  /* Where the editor's real map opens until a frame is set. */
  center: { lat: 52.3730, lng: -1.9930 },

  zoom: { min: 12, max: 18, start: 15 },

  /* The real map's tiles. Swap the url for another provider if you prefer —
   * it just needs {z} {x} {y} in it. Set to null to disable Real mode. */
  tiles: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },

  places: [
    {
      slug: 'triangle',
      name: 'The Triangle',
      type: 'Landmark',
      desc: 'The triangular junction on the way towards Barnt Green.',
      map: { x: 628, y: 496 }
    },
    {
      slug: 'swan-lake',
      name: 'Swan Lake',
      type: 'Ponds',
      desc: 'A collection of ponds near the reservoir. Not technically a lake.',
      map: { x: 452, y: 200, above: true }
    },
    {
      slug: 'ascotts',
      name: "Ascott's",
      type: 'Landmark',
      desc: "Long known as Ben's Ben's Ben's. The name changed. The name didn't really.",
      photos: ['images/ascotts-01.jpg', 'images/ascotts-02.jpg'],
      map: { x: 438, y: 280 }
    },
    {
      slug: 'cofton-park',
      name: 'Cofton Park',
      type: 'Park',
      desc: 'The big green one. The obvious one.',
      map: { x: 262, y: 188 }
    },
    {
      slug: 'troll-bridge',
      name: 'The Troll Bridge',
      type: 'Bridge',
      desc: 'A bridge on the estate with considerably more personality than its official name.',
      map: { x: 258, y: 366 }
    },
    {
      slug: 'rabbit-trails',
      name: 'Rabbit Trails',
      type: 'Path',
      desc: 'The cut-through on the way from home towards the Troll Bridge.',
      map: { x: 140, y: 420 }
    },
    {
      slug: 'muddy-path',
      name: 'The Muddy Path',
      type: 'Path',
      desc: 'Not on the plan. Muddy in a way that has stuck as a description.',
      map: { x: 466, y: 430 }
    }
  ],

  scenery: [
    { kind: 'contour', pencil: true, d: 'M 96 322 C 156 302, 232 308, 296 292' },
    { kind: 'contour', pencil: true, d: 'M 74 366 C 138 348, 214 352, 276 338' },
    { kind: 'contour', pencil: true, d: 'M 512 336 C 582 318, 656 328, 718 312' },
    { kind: 'contour', pencil: true, d: 'M 540 384 C 604 370, 668 378, 722 364' },

    { kind: 'green', d: 'M 216 202 C 204 152, 246 104, 302 98 C 358 92, 404 128, 400 178 C 396 228, 344 252, 292 250 C 248 248, 224 234, 216 202 Z' },
    { kind: 'green', d: 'M 340 560 C 374 540, 428 544, 450 566 C 468 584, 434 598, 392 594 C 356 590, 324 574, 340 560 Z' },

    { kind: 'water', d: 'M 520 70 C 585 42, 690 45, 742 90 C 780 124, 762 190, 700 212 C 636 236, 552 220, 522 176 C 494 136, 480 88, 520 70 Z' },
    { kind: 'water', d: 'M 452 226 C 470 210, 500 210, 512 226 C 522 240, 508 258, 484 258 C 462 258, 442 242, 452 226 Z' },
    { kind: 'water', d: 'M 424 260 C 436 250, 456 251, 463 262 C 470 274, 458 287, 442 287 C 426 287, 415 270, 424 260 Z' },

    { kind: 'stream', pencil: true, d: 'M 18 456 C 88 442, 150 400, 235 372 C 320 344, 400 300, 470 258 C 520 228, 560 210, 604 200' },

    { kind: 'road', pencil: true, d: 'M -10 560 C 90 540, 180 512, 280 500 C 380 488, 470 496, 560 500 C 650 504, 730 486, 810 452' },
    { kind: 'road', pencil: true, d: 'M 628 500 C 660 430, 690 380, 720 330 C 745 288, 760 250, 780 214' },
    { kind: 'road', pencil: true, d: 'M 392 340 C 375 285, 348 240, 318 195 C 292 155, 262 122, 244 94' },

    { kind: 'track', d: 'M 86 454 C 128 438, 176 410, 238 380' },
    { kind: 'track', d: 'M 370 408 C 418 420, 466 430, 512 450 C 556 468, 586 490, 604 512' },

    { kind: 'bridge', d: 'M 246 352 L 268 384 M 236 360 L 258 392' }
  ]
};
