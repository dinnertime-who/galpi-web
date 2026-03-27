"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaveGalpiActionRequest } from "@/actions/galpi/save-galpi.action";
import { saveGalpiAction } from "@/actions/galpi/save-galpi.action";

export function useSaveGalpi() {
  const queryClient = useQueryClient();
  
  const saveGalpiMutation = useMutation({
    mutationKey: ["galpi", "save"],
    mutationFn: async (input: SaveGalpiActionRequest) => {
      const result = await saveGalpiAction(input);
      if (result.error) throw new Error(result.error);
      return result.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-galpis"] });
      queryClient.invalidateQueries({ queryKey: ["my-galpis"] });
    },
  });

  return { saveGalpiMutation };
}
