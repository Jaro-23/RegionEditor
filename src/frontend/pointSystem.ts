import { Point } from './point.js';
import { Position, PointSpecification, PointType } from './types.js';

export class PointSystem {
  private points: { [key: string]: Point };
  private draggingPoint: Point | undefined = undefined;

  constructor(private pointConfig: { [key in PointType]: PointSpecification }) {
    this.points = {};
  }

  public mapPoints(func: (point: Point) => void): void {
    for (const iden in this.points) {
      const point = this.points[iden];
      func(point);
    }
  }

  // Managing logic
  public createPoint(pos: Position, type: PointType) {
    // TODO: Manage unique global id by added client unique iden
    let localIden = 0;
    while (this.formatIden(localIden) in this.points) localIden += 1;

    this.points[this.formatIden(localIden)] = new Point(
      pos,
      this.pointConfig[type].radius,
    );
  }

  public removePoint(iden: string) {
    if (iden in this.points) delete this.points[iden];
  }

  public removePointByPos(pos: Position): void {
    for (const iden in this.points) {
      if (this.points[iden].isClicked(pos)) {
        this.draggingPoint = this.points[iden];
        return;
      }
    }
  }

  // Dragging logic
  public startDrag(pos: Position): void {
    for (const iden in this.points) {
      if (this.points[iden].isClicked(pos)) {
        this.draggingPoint = this.points[iden];
        return;
      }
    }
  }

  public draggingLogic(pos: Position): void {
    if (!this.draggingPoint) return;
    this.draggingPoint.setPosition(pos);
  }

  public endDrag(): void {
    this.draggingPoint = undefined;
  }

  // Helpers
  private formatIden(localIden: number) {
    return `${localIden}`;
  }
}
