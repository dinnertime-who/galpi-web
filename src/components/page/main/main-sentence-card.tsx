"use client";

import Link from "next/link";

type MainSentenceCardProps = {
  sentence: { id: string; text: string; createdAt: Date | null };
  source: { title: string; author: string; subTitle?: string; page?: number } | null;
  galpi: { id: string; note?: string } | null;
  author: { id: string; name: string | null; image?: string } | null;
};

export function MainSentenceCard({ sentence, source, galpi, author }: MainSentenceCardProps) {
  const sourceLabel = source
    ? `${source.author} <${source.title}${source.page ? ` p.${source.page}` : ""}>${source.subTitle ? ` - ${source.subTitle}` : ""} 중에서`
    : null;

  return (
    <article className="bg-white px-5 py-6 border border-border">
      {sourceLabel && <p className="text-galpi-caption text-center">{sourceLabel}</p>}
      <p className="mt-2 text-galpi-heading font-ridi font-bold text-center">{sentence.text}</p>

      {galpi?.id && author && (
        <p className="text-end">
          <span className="mt-4 text-galpi-caption text-primary-foreground/70 underline-offset-2">— {author.name}</span>
        </p>
      )}

      {galpi?.note && (
        <Link
          href={`/galpi/${galpi.id}`}
          className="mt-3 text-galpi-caption text-primary-foreground/70 line-clamp-2 text-center  hover:underline"
        >
          {galpi.note}
        </Link>
      )}
    </article>
  );
}
