import { Shape, ShapeConfig } from '../modules/Shape';
import Img1 from '../assets/images/pngwing.png'

export interface RectConfig extends ShapeConfig {
  width: number;
  height: number;
  text?: string;
  borderColor?: string;
  no?: string;
  score?: string;
}

export class Rect extends Shape {
  width: number;
  height: number;
  text: string;
  no: string;
  score: string;
  borderColor: string;
  private static loadedImage: HTMLImageElement | null = null;

  constructor(config: RectConfig) {
    super(config);
    this.width = config.width || 120;
    this.height = config.height || 50;
    this.text = config.text || '선수 이름';
    this.no = config.no || '01';
    this.score = config.score || "0";
    this.borderColor = config.borderColor || 'black';

    // 📌 이미지가 아직 로드되지 않았다면 로드 후 캐싱
    if (!Rect.loadedImage) {
      Rect.loadedImage = new Image();
      Rect.loadedImage.src = Img1;
    }
  }

  draw(context: CanvasRenderingContext2D) {

    // 📌 사각형(선수) 위젯 그리기
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);


    if (Rect.loadedImage && Rect.loadedImage.complete) {
      context.drawImage(Rect.loadedImage, this.x + 10, this.y + 10, 80, 80);
    }


    // 📌 테두리 그리기
    context.strokeStyle = this.borderColor;
    context.lineWidth = 2;
    context.strokeRect(this.x, this.y, this.width, this.height);


    // 📌 선수 등번 표시
    context.fillStyle = 'black';
    context.font = '14px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText("등번: " + this.no + "번", this.x + 100, this.y + 30);


    // 📌 선수 이름 표시
    context.fillStyle = 'black';
    context.font = 'bold 20px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(this.text, this.x + 100, this.y + 50);


    // 📌 선수 점수 표시
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(this.score + "점", this.x + 100, this.y + 75);


  }

  /**
   * 📌 대진표 연결선을 그리는 메서드
   * - `nextX, nextY`: 연결되는 다음 Rect의 중심 좌표
   */
  drawConnections(context: CanvasRenderingContext2D, nextX: number, nextY: number) {
    context.beginPath();
    context.strokeStyle = 'gray';
    context.lineWidth = 2;

    // 📌 현재 Rect의 하단 중앙
    const startX = this.x + this.width / 2;
    const startY = this.y + this.height;

    // 📌 다음 라운드 Rect의 상단 중앙
    const endX = nextX + this.width / 2;
    const endY = nextY;

    // 📌 직각(Elbowed) 선 그리기
    const midX = (startX + endX) / 2;
    context.moveTo(startX, startY);
    context.lineTo(midX, startY);
    context.lineTo(midX, endY);
    context.lineTo(endX, endY);

    context.stroke();
  }
}
