import { RegionManager } from './regionManager.js';
import { PointSystem } from './pointSystem.js';
import { Canvas } from './canvas.js';
import { EventManager } from './eventManager.js';
import { ColorDef } from './constants.js';
import {
  MouseKey,
  PointType,
  PointSpecification,
  MouseKeyBindings,
} from './types.js';

// Config
const regionEdgeWidth: number = 4;

const pointConfig: { [key in PointType]: PointSpecification } = {
  [PointType.regionPoint]: {
    radius: 8,
  },
};

const mouseInputs: MouseKeyBindings = {
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
  stopDrawing: {
    key: MouseKey.right,
    ctrlKey: false,
  },
};

// Setup
const pSys = new PointSystem(pointConfig);
const regMan = new RegionManager(pSys, ColorDef.aqua, regionEdgeWidth);

pSys.setWatchers({ [PointType.regionPoint]: regMan });
const canv = new Canvas(
  <HTMLCanvasElement>document.getElementById('map'),
  pSys,
  regMan,
  'images/map.png',
);
new EventManager(canv, mouseInputs);
