import { Communicator } from './communicator.js';
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
  PointStruct,
  RegionStruct,
} from './types.js';

// Config
const regionEdgeWidth: number = 4;

const pointConfig: { [key in PointType]: PointSpecification } = {
  [PointType.regionPoint]: {
    keyCombo: {
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    },
    radius: 8,
    fields: {},
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
const comm: Communicator = new Communicator('/');

type retType = {
  points: { [key: string]: PointStruct };
  regions: { [key: string]: RegionStruct };
};
fetch('/data')
  .then(async (response: Response) => {
    const data: retType = (await response.json()) as retType;
    const pSys = new PointSystem(
      pointConfig,
      comm,
      data.points as { [key: string]: PointStruct },
    );
    const regMan = new RegionManager(
      pSys,
      ColorDef.aqua,
      regionEdgeWidth,
      {},
      comm,
      data.regions as { [key: string]: RegionStruct },
    );
    pSys.setWatchers({ [PointType.regionPoint]: regMan });
    const canv = new Canvas(
      <HTMLCanvasElement>document.getElementById('map'),
      pSys,
      regMan,
      'images/map.png',
    );
    comm.setCanvas(canv);
    new EventManager(canv, mouseInputs, pointConfig);
  })
  .catch((e) => console.error(e));
