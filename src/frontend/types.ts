// Enums
enum MouseKey {
  left = 1,
  middle = 2,
  right = 3,
}

enum PointType {
  zonePoint = 0,
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

export type { Position, PointSpecification, MouseKeySpecification };
export { MouseKey, PointType };
