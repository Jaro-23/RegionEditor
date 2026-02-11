import { Canvas } from './canvas.js';
import { PointSystem } from './pointSystem.js';
import { MouseKeyBindings } from './config.js';
import { Position, MouseKeySpecification } from './types.js';

class EventManager {
  constructor(private canvas: Canvas) {
    // Handle canvas point system events
    const ps: PointSystem = this.canvas.getPointSystem();
    this.canvas.addEvent(
      'mousedown',
      this.mouseWrapper(MouseKeyBindings.createPoint, (event: MouseEvent) => {
        const pos: Position = this.canvas.getMousePos(event);
        ps.createPoint(pos);
      }),
    );
    this.canvas.addEvent(
      'mousedown',
      this.mouseWrapper(MouseKeyBindings.removePoint, (event: MouseEvent) => {
        const pos: Position = this.canvas.getMousePos(event);
        ps.createPoint(pos);
      }),
    );
    this.canvas.addEvent('mousemove', (event: MouseEvent) => {
      const pos: Position = this.canvas.getMousePos(event);
      ps.draggingLogic(pos);
    });
  }

  private mouseWrapper(
    mouseKey: MouseKeySpecification,
    callback: (event: MouseEvent) => void,
  ): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
      if (event.which != (mouseKey.key as number)) return;
      if (mouseKey.ctrlKey != event.ctrlKey) return;
      callback(event);
    };
  }
}

const pSys = new PointSystem();
const elem = document.getElementById('map');
const canv = new Canvas(<HTMLCanvasElement>elem, pSys);
const man = new EventManager(canv);
