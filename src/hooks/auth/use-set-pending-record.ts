"use client";

import { useMutation } from "@tanstack/react-query";
import type { SetPendingRecordRequest } from "@/actions/auth/set-pending-record.action";
import { setPendingRecordAction } from "@/actions/auth/set-pending-record.action";

export function useSetPendingRecord() {
  const setPendingRecordMutation = useMutation({
    mutationKey: ["auth", "pending-record", "set"],
    mutationFn: async (values: SetPendingRecordRequest) => {
      const { result, error } = await setPendingRecordAction(values);
      if (error) throw new Error(error);
      return result;
    },
  });

  return { setPendingRecordMutation };
}
