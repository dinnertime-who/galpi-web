"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SelectMethodStep } from "./select-method-step";
import { RecordGalpiStep } from "./record-galpi-step";
import { RecordPageState, useRecordPageStore } from "@/store/record-page.store";
import { ExtractFromImageStep } from "./steps/extract-from-image.step";
import { useEffect } from "react";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export function RecordPageWrapper({
  initialStep,
}: {
  initialStep: RecordPageState["step"];
}) {
  const { step, selectedImageSrc, setStep, setSelectedImageSrc } =
    useRecordPageStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: initialStep 변경 시에만 실행
  useEffect(() => {
    setStep(initialStep);

    return () => {
      if (selectedImageSrc && typeof selectedImageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImageSrc);
      }
      setSelectedImageSrc(null);
      setStep("select-method");
    };
  }, [initialStep]);

  return (
    <AnimatePresence initial={false} custom={1} mode="wait">
      <motion.div
        key={step}
        custom={1}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        className="w-full"
      >
        {step === "select-method" && <SelectMethodStep />}
        {step === "extract-from-image" && <ExtractFromImageStep />}
        {step === "record" && <RecordGalpiStep />}
      </motion.div>
    </AnimatePresence>
  );
}
