// In-memory store for the current flower + an append-only log. Module-level
// singleton; no persistence — state resets on every reload.

import type { FlowerRecord, LogEntry } from '../types';

type Listener<T> = (value: T) => void;

let currentFlower: FlowerRecord | null = null;
const flowerListeners = new Set<Listener<FlowerRecord | null>>();

// Memorial epoch — used to compute flower stock replenishment over time.
const memorialStartedAt = Date.now();

const logStore: LogEntry[] = [];
const logListeners = new Set<Listener<LogEntry[]>>();

function emit<T>(listeners: Set<Listener<T>>, value: T) {
  listeners.forEach((l) => l(value));
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const flowerStore = {
  subscribeFlower(cb: Listener<FlowerRecord | null>): () => void {
    flowerListeners.add(cb);
    cb(currentFlower);
    return () => flowerListeners.delete(cb);
  },

  subscribeLog(cb: Listener<LogEntry[]>): () => void {
    logListeners.add(cb);
    cb([...logStore]);
    return () => logListeners.delete(cb);
  },

  getMemorialStartedAt(): number {
    return memorialStartedAt;
  },

  async placeFlower(): Promise<void> {
    if (currentFlower) return;
    currentFlower = { placedAt: Date.now() };
    emit(flowerListeners, currentFlower);

    const entry: LogEntry = {
      id: makeId(),
      type: 'flower_placed',
      timestamp: currentFlower.placedAt,
    };
    logStore.unshift(entry);
    emit(logListeners, [...logStore]);
  },

  async removeFlower(): Promise<void> {
    if (!currentFlower) return;
    currentFlower = null;
    emit(flowerListeners, null);

    const entry: LogEntry = {
      id: makeId(),
      type: 'flower_removed',
      timestamp: Date.now(),
    };
    logStore.unshift(entry);
    emit(logListeners, [...logStore]);
  },

  async fertilize(extraMs: number): Promise<boolean> {
    if (!currentFlower) return false;
    // Cap so effective lifespan never exceeds FLOWER_LIFESPAN_MS. Bonus can
    // be at most how old the flower currently is.
    const age = Date.now() - currentFlower.placedAt;
    if (age <= 0) return false;
    const effective = Math.min(extraMs, age);
    currentFlower = {
      ...currentFlower,
      placedAt: currentFlower.placedAt + effective,
    };
    emit(flowerListeners, currentFlower);

    const entry: LogEntry = {
      id: makeId(),
      type: 'fertilizer_used',
      timestamp: Date.now(),
    };
    logStore.unshift(entry);
    emit(logListeners, [...logStore]);
    return true;
  },
};

