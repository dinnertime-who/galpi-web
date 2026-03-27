/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD */
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import type { Article, WithContext } from "schema-dts";
import { GalpiDetail } from "@/components/page/galpi/galpi-detail";
import { getGalpiDetailOption } from "@/hooks/page/galpi/use-galpi-detail.option";
import { getQueryClient } from "@/integrations/tanstack-query/client";

type Props = {
  params: Promise<{ id: string }>;
};

const queryClient = getQueryClient();

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const { result, error } = await queryClient.ensureQueryData(getGalpiDetailOption(id));

  if (error || !result) return notFound();

  return {
    title: result.sentence.text.length > 20 ? `${result.sentence.text.slice(0, 20)}...` : result.sentence.text,
    description: `${result.source?.author} <${result.source?.title}> ${result.source?.page ? `p. ${result.source?.page}` : ""} ${result.source?.subTitle ? `- ${result.source?.subTitle}` : ""} 중에서`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const { result, error } = await queryClient.ensureQueryData(getGalpiDetailOption(id));

  if (error || !result) return notFound();

  const jsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    // 메인 제목 (이미지의 큰 텍스트)
    headline: result.sentence.text,
    // 서비스명과 원작 정보 조합
    description: `${result.source?.author} <${result.source?.title}> ${result.source?.page ? `p. ${result.source?.page}` : ""} ${result.source?.subTitle ? `- ${result.source?.subTitle}` : ""} 중에서`,
    // 작성자 정보
    author: {
      "@type": "Person",
      name: result.author?.name ?? "갈피 (Galpi)",
    },
    // 이미지에 포함된 감상평 본문
    articleBody: result.galpi?.note?.slice(0, 100) || result.sentence.text,
    // 원본 소스(인용구)에 대한 명시
    mainEntity: {
      "@type": "Quotation",
      text: result.sentence.text,
      creator: {
        "@type": "Person",
        name: result.source?.author ?? "갈피 (Galpi)",
      },
      citation: result.source?.title ?? "갈피 (Galpi)",
    },
    // 발행 서비스 정보
    publisher: {
      "@type": "Organization",
      name: "갈피 (Galpi)",
      logo: {
        "@type": "ImageObject",
        url: "https://galpiapp.com/logo.png",
      },
    },
    datePublished: result.sentence.createdAt.toISOString(),
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GalpiDetail id={id} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </HydrationBoundary>
  );
}
