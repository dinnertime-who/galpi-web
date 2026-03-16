/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";
import { useRecordPageStore } from "@/store/record-page.store";

export function ExtractFromImageStep() {
  const selectedImageSrc = useRecordPageStore(
    (state) => state.selectedImageSrc,
  );

  return (
    <div>
      {/** biome-ignore lint/performance/noImgElement: Revokable Url */}
      <img src={selectedImageSrc ?? ""} alt="selected" />
    </div>
  );
}
