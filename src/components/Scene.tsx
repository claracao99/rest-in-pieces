import { useEffect, useRef, useState } from 'react';
import { TombHitArea } from './TombHitArea';
import { TopSlots } from './TopSlots';
import { CarriedFlower } from './CarriedFlower';
import { IconCluster } from './IconCluster';
import { Subtitle } from './Subtitle';
import { useFlower, sceneStateFor } from '../hooks/useFlower';
import { useSfx } from '../hooks/useSfx';
import { flowerStore } from '../lib/flowerStore';
import {
  TOMBSTONE_SUBTITLES,
  CARRYING_SUBTITLES,
  ROT_CARRYING_SUBTITLES,
  FERTILIZE_SUBTITLES,
} from '../data/subtitles';
import {
  FLOWER_LIFESPAN_MS,
  FERTILIZER_BONUS_MS,
  FLOWER_REPLENISH_INTERVAL_MS,
  FLOWER_INITIAL_STOCK,
  FLOWER_MAX_STOCK,
} from '../lib/constants';
import type { LogEntry, SceneState } from '../types';

type CarryType = 'flower' | 'rot' | null;

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;

// Static asset paths must include Vite's base prefix (set in vite.config.ts
// to '/rest-in-pieces/' for GitHub Pages). String literals aren't rewritten
// at build time, so we prepend import.meta.env.BASE_URL.
const BASE = import.meta.env.BASE_URL;
const SUBTITLE_SFX = `${BASE}audio/voice-normal.mp3`;
const SLEEPY_SFX = `${BASE}audio/voice-sleepy.mp3`;
const HURT_SFX = `${BASE}audio/voice-hurt.mp3`;
const SLOT_SFX = `${BASE}audio/slot.mp3`;

const SCENE_STATES: SceneState[] = ['empty', 'flower', 'rot'];

export function Scene() {
  const flower = useFlower();
  const sceneState = sceneStateFor(flower);

  const [sfxOn, setSfxOn] = useState(true);
  const [carry, setCarry] = useState<CarryType>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [overTomb, setOverTomb] = useState(false);
  const [overFlower, setOverFlower] = useState(false);

  const [rotCount, setRotCount] = useState(0);
  const [lastPlacementAt, setLastPlacementAt] = useState<number | null>(null);
  useEffect(
    () =>
      flowerStore.subscribeLog((log: LogEntry[]) => {
        const collected = log.filter((e) => e.type === 'flower_removed').length;
        const used = log.filter((e) => e.type === 'fertilizer_used').length;
        setRotCount(collected - used);
        const placements = log
          .filter((e) => e.type === 'flower_placed')
          .map((e) => e.timestamp);
        setLastPlacementAt(placements.length ? Math.max(...placements) : null);
      }),
    [],
  );

  // Tick once a second so derived values (flower stock, time-to-rot, etc)
  // recompute without user interaction.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const memorialStartedAt = flowerStore.getMemorialStartedAt();
  // Regen clock starts at the last placement. Before any placement, it
  // starts at memorial open and the visitor begins with INITIAL_STOCK
  // already available.
  const regenReference = lastPlacementAt ?? memorialStartedAt;
  const elapsedSinceReference = Date.now() - regenReference;
  const generated =
    (lastPlacementAt === null ? FLOWER_INITIAL_STOCK : 0) +
    Math.floor(elapsedSinceReference / FLOWER_REPLENISH_INTERVAL_MS);
  const carryingFlowerProvisional = carry === 'flower' ? 1 : 0;
  const flowerStock = Math.max(
    0,
    Math.min(FLOWER_MAX_STOCK, generated) - carryingFlowerProvisional,
  );
  // Similarly, rot inventory decrements provisionally while a rot is being
  // carried. Commit happens on fertilize (logged as 'fertilizer_used').
  const carryingRotProvisional = carry === 'rot' ? 1 : 0;
  const visibleRotCount = Math.max(0, rotCount - carryingRotProvisional);

  const [subtitle, setSubtitle] = useState<{ id: number; text: string } | null>(null);
  const subtitleIdRef = useRef(0);
  const lastSubtitleIndexRef = useRef(-1);
  const lastCarryingIndexRef = useRef(-1);
  const lastRotCarryingIndexRef = useRef(-1);
  const lastFertilizeIndexRef = useRef(-1);

  useEffect(() => {
    const handler = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useEffect(() => {
    if (!carry) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCarry(null);
        setOverTomb(false);
        setOverFlower(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [carry]);

  const sfx = useSfx(
    { normal: SUBTITLE_SFX, sleepy: SLEEPY_SFX, hurt: HURT_SFX, slot: SLOT_SFX },
    { enabled: sfxOn },
  );

  function showSubtitle(
    text: string,
    voice: 'normal' | 'sleepy' | 'hurt' = 'normal',
  ) {
    subtitleIdRef.current += 1;
    setSubtitle({ id: subtitleIdRef.current, text });
    sfx.play(voice);
  }

  function pickRandom<T>(list: T[], lastRef: React.MutableRefObject<number>): T {
    let nextIndex = Math.floor(Math.random() * list.length);
    if (list.length > 1 && nextIndex === lastRef.current) {
      nextIndex = (nextIndex + 1) % list.length;
    }
    lastRef.current = nextIndex;
    return list[nextIndex];
  }

  function clearCarry() {
    setCarry(null);
    setOverTomb(false);
    setOverFlower(false);
  }

  function handleTombClick() {
    if (carry === 'flower' && sceneState === 'empty') {
      void flowerStore.placeFlower();
      clearCarry();
      sfx.play('slot');
      return;
    }
    if (carry === 'flower' && sceneState === 'rot') {
      showSubtitle('Sweep before you mourn.', 'hurt');
      return;
    }
    if (carry === 'flower' && sceneState === 'flower') {
      showSubtitle('One at a time.', 'hurt');
      return;
    }
    if (carry === 'rot' && sceneState !== 'flower') {
      showSubtitle(
        pickRandom(ROT_CARRYING_SUBTITLES, lastRotCarryingIndexRef),
        'hurt',
      );
      return;
    }
    if (!carry) {
      showSubtitle(pickRandom(TOMBSTONE_SUBTITLES, lastSubtitleIndexRef));
    }
  }

  function handleRotClick() {
    void flowerStore.removeFlower();
    sfx.play('slot');
  }

  async function handleFlowerClick() {
    if (carry === 'rot') {
      const applied = await flowerStore.fertilize(FERTILIZER_BONUS_MS);
      clearCarry();
      if (applied) {
        showSubtitle(pickRandom(FERTILIZE_SUBTITLES, lastFertilizeIndexRef));
      } else {
        showSubtitle('Already as alive as it gets.', 'hurt');
      }
      return;
    }
    if (!flower) return;
    const msLeft = Math.max(0, flower.placedAt + FLOWER_LIFESPAN_MS - Date.now());
    let text: string;
    if (msLeft < MINUTE_MS) {
      text = `I will die in ${Math.max(1, Math.ceil(msLeft / 1000))} sec`;
    } else if (msLeft < HOUR_MS) {
      text = `I will die in ${Math.ceil(msLeft / MINUTE_MS)} min`;
    } else {
      text = `I will die in ${Math.ceil(msLeft / HOUR_MS)} hours`;
    }
    showSubtitle(text, 'sleepy');
  }

  function handleFlowerSlotClick() {
    if (carry === 'flower') {
      clearCarry();
      sfx.play('slot');
      return;
    }
    if (carry === 'rot') return;
    if (flowerStock <= 0) return;
    setCarry('flower');
    sfx.play('slot');
  }

  function handleRotSlotClick() {
    if (carry === 'rot') {
      clearCarry();
      sfx.play('slot');
      return;
    }
    if (carry === 'flower') return;
    if (rotCount <= 0) return;
    setCarry('rot');
    sfx.play('slot');
  }

  function handleSceneClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!carry) return;
    const target = e.target as Element;
    if (target.closest('button') || target.tagName === 'path') return;
    if (carry === 'rot') {
      showSubtitle(
        pickRandom(ROT_CARRYING_SUBTITLES, lastRotCarryingIndexRef),
        'hurt',
      );
    } else {
      showSubtitle(pickRandom(CARRYING_SUBTITLES, lastCarryingIndexRef), 'hurt');
    }
  }

  // Visual "active" state for the flower slot button — pulses pointy-hand
  // cursor when there's a flower to pick up (and not in rot state).
  const canPickUp =
    (carry === null && flowerStock > 0) || carry === 'flower';
  const canUseRot = (carry === null && rotCount > 0) || carry === 'rot';

  const grown =
    (carry === 'flower' && overTomb) || (carry === 'rot' && overFlower);

  const sceneClass = [
    'scene',
    `scene--${sceneState}`,
    carry ? 'scene--carrying' : '',
    sceneState === 'rot' ? 'scene--rot-clickable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={sceneClass} onClick={handleSceneClick}>
      {SCENE_STATES.map((s) => (
        <div
          key={`backdrop-${s}`}
          className={`scene__backdrop scene__backdrop--${s} ${
            s === sceneState ? 'scene__backdrop--active' : ''
          }`}
          aria-hidden
        />
      ))}
      <div className="scene__stage">
        {SCENE_STATES.map((s) => (
          <div
            key={s}
            className={`scene__bg scene__bg--${s} ${
              s === sceneState ? 'scene__bg--active' : ''
            }`}
            aria-hidden
          />
        ))}

        <TombHitArea
          carry={carry}
          sceneState={sceneState}
          onTombClick={handleTombClick}
          onFlowerClick={handleFlowerClick}
          onRotClick={handleRotClick}
          onTombEnter={() => setOverTomb(true)}
          onTombLeave={() => setOverTomb(false)}
          onFlowerEnter={() => setOverFlower(true)}
          onFlowerLeave={() => setOverFlower(false)}
        />

        <TopSlots
          flowerStock={flowerStock}
          rotCount={visibleRotCount}
          canPickUp={canPickUp}
          canUseRot={canUseRot}
          onPickUpFlower={handleFlowerSlotClick}
          onUseRot={handleRotSlotClick}
        />

        <IconCluster sfxOn={sfxOn} onToggle={() => setSfxOn((v) => !v)} />
      </div>

      <Subtitle entry={subtitle} />
      <CarriedFlower cursor={carry ? cursor : null} type={carry} grown={grown} />
    </div>
  );
}
