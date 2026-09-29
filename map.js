/* ---------------------------------------------------------------------------
 * Cofton — shared map code, used by index.html and edit.html.
 *
 *   frame(bounds)   the drawing's frame: real coordinates -> the 800 x 600 sketch
 *   sceneryMarkup   the hand-drawn layer, as SVG
 *   Tiles           a tiny slippy-map tile layer (no library)
 *
 * Everything is Web Mercator, the same projection as the tiles, so the sketch
 * and the real map line up exactly.
 * ------------------------------------------------------------------------- */
(function(){
  var SK = { w: 800, h: 600 };

  /* Painting order, bottom to top. Anything unknown goes on top. */
  var LAYERS = ['contour', 'building', 'green', 'wood', 'water', 'stream', 'rail', 'track', 'lane', 'road', 'bridge'];

  function isNum(v){ return typeof v === 'number' && isFinite(v); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); }
  function photosOf(p){ return (p.photos || []).map(function(ph){ return typeof ph === 'string' ? { src: ph } : ph; }); }

  /* --- projection ------------------------------------------------------- */
  /* Web Mercator, normalised to 0..1 across the world. */
  function merc(lat, lng){
    var s = Math.max(-0.9999, Math.min(0.9999, Math.sin(lat * Math.PI / 180)));
    return { x: (lng + 180) / 360, y: 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI) };
  }
  function unmerc(x, y){
    return { lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180 / Math.PI, lng: x * 360 - 180 };
  }

  /* bounds = { north, south, east, west }, fitted into 800 x 600, centred,
   * north up. Returns null until the bounds make sense. */
  function frame(b){
    if (!b || !isNum(b.north) || !isNum(b.south) || !isNum(b.east) || !isNum(b.west)) return null;
    var a = merc(b.north, b.west), z = merc(b.south, b.east);
    var sx = z.x - a.x, sy = z.y - a.y;
    if (!(sx > 0 && sy > 0)) return null;
    var s = Math.min(SK.w / sx, SK.h / sy);
    var ox = (SK.w - sx * s) / 2 - a.x * s, oy = (SK.h - sy * s) / 2 - a.y * s;
    return {
      toSketch: function(lat, lng){ var m = merc(lat, lng); return { x: m.x * s + ox, y: m.y * s + oy }; },
      toLatLng: function(x, y){ return unmerc((x - ox) / s, (y - oy) / s); }
    };
  }

  /* --- scenery ---------------------------------------------------------- */
  /* Catmull-Rom through the points, as cubic Béziers, so traced lines keep
   * the soft hand-drawn curve instead of looking like a GPS track. */
  function smooth(p, closed){
    var n = p.length;
    if (n < 2) return '';
    function f(v){ return Math.round(v * 10) / 10; }
    var d = 'M' + f(p[0][0]) + ' ' + f(p[0][1]);
    if (n === 2 && !closed) return d + 'L' + f(p[1][0]) + ' ' + f(p[1][1]);
    var last = closed ? n : n - 1;
    for (var i = 0; i < last; i++){
      var p0 = p[closed ? (i - 1 + n) % n : Math.max(i - 1, 0)], p1 = p[i],
          p2 = p[closed ? (i + 1) % n : i + 1], p3 = p[closed ? (i + 2) % n : Math.min(i + 2, n - 1)];
      d += 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
                 f(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' +
                 f(p2[0]) + ' ' + f(p2[1]);
    }
    return d + (closed ? 'Z' : '');
  }

  /* An item is either traced (pts: [[lat, lng], ...], needs a frame) or
   * drawn straight into the 800 x 600 sketch (d: an SVG path). */
  function itemPath(it, fr){
    if (it.pts){
      if (!fr) return '';
      return smooth(it.pts.map(function(q){ var s = fr.toSketch(q[0], q[1]); return [s.x, s.y]; }), !!it.closed);
    }
    return it.d || '';
  }

  function rank(kind){ var r = LAYERS.indexOf(kind); return r < 0 ? LAYERS.length : r; }

  /* data-i is the item's index in the original array, whatever order it paints in.
   * opts.hit adds a fat invisible stroke to make thin lines clickable. */
  function sceneryMarkup(items, fr, opts){
    opts = opts || {};
    return (items || []).map(function(it, i){ return { it: it, i: i }; })
      .sort(function(a, b){ return rank(a.it.kind) - rank(b.it.kind) || a.i - b.i; })
      .map(function(o){
        var d = itemPath(o.it, fr);
        if (!d) return '';
        d = esc(d);
        return '<g class="sc sc-' + esc(o.it.kind) + (opts.selected === o.i ? ' is-sel' : '') + '" data-i="' + o.i + '">' +
          '<path d="' + d + '"/>' +
          (o.it.pencil ? '<path class="echo" d="' + d + '"/>' : '') +
          (opts.hit ? '<path class="hit" d="' + d + '"/>' : '') + '</g>';
      }).join('');
  }

  /* --- tiles ------------------------------------------------------------ */
  /* el: an empty positioned element. o: { url, center, zoom, min, max, onrender, onfail } */
  function Tiles(el, o){
    var SIZE = 256, cache = {}, loaded = 0, failed = 0, warned = false;
    var st = { lat: o.center.lat, lng: o.center.lng, zoom: o.zoom || 15 };
    var layer = document.createElement('div');
    layer.className = 'tiles';
    el.appendChild(layer);

    function size(){ return { w: el.clientWidth, h: el.clientHeight }; }
    function world(){ return SIZE * Math.pow(2, st.zoom); }
    function clamp(z){ return Math.max(o.min || 3, Math.min(o.max || 19, z)); }

    function project(lat, lng){
      var m = merc(lat, lng), c = merc(st.lat, st.lng), W = world(), s = size();
      return { x: (m.x - c.x) * W + s.w / 2, y: (m.y - c.y) * W + s.h / 2 };
    }
    function unproject(x, y){
      var c = merc(st.lat, st.lng), W = world(), s = size();
      return unmerc(c.x + (x - s.w / 2) / W, c.y + (y - s.h / 2) / W);
    }

    function render(){
      var s = size();
      if (!s.w) return;
      /* tiles only come in whole zoom levels, so scale the nearest one */
      var z = Math.max(0, Math.min(19, Math.round(st.zoom))), n = Math.pow(2, z);
      var ts = SIZE * Math.pow(2, st.zoom - z);
      var c = merc(st.lat, st.lng);
      var left = c.x * n * ts - s.w / 2, top = c.y * n * ts - s.h / 2;
      var seen = {};
      for (var x = Math.floor(left / ts); x <= Math.floor((left + s.w) / ts); x++){
        for (var y = Math.floor(top / ts); y <= Math.floor((top + s.h) / ts); y++){
          if (y < 0 || y >= n) continue;
          var key = z + '/' + x + '/' + y, img = cache[key];
          seen[key] = 1;
          if (!img){
            img = new Image();
            img.className = 'tile'; img.alt = ''; img.draggable = false;
            img.onload = function(){ loaded++; };
            img.onerror = function(){
              failed++;
              if (!warned && failed > 3 && failed > loaded){ warned = true; if (o.onfail) o.onfail(); }
            };
            img.src = o.url.replace('{z}', z).replace('{x}', ((x % n) + n) % n).replace('{y}', y);
            cache[key] = img; layer.appendChild(img);
          }
          /* +0.5 hides hairline seams between scaled tiles */
          img.style.left = (x * ts - left) + 'px'; img.style.top = (y * ts - top) + 'px';
          img.style.width = img.style.height = (ts + 0.5) + 'px';
        }
      }
      for (var k in cache) if (!seen[k]){ layer.removeChild(cache[k]); delete cache[k]; }
      if (o.onrender) o.onrender();
    }

    function pan(dx, dy){
      var s = size(), ll = unproject(s.w / 2 - dx, s.h / 2 - dy);
      st.lat = ll.lat; st.lng = ll.lng;
      render();
    }
    /* keep whatever is under (x, y) under it */
    function zoomAt(x, y, dz){
      var before = unproject(x, y);
      st.zoom = clamp(st.zoom + dz);
      var after = project(before.lat, before.lng);
      pan(x - after.x, y - after.y);
    }
    function fit(b){
      var s = size();
      if (!s.w) return;
      var a = merc(b.north, b.west), z = merc(b.south, b.east);
      st.zoom = Math.log(Math.min(s.w / (z.x - a.x), s.h / (z.y - a.y)) / SIZE) / Math.LN2;
      var c = unmerc((a.x + z.x) / 2, (a.y + z.y) / 2);
      st.lat = c.lat; st.lng = c.lng;
      render();
    }
    function bounds(){
      var s = size(), nw = unproject(0, 0), se = unproject(s.w, s.h);
      return { north: nw.lat, south: se.lat, east: se.lng, west: nw.lng };
    }

    return { render: render, project: project, unproject: unproject, pan: pan, zoomAt: zoomAt, fit: fit, bounds: bounds,
             view: function(){ return { lat: st.lat, lng: st.lng, zoom: st.zoom }; } };
  }

  window.CoftonMap = {
    SK: SK, isNum: isNum, esc: esc, photosOf: photosOf,
    merc: merc, unmerc: unmerc, frame: frame,
    itemPath: itemPath, sceneryMarkup: sceneryMarkup, Tiles: Tiles
  };
})();
