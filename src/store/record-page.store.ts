import { create } from "zustand";

export type RecordPageState = {
  step: "select-method" | "extract-from-image" | "record";
  selectedImageSrc: string | null;
};

type RecordPageActions = {
  setStep: (step: RecordPageState["step"]) => void;
  setSelectedImageSrc: (imageSrc: RecordPageState["selectedImageSrc"]) => void;
};

export const useRecordPageStore = create<RecordPageState & RecordPageActions>(
  (set) => ({
    step: "select-method",
    selectedImageSrc: null,
    setStep: (step) => set({ step }),
    setSelectedImageSrc: (imageSrc) => set({ selectedImageSrc: imageSrc }),
  }),
);
