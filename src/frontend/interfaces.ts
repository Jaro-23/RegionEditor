import { Point } from './point.js';

interface PointSystemWatcher {
  onPointCreate(iden: string, point: Point): void;
  onPointRemove(iden: string): void;
}

export type { PointSystemWatcher };
