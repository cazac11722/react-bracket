import { StateManager } from "./StateManager";

export interface LineConfig {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  color?: string;
  lineWidth?: number;
  type?: string;
  startShapeId?: string;
  endShapeId?: string;
  startType?: string;
  endType?: string;
}

export abstract class LineShapes {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  color: string;
  lineWidth: number;
  startType?: string;
  endType?: string;
  startShapeId?: string;
  endShapeId?: string;

  constructor(config: LineConfig) {
    this.id = config.id;
    this.start = config.start;
    this.end = config.end;
    this.color = config.color || "black";
    this.lineWidth = config.lineWidth || 2;
    this.startType = config.startType || 'left';
    this.endType = config.endType || 'left';
    this.startShapeId = config.startShapeId;
    this.endShapeId = config.endShapeId;
  }

  abstract draw(context: CanvasRenderingContext2D): void;


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
  abstract updateLinePosition(stateManager: StateManager): void;
  


}
