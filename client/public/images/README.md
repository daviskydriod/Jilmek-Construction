# Missing project photos

This site was originally built on Manus's platform, which served all photos
from its own storage at paths like `/manus-storage/hero-red-roof_78e57ca6.jpeg`.
Those files live in Manus's storage, not in this repo, so they will 404 once
this site is hosted anywhere else (including cPanel).

The code has been updated to look for images in this folder (`/images/...`)
instead. Add your actual JILMEK project photos here using these exact
filenames (or update the paths in `client/src/App.tsx` `ASSETS` object and
`client/src/lib/mockCms.ts` `image()` helper to match whatever you use):

- logo_22da56e1.png
- hero-red-roof_78e57ca6.jpeg
- home-pink-roof_178510ed.jpeg
- home-blue-roof_36d157bc.jpeg
- colonnade_cc91d531.jpeg
- construction-frame_e0f41e5a.jpeg
- house-grey_2ed75e58.jpeg
- house-red_3d6d39f5.jpeg
- tall-house_60c0ab4a.jpeg
- roof-frame_e50d38a3.jpeg
- brick-home_3a6fc288.jpeg

Until these are added, the corresponding `<img>` tags on the site will
show broken image icons.
