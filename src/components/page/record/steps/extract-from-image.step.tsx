"use client";

import { Button } from "@/components/shadcn/button";
import { ScissorsIcon } from "@phosphor-icons/react/dist/ssr";
import { useExtractCanvas } from "./extract-from-image.hook";

export function ExtractFromImageStep() {
  return (
    <div>
      <ExtractedImageCanvas />
    </div>
  );
}

function ExtractedImageCanvas() {
  const {
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
  } = useExtractCanvas();

  return (
    <div className="flex-1 flex flex-col gap-y-2">
      <div>
        <h2 className="text-galpi-heading font-ridi">
          원하는 문장을 선택해주세요.
        </h2>
        <p className="text-galpi-caption">터치나 드래그로 선택할 수 있습니다.</p>
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
              className="max-w-full h-auto max-h-[400px] object-contain"
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
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerLeave}
          className="shadow-xl cursor-crosshair touch-none max-w-full h-auto bg-white"
          style={{ touchAction: "none" }}
        />
      </div>
    </div>
  );
}
