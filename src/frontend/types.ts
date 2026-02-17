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
  fields: CustomFields;
};

type MouseKeyBindings = {
  createPoint: MouseKeySpecification;
  movePoint: MouseKeySpecification;
  removePoint: MouseKeySpecification;
  stopDrawing: MouseKeySpecification;
};

type FieldValType = string | number;
type CustomFields = {
  [key: string]: {
    value: FieldValType;
    displayName: string;
    type: CustomFieldType;
  };
};

type PointStruct = {
  type: number;
  pos: Position;
  radius: number;
  fields: CustomFields;
};

type RegionStruct = {
  points: string[];
  color: Color;
  edgeWidth: number;
  fields: CustomFields;
};

type PointJson = {
  iden: string;
  data?: PointStruct;
};

type RegionJson = {
  name: string;
  data?: RegionStruct;
};
type SendJsonType = PointJson | RegionJson;

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
  FieldValType,
  CustomFields,
  PointStruct,
  RegionStruct,
  PointJson,
  RegionJson,
  SendJsonType,
};
export { MouseKey, PointType, CustomFieldType };
