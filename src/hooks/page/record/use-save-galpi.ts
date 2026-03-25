"use client";

import { useMutation } from "@tanstack/react-query";
import type { SaveGalpiActionRequest } from "@/actions/galpi/save-galpi.action";
import { saveGalpiAction } from "@/actions/galpi/save-galpi.action";

export function useSaveGalpi() {
  const saveGalpiMutation = useMutation({
    mutationKey: ["galpi", "save"],
    mutationFn: async (input: SaveGalpiActionRequest) => {
      const result = await saveGalpiAction(input);
      if (result.error) throw new Error(result.error);
      return result.result;
    },
  });

  return { saveGalpiMutation };
}
