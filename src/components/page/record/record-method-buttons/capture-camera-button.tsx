"use client";

import { Button } from "@/components/shadcn/button";
import { cn } from "@/lib/utils";
import { CameraIcon, XIcon } from "@phosphor-icons/react/ssr";
import { useRef, useState } from "react";
import { useRecordPageStore } from "@/store/record-page.store";

export function CaptureCameraButton() {
  const setStep = useRecordPageStore((state) => state.setStep);
  const setSelectedImageSrc = useRecordPageStore(
    (state) => state.setSelectedImageSrc,
  );
  const streamView = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const capturedCanvas = useRef<HTMLCanvasElement>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 4096 },
          height: { ideal: 2160 },
        },
      });

      // [핵심] 비디오 태그가 이미 DOM에 숨겨져 있으므로 바로 연결 가능
      if (streamView.current) {
        streamView.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOpen(true); // CSS 클래스만 변경
      }
    } catch (err) {
      console.log((err as Error).message);
      console.error("Capture Error:", err);
      alert("카메라 권한이 필요합니다.");
    }
  };

  const stopCapture = () => {
    // [중요] 화면에서 숨기더라도 하드웨어(카메라)는 반드시 꺼야 함
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    // 비디오 소스 끊기 (검은 화면 잔상 방지)
    if (streamView.current) {
      streamView.current.srcObject = null;
    }

    setIsCameraOpen(false);
  };

  const captureFrame = () => {
    if (!streamView.current) return;

    const video = streamView.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return;

    // 1. 캔버스 크기를 비디오 원본 해상도에 맞춤 (화질 저하 방지)
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 2. 현재 비디오 화면을 캔버스에 '그리기' (복사)
    // drawImage(소스, x, y, 가로, 세로)
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.6);

    setSelectedImageSrc(imageDataUrl);
    setStep("extract-from-image");

    canvas.remove();
    stopCapture();
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full h-28 flex flex-col items-center justify-center p-4 border-primary-foreground/30"
        onClick={startCapture}
        disabled={isCameraOpen}
      >
        <CameraIcon className="size-6" />
        <span className="text-galpi-body">지금보는 문장 가져오기</span>
        <span className="text-galpi-caption">오늘 남은 횟수 (1/2회)</span>
      </Button>

      <div className={cn("fixed inset-0 z-50", isCameraOpen ? "" : "hidden")}>
        <video
          ref={streamView}
          autoPlay
          playsInline
          muted
          // // isFrozen이면 숨김 (hidden)
          className={cn("absolute inset-0 bottom-[120px] w-full object-cover")}
          // // 화면 터치 시 캡처
          onClick={captureFrame}
        />

        <p
          className={cn(
            "absolute left-1/2 -translate-x-1/2 bottom-[5svh] text-galpi-body",
          )}
        >
          화면을 터치해서 원하는 문장을 찍으세요
        </p>

        <Button
          variant="ghost"
          size="icon"
          onClick={stopCapture}
          className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 rounded-full h-12 w-12"
        >
          <XIcon className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
}
