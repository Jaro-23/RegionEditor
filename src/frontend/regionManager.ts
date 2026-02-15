import { PointSystemWatcher } from './interfaces.js';
import { Region } from './region.js';
import { PointSystem } from './pointSystem.js';
import { Color, PointType } from './types.js';
import { ColorList } from './constants.js';

export class RegionManager implements PointSystemWatcher {
  private regions: { [key: string]: Region } = {};
  private drawingRegion: Region;
  private ghostPointIden: string = '';
  private colorIndex: number = 0;

  constructor(drawColor: Color) {
    this.drawingRegion = new Region(drawColor);
  }

  public foreach(func: (region: Region) => void): void {
    func(this.drawingRegion);
    for (const name in this.regions) {
      func(this.regions[name]);
    }
  }

  public onPointCreate(iden: string, pointSystem: PointSystem): void {
    if (this.drawingRegion.getNumPoints() == 0) {
      this.drawingRegion.addPoint(iden);
      pointSystem.startForceDrag(iden, true);
      this.ghostPointIden = iden;
      const point = pointSystem.getPoint(iden);
      if (!point) return; // Should never be undefined but compiler complians
      pointSystem.createPoint(point.getPosition(), PointType.regionPoint);
      return;
    }
    this.drawingRegion.addPoint(iden, -1);
  }

  public onPointRemove(iden: string) {
    this.drawingRegion.removePoint(iden);
    for (const name in this.regions) {
      const region: Region = this.regions[name];
      region.removePoint(iden);
    }
  }

  public removeGhost(pointSystem: PointSystem) {
    if (this.ghostPointIden == '') return;
    pointSystem.removePoint(this.ghostPointIden);
    this.ghostPointIden = '';
  }

  public saveRegion(name: string, pointSystem: PointSystem): boolean {
    if (name.length == 0 || name in this.regions) return false;
    this.removeGhost(pointSystem);
    this.regions[name] = new Region(ColorList[this.colorIndex]);
    this.colorIndex = (this.colorIndex + 1) % ColorList.length;
    this.drawingRegion.foreachPoint((pointIden: string) =>
      this.regions[name].addPoint(pointIden),
    );
    this.drawingRegion.reset();
    return true;
  }

  public resetDrawing(pointSystem: PointSystem) {
    this.removeGhost(pointSystem);
    this.drawingRegion.reset();
  }
}
