import { Point } from './point.js';
import { PointSystem } from './pointSystem.js';
import { Position, Color } from './types.js';

export class Region {
  private pointsIden: string[] = [];

  constructor(
    private color: Color,
    private pointSystem: PointSystem,
    private edgeWidth: number,
  ) {}

  public getColor() {
    return this.color;
  }

  public setColor(color: Color): void {
    this.color = color;
  }

  public getNumPoints(): number {
    return this.pointsIden.length;
  }

  public addPoint(
    pointIden: string,
    place: number | undefined = undefined,
  ): void {
    if (place) this.pointsIden.splice(place, 0, pointIden);
    else this.pointsIden.push(pointIden);
  }

  public foreachPoint(func: (pointIden: string, color: Color) => void): void {
    this.pointsIden.forEach((pointIden) => func(pointIden, this.color));
  }

  public removePoint(pointIden: string): void {
    let index = this.pointsIden.indexOf(pointIden);
    while (index >= 0) {
      this.pointsIden.splice(index, 1);
      index = this.pointsIden.indexOf(pointIden);
    }
  }

  public reset() {
    this.pointsIden = [];
  }

  public onEdge(pos: Position): number {
    for (let idenIndex = 0; idenIndex < this.pointsIden.length; idenIndex++) {
      const p1: Point | undefined = this.pointSystem.getPoint(
        this.pointsIden[idenIndex],
      );
      if (!p1) continue;
      const pos1: Position = p1.getPosition();
      const p2: Point | undefined = this.pointSystem.getPoint(
        this.pointsIden[(idenIndex + 1) % this.pointsIden.length],
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
