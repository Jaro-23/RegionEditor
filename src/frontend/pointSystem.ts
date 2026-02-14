import { Point } from './point.js';
import { Position, PointSpecification, PointType } from './types.js';
import { PointSystemWatcher } from './interfaces.js';

export class PointSystem {
  private points: { [key: string]: Point };
  private draggingPoint: Point | undefined = undefined;
  private forceDragging: boolean = false;

  constructor(
    private pointConfig: { [key in PointType]: PointSpecification },
    private watchers: { [key in PointType]?: PointSystemWatcher },
  ) {
    this.points = {};
  }

  public foreach(func: (point: Point) => void): void {
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

    const iden = this.formatIden(localIden);
    this.points[iden] = new Point(pos, this.pointConfig[type].radius);

    const watcher = this.watchers[type];
    if (watcher) watcher.onPointCreate(iden, this);
  }

  public getPoint(iden: string): Point | undefined {
    if (iden in this.points) return this.points[iden];
    return undefined;
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
  public startForceDrag(iden: string, force: boolean = false) {
    if (iden in this.points) {
      this.draggingPoint = this.points[iden];
      this.forceDragging = force;
    }
  }

  public stopForceDrag() {
    this.draggingPoint = undefined;
    this.forceDragging = false;
  }

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
    if (!this.forceDragging) this.draggingPoint = undefined;
  }

  // Helpers
  private formatIden(localIden: number) {
    return `${localIden}`;
  }
}
