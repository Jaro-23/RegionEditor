import { PointSystem } from './pointSystem.js';

interface PointSystemWatcher {
  onPointCreate(iden: string, pointSystem: PointSystem): void;
  onPointRemove(iden: string): void;
}

export type { PointSystemWatcher };
