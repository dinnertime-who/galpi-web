"use client";

import { useQuery } from "@tanstack/react-query";
import { clearPendingRecordAction, getPendingRecordAction } from "@/actions/auth/get-pending-record.action";

export function useGetPendingRecord() {
  const pendingRecordQuery = useQuery({
    queryKey: ["auth", "pending-record"],
    queryFn: async () => {
      const { result } = await getPendingRecordAction();
      return result;
    },
  });

  return { pendingRecordQuery, clearPendingRecordAction };
}
