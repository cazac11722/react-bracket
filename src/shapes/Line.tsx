import { LineShapes } from '../modules/LineShapes';
import { Shape } from '../modules/Shape';
import { StateManager } from '../modules/StateManager';

export interface LineConfig {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  color?: string;
  startType?: string;
  endType?: string;
  lineWidth?: number;
  startShapeId?: string;
  endShapeId?: string;
}

export class Line extends LineShapes {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  startType?: string;
  endType?: string;
  lineWidth: number;
  startShapeId?: string;
  endShapeId?: string;

  constructor(config: LineConfig) {
    super(config);
    this.id = config.id;
    this.start = config.start;
    this.end = config.end;
    this.lineWidth = config.lineWidth || 2;
    this.startType = config.startType || 'left';
    this.endType = config.endType || 'left';
    this.startShapeId = config.startShapeId;
    this.endShapeId = config.endShapeId;
  }

  /**
   * 📌 선의 시작 위치 업데이트
   */
  setStartPosition(x: number, y: number) {
    this.start = { x, y };
  }

  /**
   * 📌 선의 끝 위치 업데이트
   */
  setEndPosition(x: number, y: number) {
    this.end = { x, y };
  }

  /**
   * 📌 박스와 연결된 경우 박스 중심을 기반으로 `start` 및 `end` 자동 조정
   */
  updateLinePosition(stateManager: StateManager) {
    const startShape = this.startShapeId ? stateManager.shapes.find(shape => shape.id === this.startShapeId) : null;
    const endShape = this.endShapeId ? stateManager.shapes.find(shape => shape.id === this.endShapeId) : null;

    if (startShape) {
      this.start = this.getAnchorPosition(startShape, this.startType!);
    }
    if (endShape) {
      this.end = this.getAnchorPosition(endShape, this.endType!);
    }
  }

  /**
   * 📌 박스의 특정 위치(`left`, `top`, `right`, `bottom`)에 정확히 선을 고정
   */
  private getAnchorPosition(shape: Shape, type: string): { x: number; y: number } {
    switch (type) {
      case "left":
        return { x: shape.x, y: shape.y + shape.height / 2 };
      case "right":
        return { x: shape.x + shape.width, y: shape.y + shape.height / 2 };
      case "top":
        return { x: shape.x + shape.width / 2, y: shape.y };
      case "bottom":
        return { x: shape.x + shape.width / 2, y: shape.y + shape.height };
      default:
        return { x: shape.x, y: shape.y }; // 기본값
    }
  }

  /**
   * 📌 선 그리기
   */
  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.strokeStyle = this.color || "black";
    context.lineWidth = this.lineWidth;

    // 📌 출발점 & 도착점
    const { x: startX, y: startY } = this.start;
    const { x: endX, y: endY } = this.end;

    // 📌 X, Y 간 거리 계산
    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);
    const totalDistance = Math.sqrt(dx ** 2 + dy ** 2);

    // 📌 중간 좌표 계산 (박스를 통과하지 않도록 조정)
    let midX = (startX + endX) / 2;
    let midY = (startY + endY) / 2;

    // 📌 좌표를 20px 간격으로 정렬
    midX = Math.round(midX / 20) * 20;
    midY = Math.round(midY / 20) * 20;

    // ✅ 선 그리기 시작
    context.moveTo(startX, startY);

    // 📌 100px 이하 거리일 경우 `lineTo` 두 개만 사용
    // if (totalDistance <= 100) {
    //   if (this.startType === "left" || this.startType === "right") {
    //     context.lineTo(endX, startY);
    //   } else if (this.startType === "top" || this.startType === "bottom") {
    //     context.lineTo(startX, endY);
    //   }
    // } else {
      // ✅ 100px 초과 시 `Elbowed Line` 적용
      if (this.startType === "right") {
        context.lineTo(midX, startY);
        context.lineTo(midX, endY);
      } else if (this.startType === "left") {
        context.lineTo(midX, startY);
        context.lineTo(midX, endY);
      } else if (this.startType === "top") {
        context.lineTo(startX, midY);
        context.lineTo(endX, midY);
      } else if (this.startType === "bottom") {
        context.lineTo(startX, midY);
        context.lineTo(endX, midY);
      }
    // }

    // 📌 최종 도착점 연결
    context.lineTo(endX, endY);
    context.stroke();
  }
}
