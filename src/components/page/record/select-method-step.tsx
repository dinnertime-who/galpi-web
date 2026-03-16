"use client";

import { Button } from "@/components/shadcn/button";
import { CameraIcon, ImageIcon, PencilIcon } from "@phosphor-icons/react/ssr";
import { useRecordPageContext } from "./record-page-wrapper";
import { cn } from "@/lib/utils";

export function SelectMethodStep() {
  const { setStep } = useRecordPageContext();

  return (
    <div
      className={cn("flex flex-col gap-y-4 w-full transition-all duration-300")}
    >
      <Button
        variant="outline"
        className="w-full h-28 flex flex-col items-center justify-center p-4 border-primary-foreground/30"
        onClick={() => setStep("record")}
      >
        <PencilIcon className="size-6" />
        <span className="text-galpi-body">직접 문장 기록하기</span>
        <span className="text-galpi-caption"></span>
      </Button>

      <Button
        variant="outline"
        className="w-full h-28 flex flex-col items-center justify-center p-4 border-primary-foreground/30"
      >
        <ImageIcon className="size-6" />
        <span className="text-galpi-body">사진첩에서 문장 가져오기</span>
        <span className="text-galpi-caption">오늘 남은 횟수 (1/2회)</span>
      </Button>

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
