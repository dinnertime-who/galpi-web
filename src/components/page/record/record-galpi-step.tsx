"use client";

import { Button } from "@/components/shadcn/button";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import { useRecordPageStore } from "@/store/record-page.store";

export function RecordGalpiStep() {
  const setStep = useRecordPageStore((state) => state.setStep);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2 items-center justify-center">
        <div className="w-full text-start">
          <h3 className="text-galpi-heading font-ridi">내가 기록할 문장</h3>
          <p className="text-galpi-caption">
            기억에 남기고픈 특별한 문장을 기록해주세요.
          </p>
        </div>
        <textarea
          className="flex-1 text-galpi-heading font-ridi w-full text-center resize-none shadow-none ring-0 focus-visible:ring-0 focus-visible:border-none outline-none h-full border border-border p-4 bg-white"
          placeholder="기록할 문장을 직접 입력하거나 사진에서 가져오세요."
        />
      </div>

      <div className="flex flex-col gap-y-2 items-center justify-center">
        <div className="w-full text-start">
          <h3 className="text-galpi-heading font-ridi">갈피 남기기</h3>
          <p className="text-galpi-caption">
            문장에 기억을 더 해줄 생각들을 남겨주세요.
          </p>
        </div>
        <textarea
          className="flex-1 text-galpi-body font-ridi w-full text-start resize-none shadow-none ring-0 focus-visible:ring-0 focus-visible:border-none outline-none h-full border border-border p-4 bg-white"
          placeholder="갈피를 남겨주세요."
        />
      </div>

      <div className="flex flex-col gap-y-2 items-center justify-center">
        <div className="w-full text-start">
          <h3 className="text-galpi-heading font-ridi">출처(선택)</h3>
          <p className="text-galpi-caption">
            어떤 책에서 찾은 문장이신가요? ISBN 또는 책 이름으로 검색해보세요.
          </p>
        </div>

        <div className="text-galpi-caption font-ridi w-full ">
          <span className="text-black">
            저자 {"<"}책이름{">"} ... 중에서
          </span>
        </div>

        <Button variant="outline" className="w-full">
          <MagnifyingGlassIcon />
          <span>출처 찾아보기</span>
        </Button>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setStep("select-method")}
      >
        처음으로
      </Button>
    </div>
  );
}
