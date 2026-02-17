import { Communicator } from './communicator.js';
import { Point } from './point.js';
import {
  Position,
  PointSpecification,
  PointType,
  PointStruct,
} from './types.js';
import { PointSystemWatcher } from './interfaces.js';

export class PointSystem {
  private points: { [key: string]: Point };
  private draggingPoint: Point | undefined = undefined;
  private forceDragging: boolean = false;
  private watchers: { [key in PointType]?: PointSystemWatcher } = {};

  constructor(
    private pointConfig: { [key in PointType]: PointSpecification },
    private communicator: Communicator,
  ) {
    this.points = {};
    this.setupEvents();
  }

  public setWatchers(watchers: {
    [key in PointType]?: PointSystemWatcher;
  }): void {
    this.watchers = watchers;
  }

  public foreach(func: (point: Point) => void): void {
    for (const iden in this.points) {
      const point = this.points[iden];
      func(point);
    }
  }

  // Managing logic
  public createPoint(
    pos: Position,
    type: PointType,
    skipWatcher: boolean = false,
  ): string {
    // TODO: Manage unique global id by added client unique iden
    let localIden = 0;
    while (this.formatIden(localIden) in this.points) localIden += 1;

    const iden = this.formatIden(localIden);
    this.points[iden] = new Point(
      type,
      pos,
      this.pointConfig[type].radius,
      this.pointConfig[type].fields,
    );

    const watcher = this.watchers[type];
    if (!skipWatcher && watcher) watcher.onPointCreate(iden, pos);

    this.communicator.sendJson('PointCreation', {
      iden: iden,
      data: this.points[iden].getAsStruct(),
    });

    return iden;
  }

  public getPoint(iden: string): Point | undefined {
    if (iden in this.points) return this.points[iden];
    return undefined;
  }

  public removePoint(iden: string, updateServer: boolean = true) {
    if (!(iden in this.points)) return;
    const type: PointType = this.points[iden].getType();
    delete this.points[iden];

    const watcher = this.watchers[type];
    if (watcher) watcher.onPointRemove(iden);

    if (!updateServer) return;
    this.communicator.sendJson('PointDeletion', {
      iden: iden,
    });
  }

  public removePointByPos(pos: Position): void {
    for (const iden in this.points) {
      if (this.points[iden].isClicked(pos)) {
        this.removePoint(iden);
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
    if (this.forceDragging) return;
    for (const iden in this.points) {
      if (this.points[iden].isClicked(pos)) {
        this.draggingPoint = this.points[iden];
        return;
      }
    }
  }

  public draggingLogic(pos: Position): boolean {
    if (!this.draggingPoint) return false;
    this.draggingPoint.setPosition(pos);
    return true;
  }

  public endDrag(): void {
    if (!this.forceDragging) {
      for (const iden in this.points) {
        if (this.draggingPoint == this.points[iden]) {
          this.communicator.sendJson('PointModified', {
            iden: iden,
            data: this.draggingPoint.getAsStruct(),
          });
          return;
        }
      }
      this.draggingPoint = undefined;
    }
  }

  private setupEvents() {
    this.communicator.subscribeMessage(
      'PointCreation',
      (data: { iden: string; data: PointStruct }) => {
        const iden: string = data.iden;
        if (iden in this.points) return false;
        this.points[iden] = new Point(
          data.data.type as PointType,
          data.data.pos,
          data.data.radius,
          data.data.fields,
        );
        return true;
      },
    );

    this.communicator.subscribeMessage(
      'PointModified',
      (data: { iden: string; data: PointStruct }) => {
        const iden: string = data.iden;
        if (!(iden in this.points)) return false;
        delete this.points[iden];
        this.points[iden] = new Point(
          data.data.type as PointType,
          data.data.pos,
          data.data.radius,
          data.data.fields,
        );
        return true;
      },
    );

    this.communicator.subscribeMessage(
      'PointDeletion',
      (data: { iden: string; data: PointStruct }) => {
        const iden: string = data.iden;
        if (!(iden in this.points)) return false;
        this.removePoint(iden, false);
        return true;
      },
    );
  }

  // Helpers
  private formatIden(localIden: number) {
    return `${localIden}`;
  }
}
