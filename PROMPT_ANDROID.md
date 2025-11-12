# Pocket Playlist — Project Summary & Android Packaging Guide

This single file contains a polished project prompt, feature summary, technical inventory, color palette, and step-by-step instructions to package the web app as an Android app (Trusted Web Activity and Capacitor). Use it as README copy, Play Store listing draft, or as the brief to hand to someone who will build the Android APK.

---

## Project name

Pocket Playlist

## One-line pitch

Listen smarter — lightweight, installable music player (YouTube & audio) with background playback and a modern PWA experience.

## Short description (use for Play Store short description)

Pocket Playlist — a small, fast PWA for playlists and background music playback (YouTube-based). Installable, responsive, and optimized for mobile.

## Full description (README / Play Store long description)

Pocket Playlist is a mobile-first progressive web app that helps users search, play, and manage playlists sourced from YouTube and other audio endpoints. It focuses on fast performance, small footprint, and an excellent installable experience. Background playback is improved using a hidden audio player and the Media Session API to show metadata and respond to lock-screen controls. The app includes a responsive audio player, a YouTube video player, playlist CRUD, offline fallback, and a compact install prompt.

Key features:

- Search and play tracks (YouTube-backed playback via the IFrame API)
- Audio-only hidden player for background listening with Media Session integration
- Visual YouTube player for video playback when needed
- Create, edit, delete custom playlists
- Responsive UI with mobile-first controls and hidden labels on small screens
- PWA-ready: manifest, service worker, offline fallback, icons
- Compact InstallPrompt and iOS install hint

---

## Tech stack

- React (v19) + Vite build
- Tailwind-style utility classes
- YouTube IFrame API (managed by `src/lib/ytManager.js`)
- Service worker (public/sw.js) with network-first navigations
- PWA manifest (public/manifest.json) with icons in `public/icons/`
- Host / deploy: Vercel (uses `vercel.json` for headers & rewrites)

Relevant source files (important to include in repo and in build):

- `src/components/Player/AudioPlayer.jsx`
- `src/components/Player/YTPlayer.jsx`
- `src/components/SongList.jsx`
- `src/components/ui/InstallPrompt.jsx`
- `src/lib/ytManager.js`
- `index.html` (root, meta tags)
- `public/sw.js`, `public/manifest.json`, `public/offline.html`, `public/icons/*`

Build & run

```bash
# Install deps
npm install
# Develop
npm run dev
# Build production
npm run build    # generates `dist/`
# Preview locally
npm run preview
```

---

## Color palette (use in Play Store assets and app theme)

- Primary (brand purple): #7C3AED
- Primary dark (toast / surface): #0B1220
- Gradient accent (optional): from #6D28D9 → #4F46E5
- Muted text: #9CA3AF
- Surface/card background: #11121A
- White/text: #FFFFFF

Use `#7C3AED` as the `theme_color` in `manifest.json` and for CTA accents.

---

## Assets you must bundle / publish (from `dist/` after build)

- `dist/index.html` (entry)
- `dist/assets/*.js` and `dist/assets/*.css` (hashed assets)
- `dist/manifest.json`
- `dist/sw.js`
- `dist/offline.html`
- `dist/icons/icon-192.png`, `dist/icons/icon-512.png` (app icons)

NOTE: Ensure `manifest.json` and `sw.js` are served from the same origin over HTTPS and that they are reachable at `/manifest.json` and `/sw.js` on your production domain.

---

## Packaging for Android — Option A: Trusted Web Activity (TWA) — recommended

TWA wraps your PWA in a minimal native shell and runs it in Chrome on Android. It preserves PWA capabilities (service worker, media session) and is the simplest way to publish a PWA to Google Play.

Steps (bubblewrap):

1. Build and host the PWA at a public HTTPS URL (e.g. `https://pocketplaylist.tech`).

```bash
npm run build
# deploy the `dist/` to an HTTPS origin OR use an existing deployed site
```

2. Install Bubblewrap CLI:

```bash
npm install -g @bubblewrap/cli
```

3. Initialize Bubblewrap with your site manifest:

```bash
bubblewrap init --manifest=https://pocketplaylist.tech/manifest.json
```

Follow the prompts: choose app id (example: `com.yourname.pocketplaylist`), signing key or automatic generation.

4. Build the TWA and generate APK/AAB:

```bash
bubblewrap build
```

5. Test on a device (adb install) and then upload to Play Console.

Notes & tips:

- Make sure `manifest.json` has correct `scope` and `start_url`.
- Use `display: standalone` and include 192/512 icons.
- MediaSession and background audio should function as the runtime is Chrome.

---

## Packaging for Android — Option B: Capacitor (native container)

Use Capacitor if you need native plugins, custom native UI or background services.

Steps:

```bash
npm install @capacitor/core @capacitor/cli --save
npx cap init pocket-playlist com.yourname.pocketplaylist
npm run build
npx cap add android
npx cap copy android
npx cap open android
```

Open the project in Android Studio and configure signing, permissions (WAKE_LOCK, FOREGROUND_SERVICE if needed), and any plugins.

Notes:

- Capacitor gives more control (native plugins) but larger app size.
- For YouTube playback, running in a WebView may require `setSupportMultipleWindows(false)` or `setMediaPlaybackRequiresUserGesture(false)` depending on playback behavior.

---

## Play Store metadata (ready to paste)

Title: Pocket Playlist
Short description: Lightweight music player (YouTube & audio) with background playback.
Full description: Pocket Playlist is a mobile-first PWA for building and playing playlists from YouTube and audio sources. Installable, small, and optimized for background listening with lock-screen controls via Media Session. Create playlists, search, and enjoy offline fallback.

Feature bullets:

- Installable PWA
- Background playback with lock-screen controls
- YouTube audio & video support
- Lightweight and responsive UI

Suggested graphic & color guidance:

- Primary color: #7C3AED (use for CTA and accent elements in screenshots)
- Feature graphic: 1024x500 — use a gradient from #6D28D9 → #4F46E5 with app name and mockup phone.

---

## SW / server checks & common pitfalls

- Ensure `vercel.json` (or your host) serves `sw.js` and `manifest.json` with correct Content-Type and Access-Control-Allow-Origin if the site can be requested from another origin.
- Avoid rewriting asset paths to `/` (this causes HTML to be returned for JS/CSS requests and results in MIME errors).
- Ensure `index.html` served from the origin references current hashed assets; stale cached HTML or old SW can cause 404s for mismatched asset names.

Useful commands for debugging the deployed site:

```bash
# show headers for manifest and sw
curl -I https://pocketplaylist.tech/manifest.json
curl -I https://pocketplaylist.tech/sw.js

# fetch production index head and check assets
curl -s https://pocketplaylist.tech/ | sed -n '1,120p'

# check asset response and headers
curl -I https://pocketplaylist.tech/assets/index-<hash>.js
```

---

## Testing checklist before submission

- Install the PWA on Android Chrome: `Add to Home screen` works and app opens standalone.
- Background playback continues when screen locks (MediaSession metadata visible).
- Play/Pause from lock screen works.
- Offline navigation fallback (offline.html) works for navigation when offline.
- No MIME type errors in console for module scripts.
- `manifest.json` and `sw.js` are accessible and served with correct MIME types and CORS headers.

---

## Quick troubleshooting notes

- If you see `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"`: check for rewrites that return `index.html` for asset URLs or an SW that returns `offline.html` for JS requests.
- If install/deploy problems appear on Vercel: ensure `vercel.json` points `builds` to `dist` or provide the appropriate `build` script.

---

## Want me to: (choose one)

- Produce a Bubblewrap `config` and exact commands for your production URL (I can generate CLI commands)
- Add a small SW-update prompt snippet to `src/main.jsx` to notify users when a new version is available
- Generate Play Store-ready marketing copy and a feature graphic mockup spec

Tell me which follow-up you want and I will create the file or commit the code.
