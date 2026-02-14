import { RegionManager } from './regionManager.js';
import { PointSystem } from './pointSystem.js';
import { Canvas } from './canvas.js';
import { EventManager } from './eventManager.js';
import { ColorDef } from './constants.js';
import { MouseKey, PointType } from './types.js';

const regMan = new RegionManager(ColorDef.aqua);
const pSys = new PointSystem(
  {
    [PointType.regionPoint]: {
      radius: 8,
    },
  },
  { [PointType.regionPoint]: regMan },
);

const canv = new Canvas(
  <HTMLCanvasElement>document.getElementById('map'),
  pSys,
  regMan,
  'images/map.png',
);

new EventManager(canv, {
  createPoint: {
    key: MouseKey.left,
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
