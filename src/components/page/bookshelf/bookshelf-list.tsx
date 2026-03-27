"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { RecordButton } from "@/components/page/main/record-button";
import { Button } from "@/components/shadcn/button";
import { useMyGalpis } from "@/hooks/page/bookshelf/use-my-galpis";
import { authClient } from "@/lib/auth-client";
import { SentenceCard } from "./sentence-card";

export function BookshelfList() {
  const { myGalpisQuery, items } = useMyGalpis();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && myGalpisQuery.hasNextPage && !myGalpisQuery.isFetchingNextPage) {
          myGalpisQuery.fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [myGalpisQuery]);

  if (myGalpisQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100svh-8rem)]">
        <div className="w-6 h-6 border-2 border-primary rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100svh-8rem)]">
        <RecordButton />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-3">
      <div className="px-1 pb-2 flex items-start justify-between">
        <div>
          <h1 className="text-galpi-heading font-ridi font-bold">내 서재</h1>
          <p className="text-galpi-caption mt-1">내가 모아둔 갈피들을 모아볼 수 있어요.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          로그아웃
        </Button>
      </div>

      <RecordButton className="w-full mb-5" />

      {items.map((item) => (
        <SentenceCard key={item.sentence.id} sentence={item.sentence} source={item.source} galpi={item.galpi} />
      ))}

      <div ref={sentinelRef} className="h-4" />

      {myGalpisQuery.isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-primary rounded-full border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
