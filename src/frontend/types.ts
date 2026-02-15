// Enums
enum MouseKey {
  left = 1,
  middle = 2,
  right = 3,
}

enum PointType {
  regionPoint = 0,
}

enum CustomFieldType {
  string,
  number,
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
  stopDrawing: MouseKeySpecification;
};

type CustomFields = {
  [key: string]: {
    value: string | number;
    displayName: string;
    type: CustomFieldType;
  };
};
// Other
type Color = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type {
  Position,
  PointSpecification,
  MouseKeyBindings,
  MouseKeySpecification,
  Color,
  CustomFields,
};
export { MouseKey, PointType, CustomFieldType };
