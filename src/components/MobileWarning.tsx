import { useRef } from 'react';

const HURT_SFX = "/audio/Don't Starve Together Hurt Voice.mp3";

export function MobileWarning() {
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  if (typeof window !== 'undefined' && !sfxRef.current) {
    sfxRef.current = new Audio(HURT_SFX);
    sfxRef.current.volume = 0.3;
  }

  function handleTap() {
    const sfx = sfxRef.current;
    if (!sfx) return;
    sfx.currentTime = 0;
    void sfx.play().catch(() => {});
  }

  return (
    <div className="mobile-warning" onClick={handleTap}>
      <div className="mobile-warning__panel">
        <p className="mobile-warning__message">
          This grief does not fit your screen.
        </p>
      </div>
    </div>
  );
}
