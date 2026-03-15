import { Button } from "@/components/shadcn/button";
import {
  CameraIcon,
  ImageIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/ssr";

export default function Page() {
  return (
    <div className="p-6 flex flex-col gap-y-4 h-[calc(100svh-4rem)]">
      <div className="flex flex-col gap-y-2 items-center justify-center">
        <textarea
          className="text-galpi-heading font-ridi w-full text-center resize-none shadow-none ring-0 focus-visible:ring-0 focus-visible:border-none outline-none h-[65svh] border border-border p-6 bg-white"
          placeholder="기록할 문장을 직접 입력하거나 사진에서 가져오세요."
        />
      </div>

      <div className="grid grid-cols-2 gap-x-2">
        <Button
          variant="outline"
          className="w-full h-auto flex flex-col items-center justify-center p-4"
        >
          <ImageIcon className="size-6" />
          <span className="text-galpi-body">사진첩에서 문장 가져오기</span>
          <span className="text-galpi-caption">오늘 남은 횟수 (1/2회)</span>
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto flex flex-col items-center justify-center p-4"
        >
          <CameraIcon className="size-6" />
          <span className="text-galpi-body">지금보는 문장 가져오기</span>
          <span className="text-galpi-caption">오늘 남은 횟수 (1/2회)</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-x-2">
        <div></div>
        <Button className="w-full h-auto flex items-center justify-center p-3 text-galpi-body">
          <span className="text-primary-foreground">다음으로</span>
          <ArrowRightIcon className="size-4 text-primary-foreground" />
        </Button>
      </div>
    </div>
  );
}
