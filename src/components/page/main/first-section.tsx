import Link from "next/link";
import { getMainGalpiAction } from "@/actions/galpi/get-main-galpi.action";
import { RecordButton } from "./record-button";

const SAMPLE_QUOTE = {
  text: "어쩌다 이런 구석까지 찾아왔대도 그게 둘이서 걸어온 길이라면 절대로 헛된 시간일 수 없는 것이라오.",
  source: "김연수 <벚꽃새해> 중에서",
  galpiText: "",
};

export async function FirstSection() {
  const { result, error } = await getMainGalpiAction();

  const data = !error && result ? result : null;

  const quote = data
    ? {
        text: data.sentence.text,
        source: data.source
          ? `${data.source.author} <${data.source.title}> ${data.source.page ? `p. ${data.source.page}` : ""} ${data.source.subTitle ? `- ${data.source.subTitle}` : ""} 에서`
          : null,
      }
    : SAMPLE_QUOTE;

  return (
    <section className="px-6 h-[calc(100svh-4rem)] flex flex-col items-center justify-center relative">
      {quote.source && <p className="text-galpi-caption text-center w-full ">{quote.source}</p>}

      <p className="mt-2 text-galpi-heading text-center font-ridi font-bold">{quote.text}</p>

      {data?.galpi && data.author && (
        <Link
          href={`/galpi/${data.galpi.id}`}
          className="mt-6 text-galpi-caption text-end w-full text-primary-foreground/70 underline-offset-2 hover:underline"
        >
          — "{data.author.name}"님이 갈피를 남겼습니다.
        </Link>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 w-full">
        <RecordButton className="w-full" />
      </div>
    </section>
  );
}
