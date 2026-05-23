import { useEffect, useRef, useState } from 'react';
import { Scene } from './components/Scene';
import { MobileWarning } from './components/MobileWarning';
import { Loading } from './components/Loading';
import { useIsMobile } from './hooks/useIsMobile';

const CRITICAL_ASSETS = [
  '/assets/scene.webp',
  '/assets/scene-flower.webp',
  '/assets/scene-rot.webp',
  '/assets/flower.png',
  '/assets/rot.png',
  '/assets/slots-empty.png',
  '/assets/cursor-open-hand.png',
  '/assets/cursor-pointy-hand.png',
  '/assets/speaker-on.png',
  '/assets/speaker-off.png',
];

const LINE_COUNT = 3;
// Per-line range for text display. Pause at the end of loading is added on top.
const TEXT_MS_MIN = 1300;
const TEXT_MS_MAX = 2500;
const PAUSE_MS_MIN = 400;
const PAUSE_MS_MAX = 900;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export default function App() {
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);

  // Randomise loading durations once per visit so reloads feel different.
  const timingRef = useRef<{ textMs: number; totalMs: number } | null>(null);
  if (timingRef.current === null) {
    const textMs = randInt(TEXT_MS_MIN, TEXT_MS_MAX);
    const pauseMs = randInt(PAUSE_MS_MIN, PAUSE_MS_MAX);
    timingRef.current = { textMs, totalMs: textMs * LINE_COUNT + pauseMs };
  }
  const { textMs, totalMs } = timingRef.current;

  useEffect(() => {
    if (isMobile) return;
    let cancelled = false;
    const loadAll = async () => {
      const images = Promise.all(CRITICAL_ASSETS.map(preloadImage));
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      await Promise.all([images, fonts, sleep(totalMs)]);
      if (!cancelled) setReady(true);
    };
    void loadAll();
    return () => {
      cancelled = true;
    };
  }, [isMobile, totalMs]);

  if (isMobile) return <MobileWarning />;
  if (!ready) return <Loading textMs={textMs} />;
  return <Scene />;
}
