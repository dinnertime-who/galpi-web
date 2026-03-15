import { Textarea } from "@/components/shadcn/textarea";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@phosphor-icons/react/ssr";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col h-full bg-[#f0eee9]">
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 flex items-start justify-center px-6 pt-[163px] pb-6">
            <Textarea
              placeholder="기록할 문장을 입력하세요..."
              defaultValue={"예시 문장이 기록되어 있습니다."}
              className={cn(
                "resize-none border-none bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                "text-xl md:text-xl text-balance break-keep leading-[1.6] text-[#6d6c6a] text-center font-ridi",
              )}
            />
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-center justify-end gap-1.5 mb-2">
              <span className="text-[14px] font-medium text-[#1a1918]">
                출처
              </span>
              <span className="text-[12px] text-[#9c9b99]">(선택)</span>
            </div>
            <div className="border-b border-[#e5e4e1] pb-1.5">
              <input
                placeholder="책 제목, 영화, 드라마 등..."
                className="w-full bg-transparent outline-none text-[12px] text-[#1a1918] placeholder:text-[#9c9b99] text-right"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-[#e5e4e1] px-6 pt-4 pb-10 flex flex-col gap-4">
          <button
            type="button"
            className={cn(
              "w-full h-[52px] rounded-full flex items-center justify-center gap-2",
              "text-[14px] font-medium transition-opacity",
              true
                ? "bg-[#d3e4f1] text-[#1a3a6b] active:opacity-70"
                : "bg-[#d3e4f1] text-[#1a3a6b] opacity-50 cursor-not-allowed",
            )}
          >
            <CheckIcon size={18} color="#1a3a6b" />
            {false ? "저장 중..." : "입력 완료"}
          </button>
          <button
            type="button"
            className="w-full h-[52px] rounded-full border border-[#e5e4e1] bg-white flex items-center justify-center text-[#6d6c6a] text-[14px] font-medium transition-colors active:bg-[#f5f5f3] disabled:opacity-50"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
