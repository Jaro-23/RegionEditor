import { Point } from './point.js';
import { PointSystem } from './pointSystem.js';
import { Position, Color, CustomFields, RegionStruct } from './types.js';

export class Region {
  private pointIdens: string[] = [];

  constructor(
    private color: Color,
    private pointSystem: PointSystem,
    private edgeWidth: number,
    private fields: CustomFields,
  ) {}

  public getColor() {
    return this.color;
  }

  public setColor(color: Color): void {
    this.color = color;
  }

  public getNumPoints(): number {
    return this.pointIdens.length;
  }

  public getWidth(): number {
    return this.edgeWidth;
  }

  public addPoint(
    pointIden: string,
    place: number | undefined = undefined,
  ): void {
    if (place) this.pointIdens.splice(place, 0, pointIden);
    else this.pointIdens.push(pointIden);
  }

  public foreachPoint(func: (pointIden: string, color: Color) => void): void {
    this.pointIdens.forEach((pointIden) => {
      func(pointIden, this.color);
    });
  }

  public removePoint(pointIden: string): void {
    let index = this.pointIdens.indexOf(pointIden);
    while (index >= 0) {
      this.pointIdens.splice(index, 1);
      index = this.pointIdens.indexOf(pointIden);
    }
  }

  public reset() {
    this.pointIdens = [];
  }

  public getAsStruct(): RegionStruct {
    return {
      points: Object.assign([], this.pointIdens),
      color: { ...this.color },
      edgeWidth: this.edgeWidth,
      fields: { ...this.fields },
    };
  }

  public clickedOnEdge(pos: Position): number {
    for (let idenIndex = 0; idenIndex < this.pointIdens.length; idenIndex++) {
      const p1: Point | undefined = this.pointSystem.getPoint(
        this.pointIdens[idenIndex],
      );
      if (!p1) continue;
      const pos1: Position = p1.getPosition();
      const p2: Point | undefined = this.pointSystem.getPoint(
        this.pointIdens[(idenIndex + 1) % this.pointIdens.length],
      );
      if (!p2) continue;
      const pos2: Position = p2.getPosition();

      const dx = pos2.x - pos1.x;
      const dy = pos2.y - pos1.y;

      const t =
        ((pos.x - pos1.x) * dx + (pos.y - pos1.y) * dy) / (dx * dx + dy * dy);
      const tClamped = Math.max(0, Math.min(1, t));

      const closestX = pos1.x + tClamped * dx;
      const closestY = pos1.y + tClamped * dy;
      const dist = Math.sqrt((pos.x - closestX) ** 2 + (pos.y - closestY) ** 2);

      if (dist < this.edgeWidth) {
        return idenIndex;
      }
    }
    return -1;
  }
}
