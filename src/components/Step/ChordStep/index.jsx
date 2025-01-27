"use client";
import React, { useEffect } from "react";
import BaseStep from "../";
import { useNotesContext } from "@/components/context/NotesContext";

export default function ChordStep({
  completeStep,
  onEnter,
  onExit,
  children,
  requiredNotes = [], // Array of MIDI note numbers or mod values
  simultaneous = true, // Whether the notes need to be pressed simultaneously
  sequenced = false, // Whether the notes need to be pressed in a specific sequence
}) {
  const { activeNotes } = useNotesContext();

  // If not simultaneous, store the pressed notes to keep track of them
  const [pressedNotes, setPressedNotes] = React.useState(new Set());

  useEffect(() => {
    if (simultaneous) {
      const allPressed = requiredNotes.every((note) =>
        activeNotes.includes(note)
      );

      if (allPressed) {
        if (sequenced) {
          // Check if all required notes are pressed in the correct sequence
          const sequenceMatch = requiredNotes.every(
            (note, index) => activeNotes[index] === note
          );
          if (sequenceMatch) {
            completeStep();
          }
        } else {
          completeStep();
        }
      }
    } else {
      // Check if any of the required notes are pressed
      const anyPressed = requiredNotes.some((note) =>
        activeNotes.includes(note)
      );
      if (anyPressed) {
        if (sequenced) {
          // Check if the next note in the sequence is pressed
          const nextNote = requiredNotes[pressedNotes.size];
          if (activeNotes.includes(nextNote)) {
            setPressedNotes((prev) => new Set([...prev, nextNote]));
            if (pressedNotes.size === requiredNotes.length) {
              completeStep();
            }
          }
        } else {
          const validNote = requiredNotes.filter((note) =>
            activeNotes.includes(note)
          );
          setPressedNotes(new Set(pressedNotes, validNote));
          if (pressedNotes.size === requiredNotes.length) {
            completeStep();
          }
        }
      }
    }
  }, [activeNotes, requiredNotes, simultaneous, completeStep]);

  return (
    <BaseStep completeStep={completeStep} onEnter={onEnter} onExit={onExit}>
      {children}
      {/* Optionally display active notes or instructions */}
      <div className="mt-4">
        <p>Active Notes: {activeNotes.join(", ")}</p>
      </div>
    </BaseStep>
  );
}
