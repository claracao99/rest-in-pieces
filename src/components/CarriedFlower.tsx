interface Props {
  cursor: { x: number; y: number } | null;
  type: 'flower' | 'rot' | null;
  grown: boolean;
}

export function CarriedFlower({ cursor, type, grown }: Props) {
  if (!cursor || !type) return null;
  const variant = type === 'flower' ? 'flower--fresh' : 'flower--rot';
  return (
    <div
      className={`carried-flower ${grown ? 'carried-flower--grown' : ''}`}
      style={{ left: cursor.x, top: cursor.y }}
      aria-hidden
    >
      <span className={`flower ${variant}`} />
    </div>
  );
}
