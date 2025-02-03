// shapes/Circle.ts
import { Shape, ShapeConfig } from '../modules/Shape';

export class Circle extends Shape {
  radius: number;

  constructor(config: ShapeConfig & { radius?: number }) {
    super(config);
    this.radius = config.radius || 50;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }
}
