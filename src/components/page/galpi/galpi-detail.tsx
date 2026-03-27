"use client";

import { CaretLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useGalpiDetail } from "@/hooks/page/galpi/use-galpi-detail";

export function GalpiDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data } = useGalpiDetail(id);

  const sourceLabel = data?.result?.source
    ? `${data.result.source.author} <${data.result.source.title}${data.result.source.page ? ` p.${data.result.source.page}` : ""}>${data.result.source.subTitle ? ` - ${data.result.source.subTitle}` : ""} 중에서`
    : null;

  return (
    <div className="flex flex-col h-[calc(100svh-4rem)]">
      <div className="px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-x-1 text-galpi-caption text-muted-foreground cursor-pointer"
        >
          <CaretLeftIcon size={16} />
          <span>뒤로</span>
        </button>
      </div>

      <div className="flex-1 px-6 py-6 flex flex-col gap-y-3 ">
        <div className="flex flex-col gap-y-3 py-[5dvh]">
          {sourceLabel && <p className="text-galpi-caption text-center w-full text-balance">{sourceLabel}</p>}

          <p className="text-galpi-heading text-xl font-ridi font-bold text-center">{data?.result?.sentence.text}</p>

          <p className="text-galpi-caption text-end w-full text-primary-foreground/70">— {data?.result?.author.name}</p>
        </div>

        {data?.result?.galpi.note && (
          <>
            <hr className="border-border my-[5dvh]" />
            <p className="text-galpi-body whitespace-pre-wrap text-center font-ridi">{data?.result?.galpi.note}</p>
          </>
        )}
      </div>
    </div>
  );
}
