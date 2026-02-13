// Enums
enum MouseKey {
  left = 1,
  middle = 2,
  right = 3,
}

enum PointType {
  regionPoint = 0,
}

// Structs
type Position = { x: number; y: number };
type MouseKeySpecification = {
  key: MouseKey;
  ctrlKey: boolean;
};
type PointSpecification = {
  radius: number;
};

type MouseKeyBindings = {
  createPoint: MouseKeySpecification;
  movePoint: MouseKeySpecification;
  removePoint: MouseKeySpecification;
};

// Other
type RGB = `rgb(${number},${number},${number})`;
type RGBA = `rgb(${number},${number},${number},${number})`;
type Color = RGB | RGBA;

export type {
  Position,
  PointSpecification,
  MouseKeyBindings,
  MouseKeySpecification,
  Color,
};
export { MouseKey, PointType };
