export type SceneState = 'empty' | 'flower' | 'rot';

export interface FlowerRecord {
  placedAt: number;
}

export type LogEntryType =
  | 'flower_placed'
  | 'flower_removed'
  | 'fertilizer_used';

export interface LogEntry {
  id: string;
  type: LogEntryType;
  timestamp: number;
}

