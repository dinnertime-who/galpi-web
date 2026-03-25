"use client";

import { useMutation } from "@tanstack/react-query";
import { setPendingRecordAction } from "@/actions/auth/set-pending-record.action";

type PendingRecordValues = { text: string; note?: string };

export function useSetPendingRecord() {
  const setPendingRecordMutation = useMutation({
    mutationKey: ["auth", "pending-record", "set"],
    mutationFn: async (values: PendingRecordValues) => {
      const { result, error } = await setPendingRecordAction(values);
      if (error) throw new Error(error);
      return result;
    },
  });

  return { setPendingRecordMutation };
}
