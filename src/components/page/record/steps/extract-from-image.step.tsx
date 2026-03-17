"use client";

import { Button } from "@/components/shadcn/button";
import { extractTextAction } from "@/server/ai/actions/extract-text.action";
import { useRecordPageStore } from "@/store/record-page.store";
import { ScissorsIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";

export function ExtractFromImageStep() {
  return (
    <div>
      <ExtractedImageCanvas />
    </div>
  );
}

function ExtractedImageCanvas() {
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

  const [paths, setPaths] = useState<{ x: number; y: number }[][]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);

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

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      brushSizeRef.current = Math.max(50, img.width * 0.05);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushSizeRef.current;
      ctx.strokeStyle = "rgba(255, 235, 59, 0.05)";
      setPaths([]);
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

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    currentPathRef.current = [{ x, y }];
  };

  const getCoordinates = (
    e:
      | React.TouchEvent<HTMLCanvasElement>
      | React.MouseEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    if (
      (e as React.TouchEvent<HTMLCanvasElement>).touches &&
      (e as React.TouchEvent<HTMLCanvasElement>).touches.length > 0
    ) {
      clientX = (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX;
      clientY = (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent<HTMLCanvasElement>).clientX;
      clientY = (e as React.MouseEvent<HTMLCanvasElement>).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const draw = (
    e:
      | React.TouchEvent<HTMLCanvasElement>
      | React.MouseEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
    currentPathRef.current.push({ x, y });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      if (currentPathRef.current.length > 0) {
        setPaths((prev) => [...prev, currentPathRef.current]);
      }
    }
  };

  const handlePreview = async () => {
    if (paths.length === 0) {
      alert("문장을 먼저 칠해주세요!");
      return;
    }

    const canvas = canvasRef.current;
    const originalImg = originalImgRef.current;
    if (!canvas || !originalImg) return;

    setIsLoading(true);
    try {
      // 1. 기존 마스킹 처리 (칠한 곳만 남기고 배경 날리기)
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskCtx = maskCanvas.getContext("2d");
      if (!maskCtx) return;

      maskCtx.lineCap = "round";
      maskCtx.lineJoin = "round";
      maskCtx.lineWidth = brushSizeRef.current;
      maskCtx.strokeStyle = "black";

      // 바운딩 박스(오려낼 사각형)를 구하기 위한 최소/최대 좌표 추적
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;

      paths.forEach((path) => {
        if (path.length < 2) return;
        maskCtx.beginPath();
        maskCtx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          const pt = path[i];
          maskCtx.lineTo(pt.x, pt.y);

          // 최소/최대 좌표 갱신
          if (pt.x < minX) minX = pt.x;
          if (pt.y < minY) minY = pt.y;
          if (pt.x > maxX) maxX = pt.x;
          if (pt.y > maxY) maxY = pt.y;
        }
        maskCtx.stroke();
      });

      maskCtx.globalCompositeOperation = "source-in";
      maskCtx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      const finalCtx = finalCanvas.getContext("2d");
      if (!finalCtx) return;

      finalCtx.fillStyle = "white";
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      finalCtx.drawImage(maskCanvas, 0, 0);

      // 2. 바운딩 박스를 기준으로 최종 크롭(오려내기)
      // 여유 공간(Padding)을 브러쉬 두께만큼 줍니다.
      const padding = brushSizeRef.current;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);

      const cropWidth = maxX - minX;
      const cropHeight = maxY - minY;

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;
      const cropCtx = cropCanvas.getContext("2d");
      if (!cropCtx) return;

      // 잘라낸 이미지를 새로운 작은 캔버스에 그립니다.
      cropCtx.drawImage(
        finalCanvas,
        minX,
        minY,
        cropWidth,
        cropHeight, // 원본에서 복사할 영역 (Source)
        0,
        0,
        cropWidth,
        cropHeight, // 새 캔버스에 그릴 영역 (Destination)
      );

      // 용량이 획기적으로 줄어든 이미지를 저장합니다.
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

  return (
    <div className="flex-1 flex flex-col gap-y-2">
      <div>
        <h2 className="text-galpi-heading font-ridi">
          원하는 문장을 선택해주세요.
        </h2>
        <p className="text-galpi-caption">
          터치나 드래그로 선택할 수 있습니다.
        </p>
      </div>

      <div className="flex gap-x-2 w-full">
        <Button
          variant="outline"
          onClick={handleClear}
          className="flex-1 bg-white"
        >
          다시 선택하기
        </Button>
        <Button
          variant="default"
          onClick={handlePreview}
          disabled={isLoading}
          className="flex-1"
        >
          선택한 문장 오려내기 <ScissorsIcon className="w-5 h-5" />
        </Button>
      </div>

      {croppedImageSrc && (
        <>
          <div className="flex-1 flex flex-col gap-y-2 items-center justify-center bg-white overflow-hidden relative">
            {/* biome-ignore lint/performance/noImgElement: data URL(from canvas) 미리보기용 */}
            <img
              src={croppedImageSrc}
              alt="크롭된 이미지 미리보기"
              className="max-w-full h-auto max-h-[400px] object-contain "
            />
          </div>
          <Button
            variant="default"
            onClick={handleFinalExtract}
            disabled={isLoading}
            className="w-full"
          >
            문장 가져오기
          </Button>
        </>
      )}

      <div className="bg-white p-4 flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onBlur={stopDrawing}
          className="shadow-xl cursor-crosshair touch-none max-w-full h-auto bg-white"
          style={{ touchAction: "none" }}
        />
      </div>
    </div>
  );
}
