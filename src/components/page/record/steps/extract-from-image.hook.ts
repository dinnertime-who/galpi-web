"use client";

import { extractTextAction } from "@/server/ai/actions/extract-text.action";
import { useRecordPageStore } from "@/store/record-page.store";
import { getStroke } from "perfect-freehand";
import { useEffect, useRef, useState } from "react";
import {
  type InputPoint,
  computeBoundingBox,
  getFreehandOptions,
  getSvgPathFromOutline,
  renderCanvas,
  toInputPoint,
} from "./extract-from-image.utils";

export type UseExtractCanvasReturn = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isLoading: boolean;
  croppedImageSrc: string | null;
  handleClear: () => void;
  handlePreview: () => Promise<void>;
  handleFinalExtract: () => Promise<void>;
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerLeave: (e: React.PointerEvent<HTMLCanvasElement>) => void;
};

export function useExtractCanvas(): UseExtractCanvasReturn {
  const selectedImageSrc = useRecordPageStore(
    (state) => state.selectedImageSrc,
  );
  const setStep = useRecordPageStore((state) => state.setStep);
  const setExtractedText = useRecordPageStore(
    (state) => state.setExtractedText,
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const brushSizeRef = useRef<number>(50);
  const originalImgRef = useRef<HTMLImageElement | null>(null);

  const [completedPaths, setCompletedPaths] = useState<InputPoint[][]>([]);
  const completedPathsRef = useRef<InputPoint[][]>([]);
  const currentPathRef = useRef<InputPoint[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [croppedImageSrc, setCroppedImageSrc] = useState<string | null>(null);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedImageSrc) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = selectedImageSrc;
    img.onload = () => {
      originalImgRef.current = img;
      canvas.width = img.width;
      canvas.height = img.height;
      brushSizeRef.current = Math.max(50, img.width * 0.035);

      completedPathsRef.current = [];
      currentPathRef.current = [];
      setCompletedPaths([]);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  const handleClear = () => {
    initCanvas();
    setCroppedImageSrc(null);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedImageSrc 변경 시에만 캔버스 초기화
  useEffect(() => {
    if (selectedImageSrc) initCanvas();
  }, [selectedImageSrc]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const point = toInputPoint(e.nativeEvent, canvas);
    currentPathRef.current = [point];
    canvas.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (currentPathRef.current.length === 0) return;
    const canvas = canvasRef.current;
    const img = originalImgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    currentPathRef.current.push(toInputPoint(e.nativeEvent, canvas));

    renderCanvas({
      ctx,
      image: img,
      completedPaths: completedPathsRef.current,
      currentPath: currentPathRef.current,
      brushSize: brushSizeRef.current,
    });
  };

  const finishDrawing = () => {
    if (currentPathRef.current.length === 0) return;
    const canvas = canvasRef.current;
    const img = originalImgRef.current;

    const newPaths = [...completedPathsRef.current, currentPathRef.current];
    completedPathsRef.current = newPaths;
    setCompletedPaths(newPaths);
    currentPathRef.current = [];

    if (canvas && img) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        renderCanvas({
          ctx,
          image: img,
          completedPaths: newPaths,
          currentPath: [],
          brushSize: brushSizeRef.current,
        });
      }
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    finishDrawing();
  };

  const onPointerLeave = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    finishDrawing();
  };

  const handlePreview = async () => {
    if (completedPathsRef.current.length === 0) {
      alert("문장을 먼저 칠해주세요!");
      return;
    }

    const canvas = canvasRef.current;
    const originalImg = originalImgRef.current;
    if (!canvas || !originalImg) return;

    setIsLoading(true);
    try {
      const brushSize = brushSizeRef.current;
      const options = getFreehandOptions(brushSize, true);

      // 1. 마스킹: perfect-freehand outline으로 fill
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskCtx = maskCanvas.getContext("2d");
      if (!maskCtx) return;

      maskCtx.fillStyle = "black";
      const outlines: number[][][] = [];

      for (const path of completedPathsRef.current) {
        const outline = getStroke(path, options);
        outlines.push(outline);
        maskCtx.fill(getSvgPathFromOutline(outline));
      }

      maskCtx.globalCompositeOperation = "source-in";
      maskCtx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);

      // 2. 흰 배경에 합성
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      const finalCtx = finalCanvas.getContext("2d");
      if (!finalCtx) return;

      finalCtx.fillStyle = "white";
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      finalCtx.drawImage(maskCanvas, 0, 0);

      // 3. outline 포인트 기반 bbox 계산 (더 정확)
      const padding = brushSize * 0.15;
      const { minX, minY, maxX, maxY } = computeBoundingBox(
        outlines,
        canvas.width,
        canvas.height,
        padding,
      );

      const cropWidth = maxX - minX;
      const cropHeight = maxY - minY;

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;
      const cropCtx = cropCanvas.getContext("2d");
      if (!cropCtx) return;

      cropCtx.drawImage(
        finalCanvas,
        minX,
        minY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );

      setCroppedImageSrc(cropCanvas.toDataURL("image/jpeg", 0.9));
    } catch (error) {
      console.error("미리보기 생성 오류:", error);
      alert("작업에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalExtract = async () => {
    if (!croppedImageSrc) return;
    setIsLoading(true);
    try {
      const base64Data = croppedImageSrc.split(",")[1];
      const formData = new FormData();
      formData.append("base64Image", base64Data);
      const text = await extractTextAction(formData);

      if (text.error || !text.result) {
        alert(text.error);
        return;
      }

      setExtractedText(text.result.trim());
      setStep("record");
    } catch (error) {
      console.error("추출 오류:", error);
      alert("추출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    canvasRef,
    isLoading,
    croppedImageSrc,
    handleClear,
    handlePreview,
    handleFinalExtract,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
  };
}
