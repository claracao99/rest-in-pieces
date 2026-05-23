# rest-in-pieces — Your Checklist

Visual assets, copy, and audio to create.

---

## Visual Assets (Illustration)

### Scene (3 images — same composition, only the tombstone area differs)
- [ ] `scene.png` — empty tomb
- [ ] `scene-flower.png` — same scene with a fresh flower on the tomb
- [ ] `scene-rot.png` — same scene with the flower rotted

### Tombstone hit-area (1 SVG path)
- [ ] In your illustration tool, trace the tombstone silhouette as a single path and export the SVG. The dev will paste the `d=` path data into `src/components/TombHitArea.tsx`. The path defines where clicks register as "on the tomb".

### Flower icons (small, for the cursor + top-right slot art)
- [ ] `flower.png` — vibrant, full bloom
- [ ] `rot.png` — wilted, grey-brown, drooping

### Cursors (3 small images, 32×32px)
- [ ] `cursor-default.png` — gothic ornate pointer
- [ ] `cursor-flower.png` — flower bud (shown while carrying a flower)
- [ ] `cursor-remove.png` — brush or cloth (for removing rotted flowers)

### UI Frame (Post-MVP, optional)
- [ ] `icon-frame.png` — ornate gothic frame/badge for top-right cluster

### Icons (From Game-icons.net — no drawing needed)
- Browse [Game-icons.net](https://game-icons.net/)
- Pick gothic/medieval icons:
  - [ ] Music on/off icon

---

## Copy & Text Content

### Tombstone Engraving
- [ ] Decide couple's names (for engraving)
- [ ] Decide dates (for engraving)
- [ ] Write epitaph (short, 1–2 lines, for engraving)

### Hover Discovery Tooltips
- [ ] Write 3–5 short bittersweet moments / facts
  - Examples: "this couple never took a photo together", "they always ordered the same coffee", "her favorite was his favorite too"
  - These appear when hovering over different parts of the graveyard scene

---

## Audio

- [ ] Source or create background music
  - Loopable, ambient graveyard soundtrack
  - Melancholic, contemplative tone
  - ~2–5 min duration recommended
  - File format: MP3 or WAV
  - Visitor can mute/unmute via speaker icon

---

## Design Notes

- **Color palette:** Dark, gothic, desaturated — moody but not harsh
- **Art style:** Illustrated, hand-drawn feel (not photo-realistic)
- **Interaction:** Only one flower can sit on the tomb at a time. Visitor clicks the top-right flower slot to pick one up (it follows their cursor), then clicks anywhere inside the tombstone silhouette to drop it — the whole scene swaps to `scene-flower.png`. After 3 days the scene swaps to `scene-rot.png`. Clicking the tomb in the rot state clears the flower (counted in the top-right rot slot) and the scene returns to `scene.png`, ready for the next one.

---

## Once Complete

Send these files to Claude and they'll be integrated into the web app. No need to optimize or compress — just high-quality PNGs and audio.
