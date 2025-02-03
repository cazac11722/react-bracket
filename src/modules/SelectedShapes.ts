import { Shape, ShapeConfig } from "./Shape";

export interface SelectedConfig {
  id: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  dragStart?: { startX: number, startY: number };
  isDragging?: boolean;
  shapeType?: string;
  type: String;
}

export abstract class SelectedShapes extends Shape {

  constructor(config: ShapeConfig) {
    super(config);
  }

}

export abstract class SelectedOffset {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  dragStart: { startX: number, startY: number };
  isDragging: boolean;
  type: String;
  shapeType?: string;

  constructor(config: SelectedConfig) {
    this.id = config.id;
    this.startX = config.startX;
    this.startY = config.startY;
    this.endX = config.endX;
    this.endY = config.endY;
    this.dragStart = config.dragStart || { startX: 0, startY: 0 };
    this.isDragging = config.isDragging || false;
    this.type = config.type;
    this.shapeType = config.shapeType || '';
  }

}
