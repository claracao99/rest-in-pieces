import type { SceneState } from '../types';

type CarryType = 'flower' | 'rot' | null;

interface Props {
  carry: CarryType;
  sceneState: SceneState;
  onTombClick: () => void;
  onFlowerClick: () => void;
  onRotClick: () => void;
  onTombEnter: () => void;
  onTombLeave: () => void;
  onFlowerEnter: () => void;
  onFlowerLeave: () => void;
}

// Path coords are in image space (2880×2046 viewBox matches scene asset).
const TOMB_PATH =
  'M 1050 663 ' +
  'C 1050 453, 1755 453, 1755 663 ' +
  'L 1755 1533 ' +
  'L 1050 1533 Z';

const FLOWER_PATH =
  'M 1170 1728 ' +
  'L 1170 1533 ' +
  'C 1095 1488, 1095 1383, 1170 1338 ' +
  'L 1335 1338 ' +
  'C 1410 1383, 1410 1488, 1335 1533 ' +
  'L 1335 1728 Z';

const ROT_PATH = 'M 1610 1352 L 1814 1688 L 1223 1688 Z';

const VIEWBOX = '0 0 2880 2046';

export function TombHitArea({
  carry,
  sceneState,
  onTombClick,
  onFlowerClick,
  onRotClick,
  onTombEnter,
  onTombLeave,
  onFlowerEnter,
  onFlowerLeave,
}: Props) {
  const tombInteractive =
    sceneState === 'empty' ||
    (sceneState === 'flower' && carry !== 'rot') ||
    sceneState === 'rot';
  const flowerInteractive = sceneState === 'flower' && carry !== 'flower';
  const rotInteractive = !carry && sceneState === 'rot';

  return (
    <svg
      className="tomb-hit"
      viewBox={VIEWBOX}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <path
        className={`tomb-hit__path tomb-hit__path--tomb ${
          tombInteractive ? 'tomb-hit__path--interactive' : ''
        }`}
        d={TOMB_PATH}
        onClick={tombInteractive ? onTombClick : undefined}
        onMouseEnter={tombInteractive && carry === 'flower' ? onTombEnter : undefined}
        onMouseLeave={tombInteractive && carry === 'flower' ? onTombLeave : undefined}
      />
      <path
        className={`tomb-hit__path tomb-hit__path--flower ${
          flowerInteractive ? 'tomb-hit__path--interactive' : ''
        }`}
        d={FLOWER_PATH}
        onClick={flowerInteractive ? onFlowerClick : undefined}
        onMouseEnter={flowerInteractive && carry === 'rot' ? onFlowerEnter : undefined}
        onMouseLeave={flowerInteractive && carry === 'rot' ? onFlowerLeave : undefined}
      />
      <path
        className={`tomb-hit__path tomb-hit__path--rot ${
          rotInteractive ? 'tomb-hit__path--interactive' : ''
        }`}
        d={ROT_PATH}
        onClick={rotInteractive ? onRotClick : undefined}
      />
    </svg>
  );
}
