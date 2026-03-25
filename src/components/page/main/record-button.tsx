"use client";

import { BookmarkIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { buttonVariants } from "@/components/shadcn/button";
import { cn } from "@/lib/utils";

export function RecordButton({ className }: { className?: string }) {
  return (
    <Link
      href="/record"
      className={cn(
        buttonVariants({ variant: "default" }),
        "h-auto px-4 py-3 rounded-full text-sm cursor-pointer shadow shadow-primary border border-border",
        className,
      )}
    >
      <BookmarkIcon size={18} color="#1a3a6b" />
      <span>오늘의 갈피 기록하기</span>
    </Link>
  );
}
