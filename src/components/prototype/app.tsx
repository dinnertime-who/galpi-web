"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  ImageIcon,
  CameraIcon,
  BookOpenIcon,
  CaretRightIcon,
  ArrowsClockwiseIcon,
  PencilIcon,
  CheckCircleIcon,
  ScissorsIcon,
} from "@phosphor-icons/react";
import { extractTextAction } from "@/server/ai/actions/extract-text.action";

export default function App() {
  const [step, setStep] = useState(1);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImageSrc, setCroppedImageSrc] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          setImageSrc(event.target.result);
          setStep(2);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const originalImgRef = useRef<HTMLImageElement | null>(null);

  const [paths, setPaths] = useState<{ x: number; y: number }[][]>([]);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);
  const brushSizeRef = useRef(30);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      originalImgRef.current = img;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      brushSizeRef.current = Math.max(30, img.width * 0.02);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushSizeRef.current;
      ctx.strokeStyle = "rgba(255, 235, 59, 0.05)";
      setPaths([]);
    };
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: step, imageSrc 변경 시에만 캔버스 초기화
  useEffect(() => {
    if (step === 2) initCanvas();
  }, [step, imageSrc]);

  // biome-ignore lint/suspicious/noExplicitAny: 터치/마우스 이벤트 공통 처리
  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // biome-ignore lint/suspicious/noExplicitAny: 터치/마우스 이벤트 공통 처리
  const startDrawing = (e: any) => {
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

  // biome-ignore lint/suspicious/noExplicitAny: 터치/마우스 이벤트 공통 처리
  const draw = (e: any) => {
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

  const handleClear = () => {
    initCanvas();
  };

  // 💡 [핵심 최적화 로직] 칠해진 영역을 계산해서 그 부분만 오려냅니다.
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
      setStep(3);
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
      setStep(4);
    } catch (error) {
      console.error("추출 오류:", error);
      alert("추출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f6] text-gray-800 font-sans flex flex-col items-center py-10 px-4">
      <header className="w-full max-w-lg flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <BookOpenIcon className="w-6 h-6 text-[#5b6e5b]" />
          갈피
        </h1>
        <div className="text-sm text-gray-500 font-medium">
          {step === 1 && "기록하기"}
          {step === 2 && "문장 선택"}
          {step === 3 && "최적화 미리보기"}
          {step === 4 && "완료"}
        </div>
      </header>

      <main className="w-full max-w-lg bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden flex flex-col min-h-[500px] relative">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <PencilIcon className="w-10 h-10 text-[#5b6e5b] animate-bounce mb-4" />
            <p className="text-gray-700 font-medium animate-pulse">
              {step === 2
                ? "이미지를 최적화하는 중..."
                : "갈피를 꽂는 중입니다..."}
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="flex-1 flex flex-col p-8">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 mb-10">
              <h2 className="text-xl font-medium text-gray-700 leading-relaxed">
                기록할 문장을 직접 입력하거나
                <br />
                사진에서 가져오세요.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 bg-[#faf9f5] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors active:scale-95"
              >
                <ImageIcon
                  className="w-8 h-8 text-gray-600 mb-3"
                  strokeWidth={1.5}
                />
                <span className="font-medium text-gray-700 text-sm">
                  사진첩에서 가져오기
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute("capture", "environment");
                    fileInputRef.current.click();
                    fileInputRef.current.removeAttribute("capture");
                  }
                }}
                className="flex flex-col items-center justify-center p-6 bg-[#faf9f5] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors active:scale-95"
              >
                <CameraIcon
                  className="w-8 h-8 text-gray-600 mb-3"
                  strokeWidth={1.5}
                />
                <span className="font-medium text-gray-700 text-sm">
                  지금보는 문장 찍기
                </span>
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-800">
                  문장 선택하기
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  원하는 문장을 형광펜으로 칠해주세요.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-sm border border-gray-200"
              >
                <ArrowsClockwiseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 bg-[#e8eae6] overflow-hidden relative">
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

            <div className="p-4 bg-white border-t border-gray-100">
              <button
                type="button"
                onClick={handlePreview}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#5b6e5b] hover:bg-[#4a5a4a] text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                선택한 영역 오려내기 <ScissorsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && croppedImageSrc && (
          <div className="flex-1 flex flex-col animate-in fade-in duration-300">
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium text-gray-800">
                  최적화된 이미지 미리보기
                </h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                용량을 최소화하기 위해 선택 영역만 오려냈습니다.
              </p>
            </div>

            {/* 크롭된 이미지는 원본보다 크기가 작으므로 예쁘게 가운데 정렬되어 보입니다. */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#e8eae6] overflow-hidden relative">
              {/* biome-ignore lint/performance/noImgElement: data URL(from canvas) 미리보기용 */}
              <img
                src={croppedImageSrc}
                alt="크롭된 이미지 미리보기"
                className="shadow-2xl border-4 border-white bg-white max-w-full h-auto max-h-[400px] object-contain transform transition-transform hover:scale-105"
              />
            </div>

            <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  setCroppedImageSrc(null);
                }}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowsClockwiseIcon className="w-5 h-5" /> 다시 칠하기
              </button>
              <button
                type="button"
                onClick={handleFinalExtract}
                disabled={isLoading}
                className="flex-2 py-4 bg-[#5b6e5b] hover:bg-[#4a5a4a] text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                이대로 추출하기 <CaretRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 flex flex-col p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-[#5b6e5b] mb-6">
              <CheckCircleIcon className="w-6 h-6" />
              <h2 className="text-lg font-medium">문장이 추출되었습니다</h2>
            </div>

            <div className="flex-1 flex flex-col gap-6">
              <div className="relative">
                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-[#5b6e5b] rounded-full"></div>
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="w-full min-h-[120px] p-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 text-lg font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#5b6e5b]/20 resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="memo-textarea"
                  className="text-sm font-medium text-gray-600 flex items-center gap-2"
                >
                  <PencilIcon className="w-4 h-4" /> 여백 채우기 (선택)
                </label>
                <textarea
                  id="memo-textarea"
                  placeholder="이 문장에 당신의 시선을 꽂아두세요..."
                  className="w-full min-h-[150px] p-4 border border-gray-200 rounded-xl text-gray-700 leading-relaxed focus:outline-none focus:border-[#5b6e5b] focus:ring-1 focus:ring-[#5b6e5b] resize-none"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setCroppedImageSrc(null);
                  setExtractedText("");
                  setPaths([]);
                }}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                처음으로
              </button>
              <button
                type="button"
                className="flex-2 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                내 서재에 저장하기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
