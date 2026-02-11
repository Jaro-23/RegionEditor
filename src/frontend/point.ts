import { Position } from './types.js';

export class Point {
  constructor(
    private pos: Position = { x: 0, y: 0 },
    private radius: number = 0,
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
}
