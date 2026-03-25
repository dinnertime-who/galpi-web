"use client";

import { useEffect } from "react";
import { getMainGalpiAction } from "@/actions/galpi/get-main-galpi.action";

export function TestView() {
  useEffect(() => {
    (async () => {
      const { result, error } = await getMainGalpiAction();
      console.log(result, error);
    })();
  }, []);

  return <div></div>;
}
