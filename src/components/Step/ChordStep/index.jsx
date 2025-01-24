'use client'
import React, { useState } from 'react';
import BaseStep from '../';
import { useMIDIContext } from '@/components/context/MIDIContext';

export default function ChordStep({
  completeStep,
  onEnter,
  onExit,
  children,
  requiredNotes = [], // Array of MIDI note numbers or mod values
  simultaneous = true, // Whether the notes need to be pressed simultaneously
}) {
  const { addMIDIListener, removeMIDIListener } = useMIDIContext();
  const [activeNotes, setActiveNotes] = useState(new Set());

  const handleNoteOn = (event) => {
    setActiveNotes((prev) => {
      const updated = new Set(prev);
      updated.add(event.note.number);
      return updated;
    });
  };

  const handleNoteOff = (event) => {
    setActiveNotes((prev) => {
      const updated = new Set(prev);
      updated.delete(event.note.number);
      return updated;
    });
  };

  useEffect(() => {
    addMIDIListener('noteon', handleNoteOn);
    addMIDIListener('noteoff', handleNoteOff);

    return () => {
      removeMIDIListener('noteon', handleNoteOn);
      removeMIDIListener('noteoff', handleNoteOff);
    };
  }, [addMIDIListener, removeMIDIListener]);

  useEffect(() => {
    if (simultaneous) {
      // Check if all required notes are active
      const allPressed = requiredNotes.every((note) => activeNotes.has(note));
      if (allPressed) {
        completeStep();
      }
    }
    // For sequential, implement additional logic as needed
  }, [activeNotes, requiredNotes, simultaneous, completeStep]);

  return (
    <BaseStep completeStep={completeStep} onEnter={onEnter} onExit={onExit}>
      {children}
      {/* Optionally display active notes or instructions */}
      <div className="mt-4">
        <p>Active Notes: {Array.from(activeNotes).join(', ')}</p>
      </div>
    </BaseStep>
  );
}
