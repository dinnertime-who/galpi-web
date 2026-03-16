"use client";

import { Button } from "@/components/shadcn/button";
import { PencilIcon } from "@phosphor-icons/react/ssr";
import { useRecordPageStore } from "@/store/record-page.store";

export function WriteMethodButton() {
  const setStep = useRecordPageStore((state) => state.setStep);

  return (
    <Button
      variant="outline"
      className="w-full h-28 flex flex-col items-center justify-center p-4 border-primary-foreground/30"
      onClick={() => setStep("record")}
    >
      <PencilIcon className="size-6" />
      <span className="text-galpi-body">직접 문장 기록하기</span>
      <span className="text-galpi-caption"></span>
    </Button>
  );
}
