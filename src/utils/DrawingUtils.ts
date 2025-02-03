import { StateManager } from "../modules/StateManager";

export class DrawingHandler {

    constructor(private stateManager: StateManager) {
    }

    drawShapes() {
        const canvas = this.stateManager.canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.drawBackgroundPattern();

        this.stateManager.shapes.forEach((shape) => {
            shape.draw(ctx);
        });
    }

    drawBackgroundPattern() {
        const canvas = this.stateManager.canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const spacing = 20; // 여백 10px
        const dotSize = 2; // 점 크기 1px

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // 점 색상 설정
        for (let x = 0; x < canvas.width; x += spacing) {
            for (let y = 0; y < canvas.height; y += spacing) {
                ctx.fillRect(x, y, dotSize, dotSize);
            }
        }
        ctx.restore();
    }

    drawSelectionBox() {
        const canvas = this.stateManager.canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { startX, startY, endX, endY } = this.stateManager.selectedOffset;

        ctx.save();
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.strokeRect(
            Math.min(startX, endX),
            Math.min(startY, endY),
            Math.abs(endX - startX),
            Math.abs(endY - startY)
        );
        ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
        ctx.fillRect(
            Math.min(startX, endX),
            Math.min(startY, endY),
            Math.abs(endX - startX),
            Math.abs(endY - startY)
        );
        ctx.restore();
    }

    getBoundingBoxs() {
        const canvas = this.stateManager.canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        ctx.beginPath();
        ctx.rect(this.stateManager.selectedFilter().minX, this.stateManager.selectedFilter().minY, this.stateManager.selectedFilter().maxX - this.stateManager.selectedFilter().minX, this.stateManager.selectedFilter().maxY - this.stateManager.selectedFilter().minY);
        ctx.strokeStyle = "rgba(0, 0, 255, .5)";
        ctx.lineWidth = 4;
        ctx.setLineDash([10]);
        ctx.stroke();
        ctx.restore();
    }

    radiusMarkers() {
        const canvas = this.stateManager.canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const radius = 10; // 원 크기

        // 📌 left, top, right, bottom의 중앙 좌표 계산
        const midpoints = [
            { x: (this.stateManager.selectedFilter().minX + this.stateManager.selectedFilter().maxX) / 2, y: this.stateManager.selectedFilter().minY - 17 }, // Top
            { x: (this.stateManager.selectedFilter().minX + this.stateManager.selectedFilter().maxX) / 2, y: this.stateManager.selectedFilter().maxY + 17 }, // Bottom
            { x: this.stateManager.selectedFilter().minX - 17, y: (this.stateManager.selectedFilter().minY + this.stateManager.selectedFilter().maxY) / 2 }, // Left
            { x: this.stateManager.selectedFilter().maxX + 17, y: (this.stateManager.selectedFilter().minY + this.stateManager.selectedFilter().maxY) / 2 }, // Right
        ];

        midpoints.forEach((mid) => {
            // ✅ 해당 mid 좌표가 선의 시작/끝 지점인지 확인하여 제외
            const isConnected = this.stateManager.lineshapes.some(
                (line) =>
                    (line.start.x === mid.x - 7 && line.start.y === mid.y) ||
                    (line.start.x === mid.x + 7 && line.start.y === mid.y) ||
                    (line.start.x === mid.x && line.start.y === mid.y + 7) ||
                    (line.start.x === mid.x && line.start.y === mid.y - 7)
            );
            if (isConnected) return; // 📌 선이 연결된 위치는 건너뜀

            // ✅ 원 그리기 (연결되지 않은 경우만)
            ctx.save();
            ctx.beginPath();
            ctx.arc(mid.x, mid.y, radius, 0, Math.PI * 2); // 원 그리기
            ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
            ctx.fill();
            ctx.restore();
        });
    }


    drawLine() {
        const canvas = this.stateManager.canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        this.stateManager.lineshapes.forEach((line) => {
            line.draw(ctx);
        });
    }

    selectLine() {
        const canvas = this.stateManager.canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const markerSize = 10;
        const halfMarkerSize = markerSize / 2;
        if (this.stateManager.selectedLines.length <= 0) return;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.stateManager.selectedLines![0].start.x, this.stateManager.selectedLines![0].start.y, 10, 0, Math.PI * 2); // Draw circle
        ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.stateManager.selectedLines![0].end.x, this.stateManager.selectedLines![0].end.y, 10, 0, Math.PI * 2); // Draw circle
        ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
        ctx.fill();
        ctx.restore();

    }

}