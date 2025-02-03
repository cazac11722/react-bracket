import { StateManager } from "../modules/StateManager";
import { Line } from "../shapes/Line";

export class isNearMidpoint {
    constructor(private stateManager: StateManager, private event: MouseEvent) {
        this.init();
    }

    init() {
        const rect = this.stateManager.canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
       

        const startX = this.event.clientX - rect.left;
        const startY = this.event.clientY - rect.top;

        if (this.stateManager.selectedShapes.length === 1) {
            
            const radius = 10;
            const selectedFilter = this.stateManager.selectedFilter();

            // 📌 선택한 박스의 중앙 좌표 계산
            const centerX = (selectedFilter.minX + selectedFilter.maxX) / 2;
            const centerY = (selectedFilter.minY + selectedFilter.maxY) / 2;

            // 📌 left, right, top, bottom의 정확한 중앙에 선 원(midpoints) 배치
            const midpoints = [
                { x: centerX, y: selectedFilter.minY - 17, type: "top" },      // Top
                { x: centerX, y: selectedFilter.maxY + 17, type: "bottom" },   // Bottom
                { x: selectedFilter.minX - 17, y: centerY, type: "left" },     // Left
                { x: selectedFilter.maxX + 17, y: centerY, type: "right" },    // Right
            ];

            midpoints.forEach((point) => {
                const distance = Math.sqrt(
                    Math.pow(startX - point.x, 2) + Math.pow(startY - point.y, 2)
                );

                if (distance <= radius) {
                    // ✅ 동일한 위치에 선이 있는지 확인
                    const isDuplicate = this.stateManager.lineshapes.some(
                        (line) => line.start.x === point.x && line.start.y === point.y
                    );

                    if (!isDuplicate) {
                        this.stateManager.setSelectedOffset((prev) => ({
                            ...prev,
                            isDragging: true,
                            startX: point.x,
                            startY: point.y,
                            type: "line",
                            shapeType: point.type,
                        }));

                        const newLine = new Line({
                            id: `line-${Date.now()}`,
                            start: { x: point.x, y: point.y },
                            end: { x: point.x, y: point.y }, // 시작점과 동일한 위치
                            color: "gray",
                            lineWidth: 5,
                            startType: point.type, // 방향 설정
                            startShapeId: this.stateManager.selectedOffset.id,
                        });

                        this.stateManager.setLineshapes((prev) => [...prev, newLine]);
                    }
                }
            });
        }
    }
}


export class isLinePoint {
    constructor(private stateManager: StateManager, private event: MouseEvent) {
        this.init();
    }

    init() {
        const rect = this.stateManager.canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const startX = this.event.clientX - rect.left;
        const startY = this.event.clientY - rect.top;

        const selecteds = this.selecteds(startX, startY);

        if (selecteds.length > 0) {
            this.stateManager.setSelectedLines(selecteds);
            this.stateManager.selectedLines = selecteds;
        } else {
            this.stateManager.setSelectedLines([]);
            this.stateManager.selectedLines = [];
        }
    }

    selecteds(startX: number, startY: number) {
        const clickRadius = 7; // 📌 클릭 감지 반경 (조절 가능)

        return this.stateManager.lineshapes.filter((line) => {
            const { start, end, startType } = line;

            // 📌 클릭한 좌표와 선 사이의 거리 계산 함수
            const isPointNearLine = (
                px: number, py: number,  // 📌 마우스 클릭 좌표
                x1: number, y1: number,  // 📌 선분 시작점
                x2: number, y2: number,  // 📌 선분 끝점
                threshold: number = 7    // 📌 허용 범위(조절 가능)
            ): boolean => {

                // ✅ 선이 수직이면 X 좌표가 동일해야 함
                if (x1 === x2) {
                    return Math.abs(px - x1) <= threshold && py >= Math.min(y1, y2) && py <= Math.max(y1, y2);
                }

                // ✅ 선이 수평이면 Y 좌표가 동일해야 함
                if (y1 === y2) {
                    return Math.abs(py - y1) <= threshold && px >= Math.min(x1, x2) && px <= Math.max(x1, x2);
                }

                // ✅ 일반적인 점과 선 사이의 거리 계산 (point-to-line distance formula)
                const A = y2 - y1;
                const B = x1 - x2;
                const C = x2 * y1 - x1 * y2;

                // 📌 점(px, py)과 선(x1, y1) ~ (x2, y2) 사이의 거리
                const distance = Math.abs(A * px + B * py + C) / Math.sqrt(A ** 2 + B ** 2);

                // ✅ 점(px, py)이 선분 범위 내에 있어야 함
                const withinSegment =
                    px >= Math.min(x1, x2) && px <= Math.max(x1, x2) &&
                    py >= Math.min(y1, y2) && py <= Math.max(y1, y2);

                return distance <= threshold && withinSegment;
            };

            // 📌 AABB 바운딩 박스 감지
            const left = Math.min(start.x, end.x);
            const right = Math.max(start.x, end.x);
            const top = Math.min(start.y, end.y);
            const bottom = Math.max(start.y, end.y);

            const isAABBOverlap =
                startX >= left - clickRadius &&
                startX <= right + clickRadius &&
                startY >= top - clickRadius &&
                startY <= bottom + clickRadius;



            // 📌 선이 직각(Elbowed Line)인 경우 중간점 추가 감지
            let midX = (start.x + end.x) / 2;
            let midY = (start.y + end.y) / 2;
            midX = Math.round(midX / 20) * 20;
            midY = Math.round(midY / 20) * 20;


            let elbowCheck = false;

            switch (startType) {
                case "right":
                    elbowCheck = isPointNearLine(startX, startY, start.x, start.y, midX, start.y) ||
                        isPointNearLine(startX, startY, midX, start.y, midX, end.y) ||
                        isPointNearLine(startX, startY, midX, end.y, end.x, end.y);
                    break;
                case "left":
                    elbowCheck = isPointNearLine(startX, startY, start.x, start.y, midX, start.y) ||
                        isPointNearLine(startX, startY, midX, start.y, midX, end.y) ||
                        isPointNearLine(startX, startY, midX, end.y, end.x, end.y);
                    break;
                case "top":
                    elbowCheck = isPointNearLine(startX, startY, start.x, start.y, start.x, midY) ||
                        isPointNearLine(startX, startY, start.x, midY, end.x, midY) ||
                        isPointNearLine(startX, startY, end.x, midY, end.x, end.y);
                    break;
                case "bottom":
                    elbowCheck = isPointNearLine(startX, startY, start.x, start.y, start.x, midY) ||
                        isPointNearLine(startX, startY, start.x, midY, end.x, midY) ||
                        isPointNearLine(startX, startY, end.x, midY, end.x, end.y);
                    break;
            }

            return isAABBOverlap && elbowCheck; // 📌 AABB & 선 거리 조건을 모두 만족하면 선택
        });
    }

}


export class isLineMidPointMove {
    constructor(private stateManager: StateManager, private event: MouseEvent) {
        this.init();
    }

    init() {
        const rect = this.stateManager.canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const startX = this.event.clientX - rect.left;
        const startY = this.event.clientY - rect.top;

    }
}

export class isLineMove {
    constructor(private stateManager: StateManager, private event: MouseEvent) {
        this.drawCurvedElbowedLine();
    }

    private drawCurvedElbowedLine() {
        const ctx = this.stateManager.canvasRef.current?.getContext("2d") || null;
        const rect = this.stateManager.canvasRef.current?.getBoundingClientRect();
        if (!rect || !ctx) return;

        // 마우스 위치를 기준으로 20px 간격으로 정렬된 좌표 계산
        const snappedX = Math.round((this.event.clientX - rect.left) / 20) * 20 - 9;
        const snappedY = Math.round((this.event.clientY - rect.top) / 20) * 20 - 9;

        this.stateManager.setLineshapes((prev) =>
            prev.map((line) => {
                if (line.startShapeId === this.stateManager.selectedOffset.id && this.stateManager.selectedOffset.shapeType == line.startType) {
                    line.setEndPosition(snappedX, snappedY); // 정렬된 좌표 적용
                }
                return line;
            })
        );
    }
}

export class isShapeMove {
    constructor(private stateManager: StateManager, private event: MouseEvent) {
        this.updateElbowedLine();
    }

    private updateElbowedLine() {
        const rect = this.stateManager.canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        // 📌 현재 선택된 박스 ID
        const selectedShapeId = this.stateManager.selectedShapes[0]?.id;
        if (!selectedShapeId) return;

        // 📌 연결된 모든 선을 업데이트
        this.stateManager.setLineshapes((prevLines) =>
            prevLines.map((line) => {
                line.updateLinePosition(this.stateManager);
                return line;
            })
        );
    }
}

export class isShapeHover {
    constructor(private stateManager: StateManager, private event: MouseEvent) {
        this.updateElbowedLine();
    }

    private updateElbowedLine() {
        const rect = this.stateManager.canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const startX = this.event.clientX - rect.left;
        const startY = this.event.clientY - rect.top;

        const selecteds = this.stateManager.shapes.filter((shape) => {
            const left = shape.x;
            const right = shape.x + shape.width;
            const top = shape.y;
            const bottom = shape.y + shape.height;

            // AABB 충돌 조건
            const isOverlap =
                right > Math.min(startX) &&
                left < Math.max(startX) &&
                bottom > Math.min(startY) &&
                top < Math.max(startY);

            return isOverlap;
        });


        if (selecteds.length > 0) {
            // 📌 선택한 박스의 중앙 좌표 계산
            const centerX = selecteds[0].x + selecteds[0].width / 2;
            const centerY = selecteds[0].y + selecteds[0].height / 2;

            // 📌 박스 네 개의 중심점 (left, right, top, bottom)
            const midpoints = [
                { x: centerX, y: selecteds[0].y, type: "top" },      // Top 중앙
                { x: centerX, y: selecteds[0].y + selecteds[0].height, type: "bottom" },   // Bottom 중앙
                { x: selecteds[0].x, y: centerY, type: "left" },     // Left 중앙
                { x: selecteds[0].x + selecteds[0].width, y: centerY, type: "right" },    // Right 중앙
            ];

            // 📌 마우스 현재 위치 계산
            const mouseX = this.event.clientX - rect.left;
            const mouseY = this.event.clientY - rect.top;

            // 📌 박스 내부에서 마우스 위치에 따라 영역 구분
            let detectedArea: string | null = null;

            if (
                mouseX > selecteds[0].x &&
                mouseX < selecteds[0].x + selecteds[0].width &&
                mouseY > selecteds[0].y &&
                mouseY < selecteds[0].y + selecteds[0].height
            ) {
                // 📌 Top 감지 (박스의 상단 20px 내부)
                if (mouseY < selecteds[0].y + 20) detectedArea = "top";

                // 📌 Bottom 감지 (박스의 하단 20px 내부)
                else if (mouseY > selecteds[0].y + selecteds[0].height - 20) detectedArea = "bottom";

                // 📌 Left 감지 (박스의 왼쪽 20px 내부)
                else if (mouseX < selecteds[0].x + 20) detectedArea = "left";

                // 📌 Right 감지 (박스의 오른쪽 20px 내부)
                else if (mouseX > selecteds[0].x + selecteds[0].width - 20) detectedArea = "right";
            }

            this.stateManager.setLineshapes((prev) =>
                prev.map((line) => {
                    if (line.startShapeId === this.stateManager.selectedOffset.id && this.stateManager.selectedOffset.shapeType == line.startType) {
                        line.endShapeId = selecteds[0].id;
                        line.endType = detectedArea || 'right';
                        line.updateLinePosition(this.stateManager); // 정렬된 좌표 적용
                    }
                    return line;
                })
            );
        }
    }
}
