import { Point } from './point.js';
import { PointSystem } from './pointSystem.js';
import { Position } from './types.js';

export type CallbackType = () => any;

export class Canvas {
  private context: CanvasRenderingContext2D;

  constructor(
    private canvas: HTMLCanvasElement,
    private pointSystem: PointSystem,
  ) {
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public update() {
    // TODO: Implement the drawing
    this.pointSystem.mapPoints((point: Point) => this.drawPoint(point));
  }

  public addEvent(
    event: keyof HTMLElementEventMap,
    callback: (event: MouseEvent) => any,
  ) {
    this.canvas.addEventListener(event, callback as EventListener);
  }

  public getPointSystem() {
    return this.pointSystem;
  }

  public getMousePos(event: MouseEvent): Position {
    const rect = this.canvas.getBoundingClientRect();
    const dx = event.clientX - rect.left;
    const dy = event.clientY - rect.top;

    return {
      x: dx / rect.width,
      y: dy / rect.height,
    };
  }

  private drawPoint(point: Point) {
    const pos: Position = this.relPosToAbsPos(point.getPosition());
    this.context.beginPath();
    this.context.arc(pos.x, pos.y, point.getRadius(), 0, 2 * Math.PI);
    this.context.fill();
  }

  private relPosToAbsPos(pos: Position) {
    return {
      x: pos.x * this.canvas.width,
      y: pos.y * this.canvas.height,
    };
  }
}
