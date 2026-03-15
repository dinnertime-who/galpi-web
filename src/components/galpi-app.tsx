"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  PencilLineIcon,
  CaretDownIcon,
  PencilIcon,
  ImageIcon,
  FileTextIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type View = "main" | "drawer" | "record";

const SERIF = "var(--font-noto-serif-kr), 'Noto Serif KR', serif";

/* ─── Main Screen ─────────────────────────────────────────── */
function MainScreen({ quote, onRecord }: { quote: any; onRecord: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#f0eee9]">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p
            className="text-[18px] leading-[1.6] text-[#6d6c6a] text-center"
            style={{ fontFamily: SERIF }}
          >
            {quote.text}
          </p>
          {quote.source && (
            <p className="mt-4 text-[12px] text-[#9c9b99] text-right">
              {quote.source}
            </p>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onRecord}
          className="w-full h-[52px] rounded-full bg-[#d3e4f1] flex items-center justify-center gap-2 text-[#1a3a6b] text-[14px] font-medium transition-opacity active:opacity-70"
        >
          <PencilLineIcon size={18} color="#1a3a6b" />
          오늘의 갈피 기록하기
        </button>
        <CaretDownIcon size={20} color="#9c9b99" />
      </div>
    </div>
  );
}

/* ─── Drawer Screen ───────────────────────────────────────── */
function DrawerScreen({
  quote,
  onClose,
  onRecordDirect,
  onRecordSentence,
}: {
  quote: any;
  onClose: () => void;
  onRecordDirect: () => void;
  onRecordSentence: () => void;
}) {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 flex items-center justify-center px-6 bg-[#f0eee9]">
        <div className="w-full max-w-sm">
          <p
            className="text-[18px] leading-[1.6] text-[#6d6c6a] text-center"
            style={{ fontFamily: SERIF }}
          >
            {quote.text}
          </p>
          {quote.source && (
            <p className="mt-4 text-[12px] text-[#9c9b99] text-right">
              {quote.source}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-black/33 cursor-default"
        onClick={onClose}
      />

      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px]"
        style={{ boxShadow: "0 -8px 24px 0 rgba(0,0,0,0.145)" }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-[#c0c8d0]" />
        </div>
        <div className="flex">
          <button
            type="button"
            onClick={onRecordDirect}
            className="flex-1 flex flex-col items-center justify-center gap-2 pt-5 pb-7 border-r border-[#e5e4e1] transition-colors active:bg-[#f5f5f3]"
          >
            <PencilIcon size={24} color="#1a1918" />
            <span className="text-[12px] text-[#1a1918] text-center leading-[1.4]">
              직접 기록하기
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 flex flex-col items-center justify-center gap-2 pt-5 pb-7 border-r border-[#e5e4e1] transition-colors active:bg-[#f5f5f3]"
          >
            <ImageIcon size={24} color="#1a1918" />
            <span className="text-[12px] text-[#1a1918] text-center leading-[1.4]">
              사진첩에서
              <br />
              가져오기
            </span>
          </button>
          <button
            type="button"
            onClick={onRecordSentence}
            className="flex-1 flex flex-col items-center justify-center gap-2 pt-5 pb-7 transition-colors active:bg-[#f5f5f3]"
          >
            <FileTextIcon size={24} color="#1a1918" />
            <span className="text-[12px] text-[#1a1918] text-center leading-[1.4]">
              지금보는 문장
              <br />
              기록하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Record Screen ───────────────────────────────────────── */
function RecordScreen({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [isPending, startTransition] = useTransition();
  const hasText = text.trim().length > 0;

  function handleSubmit() {
    if (!hasText) return;
    startTransition(async () => {
      router.refresh();
      onBack();
    });
  }

  return (
    <div className="flex flex-col h-full bg-[#f0eee9]">
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1 flex items-start justify-center px-6 pt-[163px] pb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="기록할 문장을 입력하세요..."
            className={cn(
              "w-full min-h-[200px] bg-transparent resize-none outline-none",
              "text-[16px] leading-[1.6] text-center",
              "text-[#1a1918] placeholder:text-[#9c9b99]",
            )}
          />
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-center justify-end gap-1.5 mb-2">
            <span className="text-[14px] font-medium text-[#1a1918]">출처</span>
            <span className="text-[12px] text-[#9c9b99]">(선택)</span>
          </div>
          <div className="border-b border-[#e5e4e1] pb-1.5">
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="책 제목, 영화, 드라마 등..."
              className="w-full bg-transparent outline-none text-[12px] text-[#1a1918] placeholder:text-[#9c9b99] text-right"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-[#e5e4e1] px-6 pt-4 pb-10 flex flex-col gap-4">
        <button
          type="button"
          disabled={!hasText || isPending}
          onClick={handleSubmit}
          className={cn(
            "w-full h-[52px] rounded-full flex items-center justify-center gap-2",
            "text-[14px] font-medium transition-opacity",
            hasText && !isPending
              ? "bg-[#d3e4f1] text-[#1a3a6b] active:opacity-70"
              : "bg-[#d3e4f1] text-[#1a3a6b] opacity-50 cursor-not-allowed",
          )}
        >
          <CheckIcon size={18} color="#1a3a6b" />
          {isPending ? "저장 중..." : "입력 완료"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="w-full h-[52px] rounded-full border border-[#e5e4e1] bg-white flex items-center justify-center text-[#6d6c6a] text-[14px] font-medium transition-colors active:bg-[#f5f5f3] disabled:opacity-50"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}

/* ─── Root Client Component ───────────────────────────────── */
export default function GalpiApp({ initialQuote }: { initialQuote: any }) {
  const [view, setView] = useState<View>("main");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#e8e5de]">
      <div className="relative w-full h-dvh max-h-[852px] overflow-hidden shadow-2xl">
        {view === "main" && (
          <MainScreen quote={initialQuote} onRecord={() => setView("drawer")} />
        )}
        {view === "drawer" && (
          <DrawerScreen
            quote={initialQuote}
            onClose={() => setView("main")}
            onRecordDirect={() => setView("record")}
            onRecordSentence={() => setView("record")}
          />
        )}
        {view === "record" && <RecordScreen onBack={() => setView("main")} />}
      </div>
    </div>
  );
}
