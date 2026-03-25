"use client";

import { useQuery } from "@tanstack/react-query";
import { getGalpiDetailOption } from "./use-galpi-detail.option";

export function useGalpiDetail(id: string) {
  const query = useQuery(getGalpiDetailOption(id));

  return query;
}
