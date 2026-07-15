# Easy Rider Vietnam Loops

Static website for Easy Rider Vietnam Loops motorbike tours, with Firebase-backed bookings.

## Photo galleries

All galleries are driven by `photo-manifest.js`, which lists every photo in the
`photos/` folder. The pages read the manifest at load time and build their
galleries from it:

- **Tour pages** show the matching `photos/route…` folder. Day folders
  (`day1…`, `day2…`) become "Day 1", "Day 2" sections — any text after the day
  number is shown as that day's route description. Folders inside a day are
  sightseeing stops; the folder name is the caption above its photos.
- **Home page** review marquee shows everything in `photos/Reviews/`.
- **Guides page** "Life Through the Viewfinder" shows `photos/Motorbikes/`,
  and the portraits come from `photos/guides/`.

### After uploading or removing photos

Regenerate the manifest and commit it:

```bash
python3 scripts/generate_photo_manifest.py
```

If the GitHub Action in `.github/workflows/photo-manifest.yml` is active, this
happens automatically on every push that changes `photos/` — no manual step
needed.

Photo file names can be anything (spaces and special characters are fine).
Inside a route folder, a `web/` subfolder — when present — is used instead of
its siblings, so you can keep web-optimised copies next to the originals.
