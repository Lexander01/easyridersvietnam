'use strict';

/* Tour photo gallery, rendered from photo-manifest.js.
   Usage on a tour page:
     <script src="photo-manifest.js"></script>
     <script src="gallery.js"></script>
     <script>renderTourGallery('route1dalathoian5day');</script>
   Expects #photoGallery, #galleryEmpty and the #lightbox markup. */

function renderTourGallery(manifestKey) {
  const container = document.getElementById('photoGallery');
  const empty = document.getElementById('galleryEmpty');
  const entry = (window.PHOTO_MANIFEST || {})[manifestKey];
  if (!container) return;

  const allPhotos = [];

  function makeGrid(photos, altPrefix) {
    const grid = document.createElement('div');
    grid.className = 'gallery-grid';
    photos.forEach(function (path) {
      const idx = allPhotos.length;
      allPhotos.push(path);
      const el = document.createElement('div');
      el.className = 'gallery-item';
      const img = document.createElement('img');
      img.src = path;
      img.alt = altPrefix;
      img.loading = 'lazy';
      img.addEventListener('error', function () { el.remove(); });
      el.appendChild(img);
      el.addEventListener('click', function () { openLb(idx); });
      grid.appendChild(el);
    });
    return grid;
  }

  function appendStops(parent, stops, altPrefix) {
    stops.forEach(function (stop) {
      const wrap = document.createElement('div');
      wrap.className = 'gallery-stop';
      if (stop.name) {
        const label = document.createElement('p');
        label.className = 'gallery-stop-name';
        label.textContent = stop.name;
        wrap.appendChild(label);
      }
      wrap.appendChild(makeGrid(stop.photos, stop.name || altPrefix));
      parent.appendChild(wrap);
    });
  }

  if (entry && entry.days) {
    entry.days.forEach(function (day) {
      const section = document.createElement('div');
      section.className = 'gallery-day';
      const title = document.createElement('h4');
      title.className = 'gallery-day-title';
      title.textContent = 'Day ' + day.day;
      if (day.route) {
        const route = document.createElement('span');
        route.className = 'gallery-day-route';
        route.textContent = ' — ' + day.route;
        title.appendChild(route);
      }
      section.appendChild(title);
      appendStops(section, day.stops, 'Day ' + day.day + ' tour photo');
      container.appendChild(section);
    });
  }
  if (entry && entry.stops) {
    appendStops(container, entry.stops, 'Tour photo');
  }
  if (entry && entry.photos) {
    container.appendChild(makeGrid(entry.photos, 'Tour photo'));
  }

  if (!allPhotos.length) {
    if (empty) empty.style.display = 'block';
    return;
  }

  /* Lightbox */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  if (!lb || !lbImg) return;
  let cur = 0;

  function openLb(idx) {
    cur = idx;
    lbImg.src = allPhotos[idx];
    lb.classList.add('active');
    document.body.classList.add('no-scroll');
  }
  function closeLb() {
    lb.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
  document.getElementById('lightboxClose').addEventListener('click', closeLb);
  document.getElementById('lightboxPrev').addEventListener('click', function () {
    cur = (cur - 1 + allPhotos.length) % allPhotos.length;
    lbImg.src = allPhotos[cur];
  });
  document.getElementById('lightboxNext').addEventListener('click', function () {
    cur = (cur + 1) % allPhotos.length;
    lbImg.src = allPhotos[cur];
  });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
  });
}
