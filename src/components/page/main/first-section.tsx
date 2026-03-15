"use client";

import { RecordButton } from "./record-button";

const SAMPLE_QUOTE = {
  id: 0,
  text: "어쩌다 이런 구석까지 찾아왔대도 그게 둘이서 걸어온 길이라면 절대로 헛된 시간일 수 없는 것이라오.",
  source: "김연수 <벚꽃새해> 중",
  created_at: "",
};

export function FirstSection() {
  return (
    <section className="px-6 h-svh flex flex-col items-center justify-center relative">
      <p className="text-[20px] text-balance break-keep leading-[1.6] text-[#6d6c6a] text-center font-ridi">
        {SAMPLE_QUOTE.text}
      </p>
      {SAMPLE_QUOTE.source && (
        <p className="mt-4 text-[12px] text-[#9c9b99] text-right w-full">
          {SAMPLE_QUOTE.source}
        </p>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 w-full">
        <RecordButton className="w-full" />
      </div>
    </section>
  );
}
