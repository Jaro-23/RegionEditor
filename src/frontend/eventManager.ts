import { Canvas } from './canvas.js';
import { PointSystem } from './pointSystem.js';
import { MouseKeyBindings } from './config.js';
import { Position, MouseKeySpecification, PointType } from './types.js';

class EventManager {
  constructor(private canvas: Canvas) {
    this.psEvents();
  }

  private mouseWrapper(
    mouseKey: MouseKeySpecification,
    callback: (event: MouseEvent) => any,
  ): (event: MouseEvent) => any {
    return (event: MouseEvent) => {
      if (event.which != (mouseKey.key as number)) return;
      if (mouseKey.ctrlKey != event.ctrlKey) return;
      callback(event);
    };
  }

  private psEvents() {
    const ps: PointSystem = this.canvas.getPointSystem();
    this.canvas.addEvent(
      'mousedown',
      this.mouseWrapper(MouseKeyBindings.createPoint, (event: MouseEvent) => {
        const pos: Position = this.canvas.getMousePos(event);
        ps.createPoint(pos, PointType.regionPoint);
        this.canvas.update();
      }),
    );
    this.canvas.addEvent(
      'mousedown',
      this.mouseWrapper(MouseKeyBindings.removePoint, (event: MouseEvent) => {
        const pos: Position = this.canvas.getMousePos(event);
        ps.removePointByPos(pos);
        this.canvas.update();
      }),
    );
    this.canvas.addEvent(
      'mousedown',
      this.mouseWrapper(MouseKeyBindings.movePoint, (event: MouseEvent) => {
        const pos: Position = this.canvas.getMousePos(event);
        ps.startDrag(pos);
        this.canvas.update();
      }),
    );
    this.canvas.addEvent('mousemove', (event: MouseEvent) => {
      const pos: Position = this.canvas.getMousePos(event);
      ps.draggingLogic(pos);
      this.canvas.update();
    });
    this.canvas.addEvent(
      'mouseup',
      this.mouseWrapper(MouseKeyBindings.movePoint, (event: MouseEvent) => {
        ps.endDrag();
        this.canvas.update();
      }),
    );
  }
}

const pSys = new PointSystem();
const elem = document.getElementById('map');
const canv = new Canvas(<HTMLCanvasElement>elem, pSys);
const man = new EventManager(canv);
