"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useNotesContext } from "@/components/context/NotesContext";
import { useCalibrationContext } from "@/components/context/CalibrationContext";
import BaseStep from "@/components/Step";

export default function StepSequencer({
  steps,
  currentIndex,
  setCurrentIndex,
}) {
  const currentStep = steps[currentIndex];
  const [isTransitioning, setIsTransitioning] = useState(false);

  // const {
  //   calibrationData: { firstNote, lastNote },
  // } = useCalibrationContext();
  // const { activeNotes } = useNotesContext();

  // // Handle going back or forward when pressing specific notes
  // useEffect(() => {
  //   if (!isTransitioning) {
  //     if (activeNotes.includes(firstNote)) {
  //       console.log("First note detected, going back");
  //       setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  //     } else if (activeNotes.includes(lastNote)) {
  //       console.log("Last note detected, going forward");
  //       setCurrentIndex((prevIndex) =>
  //         Math.min(prevIndex + 1, steps.length - 1)
  //       );
  //     }
  //   }
  // }, [
  //   activeNotes,
  //   firstNote,
  //   lastNote,
  //   steps.length,
  //   isTransitioning,
  //   setCurrentIndex,
  // ]);

  // Use a stable callback for completing a step
  const completeStep = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, steps.length - 1));
    }, 1000);
  }, [setCurrentIndex, steps.length]);

  // Only show the transition step when explicitly completing a step
  const transitionStep = useCallback(
    () => (
      <BaseStep
        completeStep={() => {
          console.log("Transition complete");
        }}
        onEnter={() => {}}
        onExit={() => {}}
      >
        <p className="text-green-500">Good!</p>
      </BaseStep>
    ),
    []
  );

  // Trigger onEnter and onExit hooks for each step
  useEffect(() => {
    if (currentStep.props.onEnter) currentStep.props.onEnter();
    return () => {
      if (currentStep.props.onExit) currentStep.props.onExit();
    };
  }, [currentStep]);

  // Clone the current step and inject the `completeStep` function
  const clonedStep = React.cloneElement(currentStep, { completeStep });

  return <>{isTransitioning ? transitionStep() : clonedStep}</>;
}
