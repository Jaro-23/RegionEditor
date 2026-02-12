import {
  PointSpecification,
  MouseKeySpecification,
  MouseKey,
  PointType,
} from './types.js';

// Input Config
export const MouseKeyBindings: {
  [key: string]: MouseKeySpecification;
} = {
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
};

// Point Config
const PointConfig: { [key in PointType]: PointSpecification } = {
  [PointType.regionPoint]: {
    radius: 8,
  },
};

export { PointType, PointConfig };
