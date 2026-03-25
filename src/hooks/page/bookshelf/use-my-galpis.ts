"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyGalpisAction } from "@/actions/galpi/get-my-galpis.action";

export function useMyGalpis() {
  const myGalpisQuery = useInfiniteQuery({
    queryKey: ["my-galpis"],
    queryFn: async ({ pageParam }) => {
      const result = await getMyGalpisAction({ cursor: pageParam, limit: 10 });
      if (result.error) throw new Error(result.error);
      return result.result;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });

  const items = myGalpisQuery.data?.pages.flatMap((page) => page?.items ?? []) ?? [];

  return { myGalpisQuery, items };
}
