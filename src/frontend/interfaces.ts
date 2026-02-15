import { Position } from './types.js';

interface PointSystemWatcher {
  onPointCreate(iden: string, pos: Position): void;
  onPointRemove(iden: string): void;
}

export type { PointSystemWatcher };
