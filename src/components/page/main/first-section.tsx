import { RecordButton } from "./record-button";

const SAMPLE_QUOTE = {
  text: "어쩌다 이런 구석까지 찾아왔대도 그게 둘이서 걸어온 길이라면 절대로 헛된 시간일 수 없는 것이라오.",
  source: "김연수 <벚꽃새해>",
  galpiText: "xx님이 꽂아둔 갈피가 있습니다.",
};

export function FirstSection() {
  return (
    <section className="px-6 h-[calc(100svh-4rem)] flex flex-col items-center justify-center relative">
      {SAMPLE_QUOTE.source && <p className="text-galpi-caption text-center w-full ">{SAMPLE_QUOTE.source}</p>}

      <p className="mt-2 text-galpi-heading text-center font-ridi font-bold">{SAMPLE_QUOTE.text}</p>

      {SAMPLE_QUOTE.galpiText && (
        <p className="mt-6 text-galpi-caption text-end w-full text-primary-foreground/70">{SAMPLE_QUOTE.galpiText}</p>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 w-full">
        <RecordButton className="w-full" />
      </div>
    </section>
  );
}
