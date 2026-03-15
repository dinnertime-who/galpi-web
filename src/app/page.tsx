import { getLatestQuote } from "@/lib/quotes";
import GalpiApp from "@/components/galpi-app";
import type { Quote } from "@/lib/quotes";

const SAMPLE_QUOTE: Quote = {
  id: 0,
  text: "어쩌다 이런 구석까지 찾아왔대도 그게 둘이서 걸어온 길이라면 절대로 헛된 시간일 수 없는 것이라오.",
  source: "김연수 <벚꽃새해> 중",
  created_at: "",
};

export default function Home() {
  const latest = getLatestQuote();
  return <GalpiApp initialQuote={latest ?? SAMPLE_QUOTE} />;
}
