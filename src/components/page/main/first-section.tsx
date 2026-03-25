import { RecordButton } from "./record-button";

const SAMPLE_QUOTE = {
  text: "어쩌다 이런 구석까지 찾아왔대도 그게 둘이서 걸어온 길이라면 절대로 헛된 시간일 수 없는 것이라오.",
  source: "김연수 <벚꽃새해>",
  galpiText: "xx님이 꽂아둔 갈피가 있습니다.",
};

type LatestGalpi = { text: string; note: string | null } | null;

type Props = { latestGalpi?: LatestGalpi; userName?: string | null };

export function FirstSection({ latestGalpi, userName }: Props) {
  const galpiText = userName ? `"${userName}"님이 꽂아둔 갈피가 있습니다.` : SAMPLE_QUOTE.galpiText;

  const quote = latestGalpi ? { text: latestGalpi.text, source: null, galpiText } : { ...SAMPLE_QUOTE, galpiText };

  return (
    <section className="px-6 h-[calc(100svh-4rem)] flex flex-col items-center justify-center relative">
      {quote.source && <p className="text-galpi-caption text-center w-full ">{quote.source}</p>}

      <p className="mt-2 text-galpi-heading text-center font-ridi font-bold">{quote.text}</p>

      {quote.galpiText && (
        <p className="mt-6 text-galpi-caption text-end w-full text-primary-foreground/70">{quote.galpiText}</p>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 w-full">
        <RecordButton className="w-full" />
      </div>
    </section>
  );
}
