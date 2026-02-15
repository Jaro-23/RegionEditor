import { Canvas } from './canvas.js';
import { PointSystem } from './pointSystem.js';
import { RegionManager } from './regionManager.js';
import { PopupElement } from './popup.js';
import {
  Position,
  MouseKeyBindings,
  MouseKeySpecification,
  PointType,
  PopupDefType,
  PopupStruct,
} from './types.js';

export class EventManager {
  constructor(
    private canvas: Canvas,
    private mouseKeyBindings: MouseKeyBindings,
  ) {
    // Disable the context menu
    this.canvas.addEvent('contextmenu', (e) => e.preventDefault());

    this.psEvents();
    this.regionEvents();
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

  private regionEvents() {
    const ps: PointSystem = this.canvas.getPointSystem();
    const rm: RegionManager = this.canvas.getRegionManager();
    this.canvas.addEvent(
      'mousedown',
      this.mouseWrapper(this.mouseKeyBindings.stopDrawing, () => {
        ps.stopForceDrag();
        rm.removeGhost(ps);

        const popup: PopupElement = document.getElementById(
          'global-popup',
        ) as PopupElement;
        if (popup) {
          popup.loadFromStruct(
            'Name the new region',
            [
              {
                fieldName: 'name',
                value: '',
                displayName: 'Name',
                type: PopupDefType.string,
              },
            ],
            (data: PopupStruct) => {
              if (rm.saveRegion(data.name, ps)) popup.hide();
              else
                popup.showError(
                  `Already a region with the name: "${data.name} "`,
                );
            },
          );
        }
        popup.show();

        this.canvas.update();
      }),
    );
  }

  private psEvents() {
    const ps: PointSystem = this.canvas.getPointSystem();
    this.canvas.addEvent(
      'mousedown',
      this.mouseWrapper(
        this.mouseKeyBindings.createPoint,
        (event: MouseEvent) => {
          const pos: Position = this.canvas.getMousePos(event);
          ps.createPoint(pos, PointType.regionPoint);
          this.canvas.update();
        },
      ),
    );
    this.canvas.addEvent(
      'mousedown',
      this.mouseWrapper(
        this.mouseKeyBindings.removePoint,
        (event: MouseEvent) => {
          const pos: Position = this.canvas.getMousePos(event);
          ps.removePointByPos(pos);
          this.canvas.update();
        },
      ),
    );
    this.canvas.addEvent(
      'mousedown',
      this.mouseWrapper(
        this.mouseKeyBindings.movePoint,
        (event: MouseEvent) => {
          const pos: Position = this.canvas.getMousePos(event);
          ps.startDrag(pos);
          this.canvas.update();
        },
      ),
    );
    this.canvas.addEvent('mousemove', (event: MouseEvent) => {
      const pos: Position = this.canvas.getMousePos(event);
      ps.draggingLogic(pos);
      this.canvas.update();
    });
    this.canvas.addEvent(
      'mouseup',
      this.mouseWrapper(this.mouseKeyBindings.movePoint, () => {
        ps.endDrag();
        this.canvas.update();
      }),
    );
  }
}
