# Pocket Playlist — Expo demo

This is a minimal Expo demo scaffold for the Pocket Playlist app. It is intended as a starting point for porting your web PWA into a React Native app.

What I created:

- `App.js` — simple starter screen using the app colors and basic layout.
- `package.json` — dependencies for an Expo-managed app (Expo SDK 48 pinned versions).

How to run locally (on your machine)

1. Install Expo CLI (if you don't have it):

```bash
npm install -g expo-cli
# or use npx expo
```

2. From the project root run:

```bash
cd rn-expo
npm install
npm run start
# or
npx expo start
```

3. Open the app on your phone using the Expo Go app or run on Android emulator with `npm run android`.

Next steps I will do if you confirm (pick one or multiple):

- A: Implement the audio player screen using `react-native-track-player` (requires eject for background service) — recommended for full background playback
- B: Implement YouTube playback using `react-native-youtube-iframe` (works inside WebView/Expo)
- C: Port playlist UI and persistence using `@react-native-async-storage/async-storage`
- D: Configure native background playback (this requires moving from Expo-managed to a bare workflow or using EAS and config plugins)

Notes & constraints:

- Expo managed workflow is fast to iterate but background audio with a native service typically requires ejecting or using EAS with custom plugins. If you need reliable background playback and lock-screen controls, I recommend the Bare RN approach (I can scaffold that too).

Tell me which next step (A/B/C/D) you want me to implement and I'll start coding the RN components and wiring them to the existing project logic.
