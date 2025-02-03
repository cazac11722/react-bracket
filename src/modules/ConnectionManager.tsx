import { Shape } from './Shape';
import { Line } from '../shapes/Line';

export class ConnectionManager {
  private shapes: Shape[] = [];
  private connections: Line[] = [];

  addShape(shape: Shape) {
    this.shapes.push(shape);
  }

  addConnection(from: Shape, to: Shape) {
    const line = new Line({
      id: `line-${Date.now()}`,
      start: from.getPosition(),
      end: to.getPosition(),
      color: 'black',
      lineWidth: 2,
    });
    this.connections.push(line);
  }

  drawConnections(context: CanvasRenderingContext2D) {
    this.connections.forEach((connection) => connection.draw(context));
  }
}
