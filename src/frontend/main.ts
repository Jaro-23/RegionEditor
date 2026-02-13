import { PointSystem } from './pointSystem.js';
import { Canvas } from './canvas.js';
import { EventManager } from './eventManager.js';

import { MouseKey, PointType } from './types.js';

const pSys = new PointSystem({
  [PointType.regionPoint]: {
    radius: 8,
  },
});

const canv = new Canvas(
  <HTMLCanvasElement>document.getElementById('map'),
  pSys,
  'images/map.png',
);

new EventManager(canv, {
  createPoint: {
    key: MouseKey.middle,
    ctrlKey: false,
  },
  movePoint: {
    key: MouseKey.right,
    ctrlKey: false,
  },
  removePoint: {
    key: MouseKey.right,
    ctrlKey: true,
  },
});
