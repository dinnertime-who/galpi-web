/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../shadcn/button";

export function PWAInstall() {
  const [isInstalled, setIsInstalled] = useState(false);
  const pwaEvent = useRef<any | null>(null);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      pwaEvent.current = event;
    });
  }, []);

  if (isInstalled) {
    return null;
  }

  return (
    <Button variant="outline" size="icon" onClick={() => pwaEvent.current?.prompt()}>
      Install
    </Button>
  );
}
