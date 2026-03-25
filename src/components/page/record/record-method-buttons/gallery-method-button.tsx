"use client";

import { Button } from "@/components/shadcn/button";
import { ImageIcon } from "@phosphor-icons/react/ssr";
import { useRef } from "react";
import { useRecordPageStore } from "@/store/record-page.store";

export function GalleryMethodButton() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setStep = useRecordPageStore((state) => state.setStep);
  const setSelectedImageSrc = useRecordPageStore((state) => state.setSelectedImageSrc);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === "string") {
        setSelectedImageSrc(event.target.result);
        setStep("extract-from-image");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full h-28 flex flex-col items-center justify-center p-4 border-primary-foreground/30"
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon className="size-6" />
        <span className="text-galpi-body">사진첩에서 문장 가져오기</span>
        <span className="text-galpi-caption">오늘 남은 횟수 (1/2회)</span>
      </Button>

      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
    </>
  );
}
