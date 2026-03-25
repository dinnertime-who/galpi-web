import { create } from "zustand";

export type RecordPageState = {
  step: "select-method" | "extract-from-image" | "record";
  selectedImageSrc: string | null;
  extractedText: string | null;
};

type RecordPageActions = {
  setStep: (step: RecordPageState["step"]) => void;
  setSelectedImageSrc: (imageSrc: RecordPageState["selectedImageSrc"]) => void;
  setExtractedText: (extractedText: RecordPageState["extractedText"]) => void;
};

export const useRecordPageStore = create<RecordPageState & RecordPageActions>((set) => ({
  step: "select-method",
  selectedImageSrc: null,
  extractedText: null,
  setStep: (step) => set({ step }),
  setSelectedImageSrc: (imageSrc) => set({ selectedImageSrc: imageSrc }),
  setExtractedText: (extractedText) => set({ extractedText }),
}));
