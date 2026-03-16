"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { withContext } from "@/components/ui/with-context";
import { SelectMethodStep } from "./select-method-step";
import { RecordGalpiStep } from "./record-galpi-step";

type RecordPageContextProps = {
  step: "select-method" | "record";
  setStep: React.Dispatch<React.SetStateAction<RecordPageContextProps["step"]>>;
};

const { Provider, useContext } = withContext<RecordPageContextProps>();

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
  initialStep: RecordPageContextProps["step"];
}) {
  const [step, setStep] = useState<RecordPageContextProps["step"]>(initialStep);

  return (
    <Provider context={{ step, setStep }}>
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
          {step === "record" && <RecordGalpiStep />}
        </motion.div>
      </AnimatePresence>
    </Provider>
  );
}

export function useRecordPageContext() {
  return useContext();
}
