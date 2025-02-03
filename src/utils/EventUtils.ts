import { StateManager } from "../modules/StateManager";
import { Circle } from "../shapes/Circle";
import { Line } from "../shapes/Line";
import { Rect } from "../shapes/Rect";
import { isLineMidPointMove, isLineMove, isLinePoint, isNearMidpoint, isShapeHover, isShapeMove } from "./ConnectionUtils";
import { dragShapesMove, finalizeSelectionBox, InitArea, SelectArea, SelectAreas } from "./MovementUtils";


export class EventHandler {

  constructor(private stateManager: StateManager) {
  }

  handleMouseDown(event: MouseEvent) {
    event.preventDefault();


    new isNearMidpoint(this.stateManager, event);

    
    if (this.stateManager.selectedShapes.length <= 1) {
      new SelectArea(this.stateManager, event);
    }

    new SelectAreas(this.stateManager, event);

    new isLinePoint(this.stateManager, event);

    

    new InitArea(this.stateManager, event);

  }

  handleMouseMove(event: MouseEvent) {
    if (!this.stateManager.selectedOffset.isDragging && this.stateManager.selectedOffset.type != 'line' && this.stateManager.selectedOffset.type != 'lineMid') {
      new finalizeSelectionBox(this.stateManager, event);
    }

    if (this.stateManager.selectedOffset.isDragging && this.stateManager.selectedOffset.type != 'line') {
      new dragShapesMove(this.stateManager, event);
    }

    if (this.stateManager.selectedOffset.type == 'line') {
      new isLineMove(this.stateManager, event);
    }

    if (this.stateManager.selectedLines.length > 0) {
      new isLineMidPointMove(this.stateManager, event);
    }

    if (this.stateManager.selectedLines.length >= 0) {
      new isShapeMove(this.stateManager, event);
    }

    if (this.stateManager.selectedOffset.type == 'line') {
      new isShapeHover(this.stateManager, event);
    }

  }

  handleMouseUp() {

    // 선택 박스 초기화
    this.stateManager.setSelectedOffset((prev) => ({
      ...prev,
      isDragging: false,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      type: '',
    }));

  }

  handleDrop(event: React.DragEvent<HTMLCanvasElement>) {
    event.preventDefault(); // 기본 드롭 동작 방지
    const canvas = this.stateManager.canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect(); // 캔버스 경계 좌표 가져오기
    const rawX = event.clientX - rect.left; // 드롭된 X 좌표
    const rawY = event.clientY - rect.top; // 드롭된 Y 좌표
    const spacing = 20; // 그리드 간격

    // 좌표 스냅 처리
    const snappedX = Math.round(rawX / spacing) * spacing + 2;
    const snappedY = Math.round(rawY / spacing) * spacing + 2;

    // 드래그된 도형 타입 가져오기
    const type = event.dataTransfer?.getData("shapeType");

    // 새로운 도형 생성 및 추가
    const newShape =
      type === "circle"
        ? new Circle({ id: Date.now().toString(), x: snappedX, y: snappedY, color: "white", width: 200, height: 98 })
        : new Rect({ id: Date.now().toString(), x: snappedX, y: snappedY, color: "white", width: 230, height: 98 });

    this.stateManager.updateShapes([...this.stateManager.shapes, newShape])
  }

}
