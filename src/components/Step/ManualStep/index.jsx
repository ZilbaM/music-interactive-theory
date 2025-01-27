"use client";
import React, { useEffect } from "react";
import BaseStep from "../";
import { useNotesContext } from "@/components/context/NotesContext";

export default function ManualStep({
  completeStep,
  onEnter,
  onExit,
  children,
  triggerNote, // MIDI note number to trigger completion
}) {
  const { activeNotes } = useNotesContext();

  useEffect(() => {
    if (triggerNote !== undefined) {
      if (activeNotes.includes(triggerNote)) {
        completeStep();
      }
    }
  }, [activeNotes]);

  return (
    <BaseStep completeStep={completeStep} onEnter={onEnter} onExit={onExit}>
      {children}
    </BaseStep>
  );
}
