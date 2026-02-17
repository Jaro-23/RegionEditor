import {
  Position,
  PointType,
  FieldValType,
  PointSpecification,
  PointStruct,
} from './types.js';

export class Point {
  private specification: PointSpecification;

  constructor(
    private type: PointType,
    private pos: Position = { x: 0, y: 0 },
    specification: PointSpecification,
  ) {
    this.specification = { ...specification };
  }

  public isClicked(pos: Position): boolean {
    const dx = pos.x - this.pos.x;
    const dy = pos.y - this.pos.y;
    const dist = dx * dx + dy * dy;
    return dist < this.specification.radius * this.specification.radius;
  }

  public setPosition(pos: Position): void {
    this.pos = pos;
  }

  public getPosition(): Position {
    return this.pos;
  }

  public getSpecification(): PointSpecification {
    return this.specification;
  }

  public getType(): PointType {
    return this.type;
  }

  public getField(field: string): FieldValType | undefined {
    if (field in this.specification.fields)
      return this.specification.fields[field].value;
    return undefined;
  }

  public getAsStruct(): PointStruct {
    return {
      type: this.type as number,
      pos: { ...this.pos },
      specification: { ...this.specification },
    };
  }
}
