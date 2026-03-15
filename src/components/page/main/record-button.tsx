"use client";

import { useRecordMethodDrawerStore } from "@/app/store/record-method-drawer.store";
import { Button } from "@/components/shadcn/button";
import { cn } from "@/lib/utils";
import { PencilLineIcon } from "@phosphor-icons/react";

export function RecordButton({ className }: { className?: string }) {
  const { open } = useRecordMethodDrawerStore();
  return (
    <Button
      className={cn(
        "h-auto px-4 py-3 rounded-full text-sm cursor-pointer shadow shadow-primary border border-primary-foreground/10",
        className,
      )}
      onClick={open}
    >
      <PencilLineIcon size={18} color="#1a3a6b" />
      <span>오늘의 갈피 기록하기</span>
    </Button>
  );
}
