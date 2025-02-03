export interface ShapeConfig {
  id: string;
  type?: string;
  name?: string;
  x: number;
  y: number;
  color?: string;
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
}

export abstract class Shape { 

  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;

  constructor(config: ShapeConfig) {
    this.id = config.id;
    this.type = config.type || 'white';
    this.name = config.name || '박스';
    this.x = config.x;
    this.y = config.y;
    this.color = config.color || 'black';
    this.width = config.width;
    this.height = config.height;
    this.offsetX = config.offsetX;
    this.offsetY = config.offsetY;
  }

  // Abstract method for drawing, must be implemented by child classes
  abstract draw(context: CanvasRenderingContext2D): void;

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;

    return this;
  }

  setOffsetPosition(x: number, y: number) {
    this.offsetX = x;
    this.offsetY = y;

    return this;
  }


  setColor(color: string) {
    this.color = color;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

}
