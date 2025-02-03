
import { StateManager } from "../modules/StateManager";

// 마우스 다운 & 초기화
export class InitArea {
  constructor(private stateManager: StateManager, private event: MouseEvent) {
    this.init();
  }
  init() {
    const rect = this.stateManager.canvasRef.current?.getBoundingClientRect(); // 캔버스 경계 좌표 가져오기
    if (!rect) return;

    const startX = this.event.clientX - rect.left; // 마우스 클릭 X 좌표
    const startY = this.event.clientY - rect.top; // 마우스 클릭 Y 좌표

    this.stateManager.setSelectedOffset((prev) => ({
      ...prev,
      startX: startX,
      startY: startY,
      endX: startX,
      endY: startY,
    }));
  }
}

// 마우스 다운 & 클릭 박스 선택
export class SelectArea {

  constructor(private stateManager: StateManager, private event: MouseEvent) {
    this.init();
  }

  init() {
    const rect = this.stateManager.canvasRef.current?.getBoundingClientRect(); // 캔버스 경계 좌표 가져오기
    if (!rect) return;


    const startX = this.event.clientX - rect.left; // 마우스 클릭 X 좌표
    const startY = this.event.clientY - rect.top; // 마우스 클릭 Y 좌표

    const selecteds = this.selecteds(startX, startY);

    if (selecteds.length > 0) {
      this.stateManager.setSelectedShapes(selecteds);
      this.stateManager.selectedShapes = (selecteds);
    }else {
      this.stateManager.setSelectedShapes([]);
      this.stateManager.selectedShapes = [];
    }
  }

  selecteds(startX: number, startY: number) {
    return this.stateManager.shapes.filter((shape) => {
      const left = shape.x;
      const right = shape.x + shape.width;
      const top = shape.y;
      const bottom = shape.y + shape.height;

      // AABB 충돌 조건
      const isOverlap =
        right > Math.min(startX, startX) &&
        left < Math.max(startX, startX) &&
        bottom > Math.min(startY, startY) &&
        top < Math.max(startY, startY);

      return isOverlap;
    });
  }
}

// 마우스 다운 & 클릭 박스 선택
export class SelectAreas {

  constructor(private stateManager: StateManager, private event: MouseEvent) {
    this.init();
  }

  init() {
    const rect = this.stateManager.canvasRef.current?.getBoundingClientRect(); // 캔버스 경계 좌표 가져오기
    if (!rect) return;


    const startX = this.event.clientX - rect.left; // 마우스 클릭 X 좌표
    const startY = this.event.clientY - rect.top; // 마우스 클릭 Y 좌표

    if (
      this.stateManager.selectedFilter().minX <= startX &&
      this.stateManager.selectedFilter().maxX >= startX &&
      this.stateManager.selectedFilter().minY <= startY &&
      this.stateManager.selectedFilter().maxY >= startY
    ) {
      this.stateManager.setSelectedOffset((prev) => ({ ...prev, dragStart: { startX: startX, startY: startY }, isDragging: true, id: this.stateManager.selectedFilter().id }));
      this.stateManager.setSelectedShapes((prevShapes) => prevShapes.map((shape) => {
        if (
          this.stateManager.selectedFilter().minX <= startX &&
          this.stateManager.selectedFilter().maxX >= startX &&
          this.stateManager.selectedFilter().minY <= startY &&
          this.stateManager.selectedFilter().maxY >= startY
        ) {
          let x = shape.x - startX;
          let y = shape.y - startY;
          return shape.setOffsetPosition(x, y);
        }
        return shape;
      }));
    }else {
      this.stateManager.setSelectedShapes([]);
      this.stateManager.selectedShapes = [];
    }
  }
}

// 선택 박스 구현
export class finalizeSelectionBox {
  constructor(private stateManager: StateManager, private event: MouseEvent) {
    this.init();
  }

  init() {
    const rect = this.stateManager.canvasRef.current?.getBoundingClientRect(); // 캔버스 경계 좌표 가져오기
    if (!rect) return;
    if (!(this.stateManager.selectedOffset.startX)) return;

    const endX = this.event.clientX - rect.left;
    const endY = this.event.clientY - rect.top;

    this.stateManager.setSelectedOffset((prev) => ({ ...prev, endX, endY }));

    // 선택 박스 내 도형 필터링
    const { startX, startY } = this.stateManager.selectedOffset || {
      startX: endX,
      startY: endY,
    };

    const selecteds = this.stateManager.shapes.filter((shape) => {
      const left = shape.x;
      const right = shape.x + shape.width;
      const top = shape.y;
      const bottom = shape.y + shape.height;

      // AABB 충돌 조건
      const isOverlap =
        right > Math.min(startX, endX) &&
        left < Math.max(startX, endX) &&
        bottom > Math.min(startY, endY) &&
        top < Math.max(startY, endY);

      return isOverlap;
    });

    this.stateManager.setSelectedShapes(selecteds);
  }
}

// 박스 이동
export class dragShapesMove {
  constructor(private stateManager: StateManager, private event: MouseEvent) {
    this.init();
  }
  init() {
    const rect = this.stateManager.canvasRef.current?.getBoundingClientRect(); // 캔버스 경계 좌표 가져오기
    if (!rect) return;

    const currentX = this.event.clientX - rect.left;
    const currentY = this.event.clientY - rect.top;

    const dx = currentX - (this.stateManager.selectedOffset.dragStart.startX || 0);
    const dy = currentY - (this.stateManager.selectedOffset.dragStart.startY || 0);

    // 도형 이동: 이동 후 정렬된 좌표 적용
    this.stateManager.setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        if (this.stateManager.selectedShapes.includes(shape)) {

          // 정렬된 좌표로 도형 이동
          const snappedX = (Math.round(((currentX + dx) + (shape.offsetX || 0)) / 20) * 20) + 2; // 스냅 좌표
          const snappedY = (Math.round(((currentY + dy) + (shape.offsetY || 0)) / 20) * 20) + 2;

          return shape.setPosition(snappedX, snappedY);
        }
        return shape;
      })
    );

    // 드래그 시작 좌표는 항상 마우스의 실제 좌표로 유지
    this.stateManager.setSelectedOffset((prev) => ({ ...prev, dragStart: { startX: currentX, startY: currentY } }));
  }
}
