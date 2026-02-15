import { loadImage } from './tools.js';
import { Point } from './point.js';
import { PointSystem } from './pointSystem.js';
import { Region } from './region.js';
import { RegionManager } from './regionManager.js';
import { Position, Color } from './types.js';

export class Canvas {
  private context: CanvasRenderingContext2D;
  private background: ImageBitmap | undefined;

  constructor(
    private canvas: HTMLCanvasElement,
    private pointSystem: PointSystem,
    private regionManager: RegionManager,
    private backgroundPath: string,
  ) {
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.loadBackground();
  }

  public update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.background) this.drawBackground();
    else this.loadBackground();

    this.regionManager.foreach((region: Region) =>
      this.drawRegion(region, this.regionManager.getEdgeWidth()),
    );
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

  public getRegionManager() {
    return this.regionManager;
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

  private drawPoint(point: Point, color: Color = { r: 0, g: 0, b: 0 }) {
    const pos: Position = point.getPosition();
    this.context.fillStyle = this.getColorString(color);
    this.context.beginPath();
    this.context.arc(pos.x, pos.y, point.getRadius(), 0, 2 * Math.PI);
    this.context.fill();
  }

  private drawRegion(region: Region, edgeThickness: number) {
    // Draw lines
    const positions: Position[] = [];
    region.foreachPoint((pointIden: string) => {
      const point = this.pointSystem.getPoint(pointIden);
      if (!point) return;
      positions.push(point.getPosition());
    });
    const color: Color = { ...region.getColor() };
    this.drawLoop(positions, color, edgeThickness);
    color.a = 0.3; // TODO: Make this changeable
    this.drawPolygon(positions, color);

    // Draw points
    region.foreachPoint((pointIden: string, color: Color) => {
      const point = this.pointSystem.getPoint(pointIden);
      if (!point) return;
      this.drawPoint(point, color);
    });
  }

  private drawLoop(positions: Position[], color: Color, thickness: number) {
    if (positions.length == 0) return;
    this.context.strokeStyle = this.getColorString(color);
    this.context.lineWidth = thickness;
    this.context.beginPath();
    this.context.moveTo(positions[0].x, positions[0].y);
    positions.forEach((pos) => this.context.lineTo(pos.x, pos.y));
    this.context.lineTo(positions[0].x, positions[0].y);
    this.context.closePath();
    this.context.stroke();
  }

  private drawPolygon(positions: Position[], color: Color) {
    if (positions.length == 0) return;
    this.context.fillStyle = this.getColorString(color);
    this.context.beginPath();
    this.context.moveTo(positions[0].x, positions[0].y);
    positions.forEach((pos) => this.context.lineTo(pos.x, pos.y));
    this.context.lineTo(positions[0].x, positions[0].y);
    this.context.closePath();
    this.context.fill();
  }

  private loadBackground(): void {
    loadImage(this.backgroundPath)
      .then((background: ImageBitmap) => {
        this.background = background;
        this.update();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private getColorString(
    color: Color,
    alpha: number | undefined = undefined,
  ): string {
    if (alpha) {
      return `rgb(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    } else if (color.a) {
      return `rgb(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }
}
