import { getStroke } from "perfect-freehand";

export type InputPoint = [x: number, y: number, pressure: number];
export type OutlinePoint = [x: number, y: number];

export function toInputPoint(
  e: PointerEvent,
  canvas: HTMLCanvasElement,
): InputPoint {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const pressure = e.pressure > 0 ? e.pressure : 0.5;
  return [
    (e.clientX - rect.left) * scaleX,
    (e.clientY - rect.top) * scaleY,
    pressure,
  ];
}

export function getFreehandOptions(brushSize: number, last = false) {
  return {
    size: brushSize,
    smoothing: 0.5,
    thinning: 0.5,
    streamline: 0.5,
    simulatePressure: true,
    last,
  };
}

export function getSvgPathFromOutline(outline: number[][]): Path2D {
  const path = new Path2D();
  if (outline.length < 2) return path;

  const [first, ...rest] = outline;
  path.moveTo(first[0], first[1]);

  for (let i = 1; i < rest.length - 1; i++) {
    const mid = [
      (rest[i][0] + rest[i + 1][0]) / 2,
      (rest[i][1] + rest[i + 1][1]) / 2,
    ];
    path.quadraticCurveTo(rest[i][0], rest[i][1], mid[0], mid[1]);
  }

  const last2 = rest[rest.length - 1];
  if (last2) path.lineTo(last2[0], last2[1]);

  path.closePath();
  return path;
}

type RenderCanvasParams = {
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
  completedPaths: InputPoint[][];
  currentPath: InputPoint[];
  brushSize: number;
};

export function renderCanvas({
  ctx,
  image,
  completedPaths,
  currentPath,
  brushSize,
}: RenderCanvasParams): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "rgba(255, 235, 59, 0.45)";

  for (const path of completedPaths) {
    const outline = getStroke(path, getFreehandOptions(brushSize, true));
    ctx.fill(getSvgPathFromOutline(outline));
  }

  if (currentPath.length > 0) {
    const outline = getStroke(currentPath, getFreehandOptions(brushSize, false));
    ctx.fill(getSvgPathFromOutline(outline));
  }
}

export function computeBoundingBox(
  outlines: number[][][],
  canvasWidth: number,
  canvasHeight: number,
  padding: number,
): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = canvasWidth;
  let minY = canvasHeight;
  let maxX = 0;
  let maxY = 0;

  for (const outline of outlines) {
    for (const [x, y] of outline) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  return {
    minX: Math.max(0, minX - padding),
    minY: Math.max(0, minY - padding),
    maxX: Math.min(canvasWidth, maxX + padding),
    maxY: Math.min(canvasHeight, maxY + padding),
  };
}
