export class ZoomUtils {
  private scale: number; // 현재 스케일 (1 = 100%)
  private readonly minScale: number; // 최소 스케일
  private readonly maxScale: number; // 최대 스케일

  constructor(minScale: number = 0.1, maxScale: number = 3) {
    this.scale = 1;
    this.minScale = minScale;
    this.maxScale = maxScale;
  }

  /**
   * Get the current zoom scale.
   */
  getScale(): number {
    return this.scale;
  }

  /**
   * Set the zoom scale directly.
   */
  setScale(scale: number): void {
    this.scale = Math.max(this.minScale, Math.min(scale, this.maxScale));
  }

  /**
   * Apply zoom adjustment (delta) to the current scale.
   * Returns the updated scale.
   */
  adjustZoom(delta: number): number {
    this.setScale(this.scale + delta);
    return this.scale;
  }

  /**
   * Apply the current zoom scale to the canvas and its content.
   */
  applyZoom(
    canvas: HTMLCanvasElement,
    shapes: { draw: (ctx: CanvasRenderingContext2D) => void }[]
  ): void {
    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Scale the canvas
    context.save();
    context.scale(this.scale, this.scale);

    // Redraw shapes with the new scale
    shapes.forEach((shape) => shape.draw(context));
    context.restore();
  }
}
