"use client";

import Link from "next/link";

type SentenceCardProps = {
  sentence: { id: string; text: string; createdAt: Date | null };
  source: { title: string; author: string; subTitle?: string; page?: number } | null;
  galpi: { id: string; note?: string } | null;
};

export function SentenceCard({ sentence, source, galpi }: SentenceCardProps) {
  const sourceLabel = source
    ? `${source.author} <${source.title}${source.page ? ` p.${source.page}` : ""}>${source.subTitle ? ` - ${source.subTitle}` : ""} 중에서`
    : null;

  const content = (
    <>
      {sourceLabel && <p className="text-galpi-caption text-center">{sourceLabel}</p>}
      <p className="mt-2 text-galpi-heading font-ridi font-bold text-center">{sentence.text}</p>
      {galpi?.note && <p className="mt-3 text-galpi-caption text-primary-foreground/70 line-clamp-2">"{galpi.note}"</p>}
    </>
  );

  if (galpi?.id) {
    return (
      <Link href={`/galpi/${galpi.id}`} className="block bg-white px-5 py-6 border border-border cursor-pointer">
        {content}
      </Link>
    );
  }

  return <article className="bg-white px-5 py-6 border border-border">{content}</article>;
}
