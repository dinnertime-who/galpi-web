"use client";

import { useMutation } from "@tanstack/react-query";
import { saveGalpiAction } from "@/server/galpi/actions/save-galpi.action";

export function useSaveGalpi() {
  const saveGalpiMutation = useMutation({
    mutationKey: ["galpi", "save"],
    mutationFn: async (input: { text: string; note?: string }) => {
      const result = await saveGalpiAction(input);
      if (result.error) throw new Error(result.error);
      return result.result;
    },
  });

  return { saveGalpiMutation };
}
