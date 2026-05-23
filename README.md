# rest-in-pieces

A virtual tombstone memorial. React + Vite. Session-based, single-visitor — no backend required.

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
- Click the rot on the tomb to take it into the inventory.
- Pick up rot from the inventory → drop on the flower → adds time to the flower's lifespan (`FERTILIZER_BONUS_MS`), capped at the max lifespan.
- A new flower regenerates every `FLOWER_REPLENISH_INTERVAL_MS` after the last placement.
- Clicking the tomb in various contexts triggers a subtitle voiced by a Don't Starve sound effect; copy lives in [src/data/subtitles.ts](./src/data/subtitles.ts).

## Visual assets

Live in `public/assets/`. See [public/assets/README.md](./public/assets/README.md) for the filename contract. Scene is composed of three full-bleed PNGs that cross-fade based on state: `scene.png`, `scene-flower.png`, `scene-rot.png`.

## Audio

Drop `.mp3` files into `public/audio/`. Current expected files are referenced in [src/components/Scene.tsx](./src/components/Scene.tsx) at the top (SFX constants).

## Deploy

Push to GitHub, import into Vercel — works out of the box with Vite.

## Project structure

```
src/
  components/   Scene + all UI pieces (TombHitArea, TopSlots, Subtitle, …)
  hooks/        Small custom hooks (current flower, mobile detection)
  lib/          flowerStore (in-memory state + log), constants
  data/         subtitle copy
  types/        shared TS types
public/
  assets/       scene art, flower/rot icons, cursors, slot frame
  audio/        background music + voice/slot SFX
  fonts/        custom display font (Belisa Plumilla)
```
