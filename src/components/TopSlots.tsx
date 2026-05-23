interface Props {
  canPickUp: boolean;
  canUseRot: boolean;
  onPickUpFlower: () => void;
  onUseRot: () => void;
  flowerStock: number;
  rotCount: number;
}

// Positions inside the 276×178 frame, as % so they scale.
const FLOWER_HIT = { left: 52, top: 18, width: 36, height: 62 };
const ROT_HIT = { left: 12, top: 18.0, width: 36, height: 62 };

// Where the count badge sits (slot centers).
const FLOWER_COUNT_ANCHOR = { left: 70, top: 49 };
const ROT_COUNT_ANCHOR = { left: 30.4, top: 53.4 };

export function TopSlots({
  canPickUp,
  canUseRot,
  onPickUpFlower,
  onUseRot,
  flowerStock,
  rotCount,
}: Props) {
  const flowerDisabled = !canPickUp;
  const flowerLabel = flowerDisabled
    ? flowerStock <= 0
      ? 'No flower available yet'
      : 'Carrying something else'
    : 'Pick up a flower (or click again to return)';
  const rotDisabled = !canUseRot;
  const rotLabel = rotDisabled
    ? 'No fertilizer'
    : `Use fertilizer (${rotCount} available — click again to return)`;
  return (
    <div className="top-slots" aria-label="Flower and rot">
      <div className="top-slots__frame" aria-hidden />

      <div
        className={`top-slots__art top-slots__art--flower ${
          flowerStock <= 0 ? 'top-slots__art--empty' : ''
        }`}
        style={{
          left: `${FLOWER_HIT.left}%`,
          top: `${FLOWER_HIT.top}%`,
          width: `${FLOWER_HIT.width}%`,
          height: `${FLOWER_HIT.height}%`,
        }}
        aria-hidden
      />
      <div
        className={`top-slots__art top-slots__art--rot ${
          rotCount <= 0 ? 'top-slots__art--empty' : ''
        }`}
        style={{
          left: `${ROT_HIT.left}%`,
          top: `${ROT_HIT.top}%`,
          width: `${ROT_HIT.width}%`,
          height: `${ROT_HIT.height}%`,
        }}
        aria-hidden
      />

      <button
        className={`top-slots__hit top-slots__hit--flower ${
          canPickUp ? 'top-slots__hit--active' : ''
        }`}
        style={{
          left: `${FLOWER_HIT.left}%`,
          top: `${FLOWER_HIT.top}%`,
          width: `${FLOWER_HIT.width}%`,
          height: `${FLOWER_HIT.height}%`,
        }}
        onClick={onPickUpFlower}
        disabled={!canPickUp}
        aria-label={flowerLabel}
      />
      <button
        className={`top-slots__hit top-slots__hit--rot ${
          !rotDisabled ? 'top-slots__hit--active' : ''
        }`}
        style={{
          left: `${ROT_HIT.left}%`,
          top: `${ROT_HIT.top}%`,
          width: `${ROT_HIT.width}%`,
          height: `${ROT_HIT.height}%`,
        }}
        onClick={onUseRot}
        disabled={rotDisabled}
        aria-label={rotLabel}
      />

      {flowerStock > 0 && (
        <span
          className="top-slots__count"
          style={{ left: `${FLOWER_COUNT_ANCHOR.left}%`, top: `${FLOWER_COUNT_ANCHOR.top}%` }}
        >
          {flowerStock}
        </span>
      )}
      {rotCount > 0 && (
        <span
          className="top-slots__count"
          style={{ left: `${ROT_COUNT_ANCHOR.left}%`, top: `${ROT_COUNT_ANCHOR.top}%` }}
        >
          {rotCount}
        </span>
      )}
    </div>
  );
}
