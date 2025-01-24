'use client'
import React, { useState, useEffect } from 'react';
import BaseStep from '../';
import { useMIDIContext } from '@/components/context/MIDIContext';

export default function ExerciseStep({
  completeStep,
  onEnter,
  onExit,
  children,
  sequence = [], // Array of MIDI note numbers or mod values
}) {
  const { addMIDIListener, removeMIDIListener } = useMIDIContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNoteOn = (event) => {
    const noteNumber = event.note.number;
    if (noteNumber === sequence[currentIndex]) {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= sequence.length) {
          completeStep();
        }
        return nextIndex;
      });
    }
  };

  useEffect(() => {
    if (sequence.length > 0) {
      addMIDIListener('noteon', handleNoteOn);
    }

    return () => {
      if (sequence.length > 0) {
        removeMIDIListener('noteon', handleNoteOn);
      }
    };
  }, [addMIDIListener, removeMIDIListener, sequence, currentIndex]);

  return (
    <BaseStep completeStep={completeStep} onEnter={onEnter} onExit={onExit}>
      {children}
      <div>
        <p>
          Progress: {currentIndex} / {sequence.length}
        </p>
      </div>
    </BaseStep>
  );
}
