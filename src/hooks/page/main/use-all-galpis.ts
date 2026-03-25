"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllGalpisAction } from "@/actions/galpi/get-all-galpis.action";

export function useAllGalpis() {
  const allGalpisQuery = useInfiniteQuery({
    queryKey: ["all-galpis"],
    queryFn: async ({ pageParam }) => {
      const result = await getAllGalpisAction({ cursor: pageParam, limit: 10 });
      if (result.error) throw new Error(result.error);
      return result.result;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });

  const items = allGalpisQuery.data?.pages.flatMap((page) => page?.items ?? []) ?? [];
  const total = allGalpisQuery.data?.pages[0]?.total;

  return { allGalpisQuery, items, total };
}
