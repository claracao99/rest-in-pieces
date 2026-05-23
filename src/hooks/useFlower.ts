import { useEffect, useState } from 'react';
import { flowerStore } from '../lib/flowerStore';
import { FLOWER_LIFESPAN_MS } from '../lib/constants';
import type { FlowerRecord, SceneState } from '../types';

export function useFlower(): FlowerRecord | null {
  const [flower, setFlower] = useState<FlowerRecord | null>(null);
  useEffect(() => flowerStore.subscribeFlower(setFlower), []);
  return flower;
}

export function sceneStateFor(
  flower: FlowerRecord | null,
  now: number = Date.now(),
): SceneState {
  if (!flower) return 'empty';
  return now - flower.placedAt >= FLOWER_LIFESPAN_MS ? 'rot' : 'flower';
}
