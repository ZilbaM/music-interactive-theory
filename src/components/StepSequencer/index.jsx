// StepSequencer.jsx
"use client";
import React, { useCallback, useEffect } from "react";

export default function StepSequencer({ steps, currentIndex, setCurrentIndex }) {
  const currentStep = steps[currentIndex];

  // Use a stable callback for completeStep
  const completeStep = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [setCurrentIndex, steps.length]);

  useEffect(() => {
    if (currentStep.props.onEnter) currentStep.props.onEnter();
    return () => {
      if (currentStep.props.onExit) currentStep.props.onExit();
    };
  }, [currentStep]);

  // Now pass the *memoized* completeStep
  const clonedStep = React.cloneElement(currentStep, { completeStep });
  return <>{clonedStep}</>;
}
