import { useEffect, useState } from 'react';

const LINES = [
  'Digging the grave...',
  'Preparing the inevitable...',
  'Polishing the headstone...',
];

interface Props {
  textMs: number;
}

export function Loading({ textMs }: Props) {
  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const timers: number[] = [];
    LINES.forEach((_, i) => {
      if (i === 0) return;
      timers.push(window.setTimeout(() => setIndex(i), i * textMs));
    });
    timers.push(
      window.setTimeout(() => setShowText(false), LINES.length * textMs),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [textMs]);

  return (
    <div className="loading">
      {showText && (
        <p key={index} className="loading__text">{LINES[index]}</p>
      )}
    </div>
  );
}
