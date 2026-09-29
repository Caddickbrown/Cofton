# Photos

The easy way: open `edit.html`, drop photos onto a place and publish. They
are resized and named for you. The rest of this page is for doing it by hand:
drop image files in here and point `places.js` at them.

```
images/
├── ascotts-01.jpg
├── ascotts-02.jpg
└── muddy-path-01.jpg
```

## Adding them

Each place takes a `photos` array. Order matters — the first one is the cover.

```js
{
  slug: 'muddy-path',
  name: 'The Muddy Path',
  type: 'Path',
  desc: 'Not on the plan. Muddy in a way that has stuck as a description.',
  photos: [
    'images/muddy-path-01.jpg',
    'images/muddy-path-02.jpg'
  ]
}
```

That gives the place a cover on its card, a "2 photos" badge, and a lightbox
with a thumbnail strip and arrow-key navigation. One photo hides the badge;
zero photos falls back to the colour wash.

## Notes

- `.jpg`, `.webp`, `.avif` and `.png` all work. Landscape crops best — the
  cards are tall and the lightbox is 4:3.
- Keep them under roughly 300 KB. There is no image pipeline here, so the
  browser downloads them exactly as they are.
- A path that 404s is dropped silently and the card falls back to its wash,
  so it is safe to list a photo before you have it.
- For a caption, use the object form instead of a plain string:

```js
photos: [
  { src: 'images/ascotts-01.jpg', alt: 'The bend at the top of Ascott’s', caption: 'Taken in the rain, obviously.' }
]
```
