import { getMainGalpiAction } from "@/actions/galpi/get-main-galpi.action";
import { TestView } from "@/components/test-view/test-view";
import { RecordButton } from "./record-button";

const SAMPLE_QUOTE = {
  text: "어쩌다 이런 구석까지 찾아왔대도 그게 둘이서 걸어온 길이라면 절대로 헛된 시간일 수 없는 것이라오.",
  source: "김연수 <벚꽃새해> 중에서",
  galpiText: "",
};

export async function FirstSection() {
  const { result, error } = await getMainGalpiAction();

  console.log(result, error);

  const quote =
    !error && result
      ? {
          text: result.sentence.text,
          source: result.source
            ? `${result.source.author} <${result.source.title} ${result.source.page ? `p. ${result.source.page}` : ""}> ${result.source.subTitle ? `- ${result.source.subTitle}` : ""} 중에서`
            : null,
          galpiText: result.galpi && result.author ? `"${result.author.name}"님이 꽂아둔 갈피가 있습니다.` : null,
        }
      : SAMPLE_QUOTE;

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

      <TestView />
    </section>
  );
}
