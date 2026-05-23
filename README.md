# rest-in-pieces

A virtual tombstone memorial. React + Vite. Session-based, single-visitor — no backend required.

Live at **https://claracao99.github.io/rest-in-pieces/**.

See [for-clara.md](./for-clara.md) for the creative / asset checklist.

## Run locally

```bash
npm install
npm run dev
```

State is in-memory and resets on every reload. Each visitor's session is independent.

## Mechanics, in short

- Pick up a flower from the top-right slot → it follows the cursor → click the tombstone to place it.
- The flower lasts a short while (`FLOWER_LIFESPAN_MS` in [src/lib/constants.ts](./src/lib/constants.ts)), then becomes rot.
- Click the rot on the tomb to move it into your inventory.
- Pick up rot from the inventory → drop on the flower → adds time to the flower's lifespan (`FERTILIZER_BONUS_MS`), capped at the max.
- A new flower regenerates every `FLOWER_REPLENISH_INTERVAL_MS` after the last placement.
- Clicking the tomb (in various contexts) triggers a randomly-chosen subtitle; subtitle copy lives in [src/data/subtitles.ts](./src/data/subtitles.ts).
- Speaker icon (top-left) toggles all SFX; mute cuts off currently-playing audio immediately.
- Below 768px viewport width, visitors see a static block screen instead of the scene.

## Loading

App preloads the critical images and font, then waits for a randomised duration (4.3 – 8.4 s) so the loading screen always feels intentional. Rotates through three thematic lines, finishes on a brief black pause, then fades into the scene. Tuneables in [src/App.tsx](./src/App.tsx).

## Visual assets

Live in `public/assets/`. See [public/assets/README.md](./public/assets/README.md) for the filename contract. The scene is composed of three full-bleed **WebP** files that cross-fade based on state: `scene.webp`, `scene-flower.webp`, `scene-rot.webp`. Smaller PNGs cover the cursor, slot frame, flower/rot icons, and speaker icons.

## Audio

Expected files in `public/audio/`:
- `voice-normal.mp3` — narrator voice for ambient subtitle clicks
- `voice-sleepy.mp3` — the flower speaking (countdown lines)
- `voice-hurt.mp3` — wrong-action feedback (carrying off-target, etc.)
- `slot.mp3` — pickup / drop / fertilize click

Routed through [src/hooks/useSfx.ts](./src/hooks/useSfx.ts). Volume defaults to 0.3; no overlap (a new sound stops the previous).

## Deploy

GitHub Pages via Actions. Pushing to `main` triggers [.github/workflows/deploy.yml](./.github/workflows/deploy.yml), which builds and publishes the Vite output. Pages source must be set to **GitHub Actions** in repo settings.

## Project structure

```
src/
  components/   Scene + all UI pieces (TombHitArea, TopSlots, Subtitle, Loading, MobileWarning, …)
  hooks/        useFlower, useSfx, useIsMobile
  lib/          flowerStore (in-memory state + log), constants
  data/         subtitle copy
  types/        shared TS types
public/
  assets/       scene WebPs, flower/rot icons, cursors, slot frame, speaker icons
  audio/        voice + slot SFX
  fonts/        custom display font (Belisa Plumilla)
```
