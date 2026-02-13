import { loadImage } from './tools.js';
import { Point } from './point.js';
import { PointSystem } from './pointSystem.js';
import { Position, Color } from './types.js';

export class Canvas {
  private context: CanvasRenderingContext2D;
  private background: ImageBitmap | undefined;

  constructor(
    private canvas: HTMLCanvasElement,
    private pointSystem: PointSystem,
    private backgroundPath: string,
  ) {
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.loadBackground();
  }

  public update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.background) this.drawBackground();
    else this.loadBackground();

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
      x: dx * (this.canvas.width / rect.width),
      y: dy * (this.canvas.height / rect.height),
    };
  }

  private drawBackground() {
    if (!this.background) return;
    if (this.background.width < this.background.height) {
      const ratio = this.canvas.width / this.background.width;
      const newHeight = this.background.height * ratio;
      const offset = this.canvas.height - newHeight;

      this.context.drawImage(
        this.background,
        0,
        offset / 2,
        this.canvas.width,
        newHeight,
      );
    } else {
      const ratio = this.canvas.height / this.background.height;
      const newWidth = this.background.width * ratio;
      const offset = this.canvas.width - newWidth;

      this.context.drawImage(
        this.background,
        offset / 2,
        0,
        newWidth,
        this.canvas.height,
      );
    }
  }

  private drawPoint(point: Point, color: Color = `rgb(0,0,0)`) {
    const pos: Position = point.getPosition();
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(pos.x, pos.y, point.getRadius(), 0, 2 * Math.PI);
    this.context.fill();
  }

  private loadBackground(): void {
    loadImage(this.backgroundPath)
      .then((background: ImageBitmap) => {
        this.background = background;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
