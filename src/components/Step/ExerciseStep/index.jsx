'use client'
import React, { useState, useEffect } from 'react';
import BaseStep from '../';
import { useMIDIContext } from '@/components/context/MIDIContext';
import { useNotesContext } from '@/components/context/NotesContext';

export default function ExerciseStep({
  completeStep,
  onEnter,
  onExit,
  children,
  sequence = [], // Array of MIDI note numbers or mod values
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { activeNotes } = useNotesContext();

  useEffect(() =>{
    if (activeNotes.includes(sequence[currentIndex])) {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= sequence.length) {
          completeStep();
        }
        return nextIndex;
      });
    }
  }, [activeNotes])

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
