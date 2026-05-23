const DUST_MOTES = Array.from({ length: 40 }, (_, i) => i);

export function AtmosphericEffects() {
  return (
    <div className="atmosphere" aria-hidden>
      {DUST_MOTES.map((i) => (
        <span
          key={`mote-${i}`}
          className="mote"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 100}%`,
            animationDelay: `${(i * 0.7) % 6}s`,
            animationDuration: `${8 + (i % 5) * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
