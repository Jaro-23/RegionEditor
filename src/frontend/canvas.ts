import { PointSystem } from './pointSystem.js';
import { Position } from './types.js';

export type CallbackType = () => any;

export class Canvas {
  constructor(
    private canvas: HTMLCanvasElement,
    private pointSystem: PointSystem,
  ) {}

  public update() {
    // TODO: Implement the drawing
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
}
