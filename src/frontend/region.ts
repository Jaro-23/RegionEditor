import { Color } from './types.js';

export class Region {
  private pointsIden: string[] = [];

  constructor(private color: Color) {}

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
}
