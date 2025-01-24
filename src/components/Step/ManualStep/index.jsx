"use client";
import React, { useEffect } from "react";
import BaseStep from "../";
import { useMIDIContext } from "@/components/context/MIDIContext";

export default function ManualStep({
  completeStep,
  onEnter,
  onExit,
  children,
  triggerNote, // MIDI note number to trigger completion
}) {
  const { addMidiListener, removeMidiListener } = useMIDIContext();

  useEffect(() => {
    const handleNoteOn = (event) => {
      const noteNumber = event.note.number;
      if (noteNumber === triggerNote) {
        completeStep();
      }
    };

    if (triggerNote !== undefined) {
      console.log("Manual Step adding listener to note " + triggerNote);
      addMidiListener("noteon", handleNoteOn);
    }

    return () => {
      if (triggerNote !== undefined) {
        console.log("Manual Step removing listener to note " + triggerNote);
        removeMidiListener("noteon", handleNoteOn);
      }
    };
  }, []);

  return (
    <BaseStep completeStep={completeStep} onEnter={onEnter} onExit={onExit}>
      {children}
      <div className="mt-4">
        <button
          onClick={completeStep}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Click to Continue
        </button>
      </div>
    </BaseStep>
  );
}
