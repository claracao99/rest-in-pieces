# Assets

Drop your illustrated assets in this folder using these exact filenames. The app already references them — once a file exists, it appears in the scene automatically (no code change required). Until then, CSS falls back to flat-color placeholders so you can navigate the UI.

## Scene (3 end-states — full-bleed, identical composition, just the tombstone area differs)
- `scene.png` — empty tomb (initial state)
- `scene-flower.png` — same scene with a fresh flower visible on the tomb
- `scene-rot.png` — same scene with the rotted flower on the tomb

## Flower icons (used only for the carried-on-cursor visual + the top-right slot art)
- `flower.png` — vivid full bloom
- `rot.png` — wilted/rotted version

## Cursors (32×32 PNG)
- `cursor-default.png`
- `cursor-flower.png` — peony bud / carrying-a-flower cursor (also used when hovering the tomb while carrying)
- `cursor-remove.png` — used on hover of a rotted flower

## Icons (SVG from game-icons.net or similar)
- `icon-music-on.svg`
- `icon-music-off.svg`

## Audio
- `../audio/ambient.mp3` — looping background music (visitor can mute/unmute)
