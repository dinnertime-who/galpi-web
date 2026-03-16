"use client";

import { Button } from "@/components/shadcn/button";
import { CameraIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";
import { WriteMethodButton } from "./record-method-buttons/write-method-button";
import { GalleryMethodButton } from "./record-method-buttons/gallery-method-button";

export function SelectMethodStep() {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-4 min-h-[calc(100svh-4rem)] items-center justify-center",
      )}
    >
      <WriteMethodButton />

      <GalleryMethodButton />

      <Button
        variant="outline"
        className="w-full h-28 flex flex-col items-center justify-center p-4 border-primary-foreground/30"
      >
        <CameraIcon className="size-6" />
        <span className="text-galpi-body">지금보는 문장 가져오기</span>
        <span className="text-galpi-caption">오늘 남은 횟수 (1/2회)</span>
      </Button>
    </div>
  );
}
