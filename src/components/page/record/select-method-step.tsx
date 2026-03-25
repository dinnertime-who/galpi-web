"use client";

import { cn } from "@/lib/utils";
import { WriteMethodButton } from "./record-method-buttons/write-method-button";
import { GalleryMethodButton } from "./record-method-buttons/gallery-method-button";
import { CaptureCameraButton } from "./record-method-buttons/capture-camera-button";

export function SelectMethodStep() {
  return (
    <div className={cn("flex flex-col gap-y-4 min-h-[calc(100svh-4rem)] items-center justify-center")}>
      <WriteMethodButton />

      <GalleryMethodButton />

      <CaptureCameraButton />
    </div>
  );
}
