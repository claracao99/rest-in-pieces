import { useRef } from 'react';

export type SfxKey = 'normal' | 'sleepy' | 'hurt' | 'slot';

interface Options {
  enabled: boolean;
  volume?: number;
}

export function useSfx(sources: Record<SfxKey, string>, opts: Options) {
  const refs = useRef<Record<SfxKey, HTMLAudioElement | null>>({
    normal: null,
    sleepy: null,
    hurt: null,
    slot: null,
  });

  if (typeof window !== 'undefined' && !refs.current.normal) {
    (Object.keys(sources) as SfxKey[]).forEach((k) => {
      const audio = new Audio(sources[k]);
      audio.volume = opts.volume ?? 0.3;
      refs.current[k] = audio;
    });
  }

  function stopAll() {
    (Object.values(refs.current) as (HTMLAudioElement | null)[]).forEach((a) => {
      if (a && !a.paused) {
        a.pause();
        a.currentTime = 0;
      }
    });
  }

  function play(key: SfxKey) {
    if (!opts.enabled) return;
    const audio = refs.current[key];
    if (!audio) return;
    stopAll();
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }

  return { play };
}
