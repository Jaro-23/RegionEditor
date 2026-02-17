import {
  Position,
  PointType,
  FieldValType,
  CustomFields,
  PointStruct,
} from './types.js';

export class Point {
  constructor(
    private type: PointType,
    private pos: Position = { x: 0, y: 0 },
    private radius: number = 0,
    private fields: CustomFields = {},
  ) {}

  public isClicked(pos: Position): boolean {
    const dx = pos.x - this.pos.x;
    const dy = pos.y - this.pos.y;
    const dist = dx * dx + dy * dy;
    return dist < this.radius * this.radius;
  }

  public setPosition(pos: Position): void {
    this.pos = pos;
  }

  public getPosition(): Position {
    return this.pos;
  }

  public getRadius(): number {
    return this.radius;
  }

  public getType(): PointType {
    return this.type;
  }

  public getField(field: string): FieldValType | undefined {
    if (field in this.fields) return this.fields[field].value;
    return undefined;
  }

  public getAsStruct(): PointStruct {
    return {
      type: this.type as number,
      pos: { ...this.pos },
      radius: this.radius,
      fields: { ...this.fields },
    };
  }
}
