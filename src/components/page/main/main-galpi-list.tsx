"use client";

import { useEffect, useRef } from "react";
import { useAllGalpis } from "@/hooks/page/main/use-all-galpis";
import { MainSentenceCard } from "./main-sentence-card";

export function MainGalpiList() {
  const { allGalpisQuery, items, total } = useAllGalpis();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && allGalpisQuery.hasNextPage && !allGalpisQuery.isFetchingNextPage) {
          allGalpisQuery.fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [allGalpisQuery]);

  if (allGalpisQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-6">
        <div className="px-1 pb-3">
          <p className="text-galpi-caption">아직 등록된 갈피가 없어요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-3">
      <div className="px-1 pb-3">
        <p className="text-galpi-caption">
          지금까지 <span className="font-bold text-primary-foreground">{total ?? items.length}개</span>의 갈피가
          기록되었어요.
        </p>
      </div>

      {items.map((item) => (
        <MainSentenceCard
          key={item.sentence.id}
          sentence={item.sentence}
          source={item.source}
          galpi={item.galpi}
          author={item.author}
        />
      ))}

      <div ref={sentinelRef} className="h-4" />

      {allGalpisQuery.isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-primary rounded-full border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
