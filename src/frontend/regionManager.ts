import { PointSystemWatcher } from './interfaces.js';
import { Region } from './region.js';
import { Communicator } from './communicator.js';
import { PointSystem } from './pointSystem.js';
import {
  Position,
  Color,
  PointType,
  CustomFields,
  RegionStruct,
} from './types.js';
import { ColorList } from './constants.js';

export class RegionManager implements PointSystemWatcher {
  private regions: { [key: string]: Region } = {};
  private drawingRegion: Region;
  private ghostPointIden: string = '';
  private colorIndex: number = 0;

  constructor(
    private pointSystem: PointSystem,
    drawColor: Color,
    private edgeWidth: number,
    private regionFields: CustomFields,
    private communicator: Communicator,
    data: { [key: string]: RegionStruct } = {},
  ) {
    this.drawingRegion = new Region(
      drawColor,
      this.pointSystem,
      this.edgeWidth,
      {},
    );
    this.setupEvents();
    for (const name in data) {
      const regionDef: RegionStruct = data[name];
      this.regions[name] = new Region(
        regionDef.color,
        this.pointSystem,
        regionDef.edgeWidth,
        regionDef.fields,
      );
      regionDef.points.forEach((iden) => this.regions[name].addPoint(iden));
    }
  }

  public foreach(func: (region: Region) => void): void {
    func(this.drawingRegion);
    for (const name in this.regions) {
      func(this.regions[name]);
    }
  }

  public onPointCreate(iden: string, pos: Position): void {
    // Try to add edge on the line, only id not currently drawing a new region
    if (!this.isDrawing()) {
      for (const name in this.regions) {
        const region: Region = this.regions[name];
        const index = region.clickedOnEdge(pos);
        if (index >= 0) {
          // +1 because the given index represents the line from index to index+1
          // We want to add the point in between
          region.addPoint(iden, index + 1);
          this.communicator.sendJson('RegionModified', {
            name: name,
            data: region.getAsStruct(),
          });
          return;
        }
      }

      // Not on edge, so start new region
      this.drawingRegion.addPoint(iden);
      this.pointSystem.startForceDrag(iden, true);
      this.ghostPointIden = iden;
      const point = this.pointSystem.getPoint(iden);
      if (!point) return; // Should never be undefined but compiler complians
      this.pointSystem.createPoint(point.getPosition(), PointType.regionPoint);
      return;
    }
    this.drawingRegion.addPoint(iden, -1);
  }

  public onPointRemove(iden: string) {
    this.drawingRegion.removePoint(iden);
    for (const name in this.regions) {
      const region: Region = this.regions[name];
      region.removePoint(iden);
      if (region.getNumPoints() < 3) {
        delete this.regions[name];
        this.communicator.sendJson('RegionDeletion', { name: name });
      }
    }
  }

  public removeGhost() {
    if (this.ghostPointIden == '') return;
    this.pointSystem.removePoint(this.ghostPointIden);
    this.ghostPointIden = '';
  }

  public saveRegion(name: string): boolean {
    if (!this.canSave() || name.length == 0 || name in this.regions)
      return false;
    this.removeGhost();
    this.regions[name] = new Region(
      ColorList[this.colorIndex],
      this.pointSystem,
      this.edgeWidth,
      this.regionFields,
    );
    this.colorIndex = (this.colorIndex + 1) % ColorList.length;
    this.drawingRegion.foreachPoint((pointIden: string) =>
      this.regions[name].addPoint(pointIden),
    );
    this.drawingRegion.reset();
    this.communicator.sendJson('RegionCreation', {
      name: name,
      data: this.regions[name].getAsStruct(),
    });
    return true;
  }

  public canSave(): boolean {
    return (
      this.drawingRegion.getNumPoints() >=
      3 + (this.ghostPointIden != '' ? 1 : 0)
    ); // Should have at least 3 points + ghost point = 4 points
  }

  public isDrawing(): boolean {
    return this.drawingRegion.getNumPoints() != 0;
  }

  public resetDrawing() {
    this.removeGhost();
    const temp: string[] = [];
    this.drawingRegion.foreachPoint((iden: string) => temp.push(iden));
    temp.forEach((iden) => this.pointSystem.removePoint(iden));
    this.drawingRegion.reset();
  }

  private setupEvents() {
    this.communicator.subscribeMessage(
      'RegionCreation',
      (data: { name: string; data: RegionStruct }) => {
        const name: string = data.name;
        if (name in this.regions) return false;
        this.regions[name] = new Region(
          data.data.color,
          this.pointSystem,
          data.data.edgeWidth,
          data.data.fields,
        );
        data.data.points.forEach((iden) => this.regions[name].addPoint(iden));
        return true;
      },
    );

    this.communicator.subscribeMessage(
      'RegionModified',
      (data: { name: string; data: RegionStruct }) => {
        const name: string = data.name;
        if (!(name in this.regions)) return false;
        delete this.regions[name];
        this.regions[name] = new Region(
          data.data.color,
          this.pointSystem,
          data.data.edgeWidth,
          data.data.fields,
        );
        data.data.points.forEach((iden) => this.regions[name].addPoint(iden));
        return true;
      },
    );

    this.communicator.subscribeMessage(
      'RegionDeletion',
      (data: { name: string }) => {
        const name: string = data.name;
        if (!(name in this.regions)) return false;
        delete this.regions[name];
        return true;
      },
    );
  }
}
