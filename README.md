# Eng. Saber Mustafa — Portfolio (React + Vite)

## Run locally
```
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs /dist
```
## Deploy to GitHub Pages (free)
1. Create a GitHub repo and push this folder to the `main` branch.
2. Repo → **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` builds and publishes automatically (`.github/workflows/deploy.yml`). `base: './'` is set, so no path changes are needed.

## Replace images
Put new images in `public/assets/img/` (WebP, ~1800px wide for the large version, plus a 700px `-sm.webp` thumbnail). Update the file names in `src/data.js`. Logo: `public/assets/img/logo.png`; favicon: `public/favicon.png`.

## Add a project
Open `src/data.js`, copy a block inside `projects`, change `id`, `cat` (`residential` | `interior` | `technical`), the bilingual `title/short/overview/approach/role`, `technical` tags, and `images` / `drawings`. Add a new category by adding it to `categories` and to `cat` in `src/i18n.js`.

## Edit text / Arabic
Interface text: `src/i18n.js` (EN + AR). Services & projects: `src/data.js`. Contact numbers & email: `CONTACT` in `src/data.js`.
