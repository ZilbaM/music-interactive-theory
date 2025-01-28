"use client";
import React, { useEffect, useRef, useState } from "react";
import BaseStep from "../";
import { useNotesContext } from "@/components/context/NotesContext";
import { isAnyOfNotesPressed } from "../stepHelpers";
import clsx from "clsx";

export default function SequenceStep({
  completeStep,
  onEnter,
  onExit,
  children,
  triggerNotes = [],
  progressTexts = [],
  ordered = false,
  anyOctave = false,
  resetOnMistake = false,
}) {
  const { activeNotes } = useNotesContext();
  const [remainingNotes, setRemainingNotes] = useState(
    triggerNotes.map((note) => note % 12)
  );
  const isListening = useRef(false);
  const [progressMessage, setProgressMessage] = useState(undefined);
  const [blinkRed, setBlinkRed] = useState(false);

  // Start listening when no keys are active
  useEffect(() => {
    if (activeNotes.length === 0) {
      isListening.current = true;
    }

    if (isListening.current) {
      activeNotes.forEach((note) => {
        if (
          isAnyOfNotesPressed(
            ordered ? [remainingNotes[0]] : remainingNotes,
            activeNotes,
            anyOctave
          )
        ) {
          const index = remainingNotes.indexOf(note % 12);
          if (index !== -1) {
            setRemainingNotes((prevNotes) => {
              const updatedNotes = [...prevNotes];
              updatedNotes.splice(index, 1);
              if (updatedNotes.length === 0) {
                isListening.current = false;
                completeStep();
              }
              return updatedNotes;
            });
          } else if (resetOnMistake) {
            triggerReset();
          }
        } else if (resetOnMistake) {
          triggerReset();
        }
      });
    }
  }, [
    activeNotes,
    completeStep,
    triggerNotes,
    anyOctave,
    ordered,
    resetOnMistake,
  ]);

  // Trigger reset with visual feedback
  const triggerReset = () => {
    setBlinkRed(true);
    setTimeout(() => {
      setBlinkRed(false);
    }, 500);
    setRemainingNotes(triggerNotes.map((note) => note % 12));
  };

  // Update progress message
  useEffect(() => {
    if (progressTexts.length === triggerNotes.length) {
      setProgressMessage(
        progressTexts.map((text, index) => {
          if (remainingNotes.includes(triggerNotes[index] % 12)) {
            return (
                <p
                  key={text}
                  className="text-black group-[.blinkRed]:bg-red-500 border-2 border-black px-2 rounded-sm bg-gray-200"
                >
                  {text}
              </p>
            );
          } else {
            return (
                <p
                  key={text}
                  className="bg-green-500 group-[.blinkRed]:bg-red-500 border-2 border-black px-2 rounded-sm"
                >
                  {text}
              </p>
            );
          }
        })
      );
    }
  }, [progressTexts, remainingNotes, triggerNotes]);

  return (
    <BaseStep completeStep={completeStep} onEnter={onEnter} onExit={onExit}>
      {children}
      {progressMessage && (
        <div className={clsx("mt-2 flex gap-2 group text-2xl", { blinkRed: blinkRed })}>
          {progressMessage}
        </div>
      )}
    </BaseStep>
  );
}
