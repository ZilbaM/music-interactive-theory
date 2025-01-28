"use client";
import React, { useEffect, useRef } from "react";
import BaseStep from "../";
import { useNotesContext } from "@/components/context/NotesContext";
import { isSingleNotePressed } from "../stepHelpers";

export default function SingleNoteStep({
  completeStep,
  onEnter,
  onExit,
  children,
  triggerNote = 0,
  anyOctave = false, 
}) {
  const { activeNotes } = useNotesContext();
  const isListening = useRef(false);

  useEffect(() => {
    if (activeNotes.length === 0) {
      // If no notes are active, start listening for the trigger note
      isListening.current = true;
    }

    if (isListening.current && triggerNote) {
      if (isSingleNotePressed(triggerNote, activeNotes, anyOctave)) {
        isListening.current = false; // Stop listening after trigger is detected
        completeStep();
      }
    }
  }, [activeNotes, triggerNote, anyOctave, completeStep]);

  return (
    <BaseStep completeStep={completeStep} onEnter={onEnter} onExit={onExit}>
      {children}
    </BaseStep>
  );
}
