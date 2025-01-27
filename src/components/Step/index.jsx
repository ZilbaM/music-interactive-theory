"use client";
// components/steps/BaseStep.js
import React, { useEffect } from "react";
import { useNotesContext } from "@/components/context/NotesContext";

/**
 * BaseStep
 *
 * Props:
 *   - completeStep: function to call when the step is complete.
 *   - onEnter: function called when the step becomes active.
 *   - onExit: function called when the step is about to leave.
 *   - triggerNotes: array of MIDI note numbers to trigger step completion.
 *   - children: UI content of the step.
 *
 * Behavior:
 *   - Reacts to `activeNotes` to validate input and trigger completion.
 *   - Provides lifecycle hooks (`onEnter` and `onExit`).
 */
export default function BaseStep({
  completeStep,
  onEnter,
  onExit,
  triggerNotes = [], // Array of MIDI notes that can complete this step
  children,
}) {
  const { activeNotes } = useNotesContext();

  useEffect(() => {
    // Call onEnter when the step mounts
    if (onEnter) onEnter();

    // Cleanup: call onExit when the step unmounts
    return () => {
      if (onExit) onExit();
    };
  }, [onEnter, onExit]);

  useEffect(() => {
    if (
      triggerNotes.length > 0 &&
      activeNotes.some((note) => triggerNotes.includes(note))
    ) {
      completeStep(); // Trigger step completion when a matching note is pressed
    }
  }, [activeNotes, triggerNotes, completeStep]);

  return <div className="max-w-full max-h-full overflow-hidden">{children}</div>;
}
