'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import StepSequencer from '@/components/StepSequencer';

// Steps
import SingleNoteStep from '@/components/Step/SingleNoteStep';
import SequenceStep from '@/components/Step/SequenceStep';
import DelayStep from '@/components/Step/DelayStep';

// Utility functions
import {
  getAllNotesOfModRange,
  getRandomSequence,
  getNoteLetter,
} from '@/utils/notes';

// Context providers
import { useNotesContext } from '@/components/context/NotesContext';
import { useCalibrationContext } from '@/components/context/CalibrationContext';

// UI Components
import FlickerText from '@/components/UI/FlickerText';
import { Midi, Note } from 'tonal';

export default function NoteNotationLessonPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { highlightedNotes, setHighlightedNotes } = useNotesContext();
  const { calibrationData } = useCalibrationContext();

  // Safely destructure firstNote / lastNote (defaults if undefined)
  const firstNote = calibrationData?.firstNote ?? 48; // fallback to C2
  const lastNote = calibrationData?.lastNote ?? 72;  // fallback to C4

  // Generate random sequence for exercise
  const generateRandomSequence = () => {
    return getRandomSequence(3); // 3 random mod values in [0..11]
  };

  const [exerciseSequence, setExerciseSequence] = useState(generateRandomSequence());

  // Step logic for highlighting certain notes
  const highlightC = useCallback(() => {
    setHighlightedNotes(getAllNotesOfModRange(firstNote, lastNote, 0));
  }, [firstNote, lastNote, setHighlightedNotes]);

  const highlightD = useCallback(() => {
    setHighlightedNotes(getAllNotesOfModRange(firstNote, lastNote, 2));
  }, [firstNote, lastNote, setHighlightedNotes]);

  const clearHighlights = useCallback(() => {
    setHighlightedNotes([]);
  }, [setHighlightedNotes]);

  const steps = useMemo(() => [
    // Step 1: Welcome
    <DelayStep
      key="welcome"
      delay={3000}
      onEnter={() => {
        clearHighlights();
      }}
      onExit={clearHighlights}
      completeStep={() => {
      }}
    >
      <h2 className="text-xl font-semibold">Welcome to the Note Notation Lesson!</h2>
      <p className="mt-2 text-gray-700">
        In this lesson, we'll explore the names of the white keys: C, D, E, F, G, A, B.
      </p>
    </DelayStep>,

    // Step 2: Press a C note
    <SingleNoteStep
      key="pressC"
      triggerNote={Midi.toMidi("C3")} 
      anyOctave={true}
      onEnter={() => {
        console.log('Step 2: Press a C note');
        highlightC();
      }}
      onExit={clearHighlights}
      completeStep={() => {
        console.log('C note pressed');
      }}
    >
      <h2 className="text-xl font-semibold">Press a C Note</h2>
      <p className="mt-2 text-gray-700">
        I've highlighted all C notes in your range. Press any C now.
      </p>
    </SingleNoteStep>,

    // Step 3: Play C->E->G in sequence
    <SequenceStep
      key="playCtoG"
      triggerNotes={["C", "E", "G"].map((note) => Midi.toMidi(`${note}3`))}
      progressTexts={["C", "E", "G"]}
      ordered={true}
      anyOctave={true}
      resetOnMistake={true}
      onEnter={() => {
        console.log('Step 3: Play C->E->G in sequence');
        setHighlightedNotes(getAllNotesOfModRange(firstNote, lastNote, 0).concat(
          getAllNotesOfModRange(firstNote, lastNote, 4),
          getAllNotesOfModRange(firstNote, lastNote, 7)
        ));
      }}
      onExit={clearHighlights}
      completeStep={() => {
        console.log('C->G sequence complete');
      }}
    >
      <h2 className="text-xl font-semibold">Play C, E and G in Order</h2>
      <p className="mt-2 text-gray-700">
        Try pressing these 3 notes in ascending order. If you press a wrong note, try again!
      </p>
    </SequenceStep>,

    // Step 4: Completion
    <DelayStep
      key="completion"
      delay={2000}
      onEnter={() => {
        console.log('Step 4: Completion');
        clearHighlights();
      }}
      onExit={clearHighlights}
      completeStep={() => {
        console.log('Lesson Complete');
      }}
    >
      <h2 className="text-xl font-semibold">Excellent!</h2>
      <p className="mt-2 text-green-600">
        You've completed the sequence. Keep exploring and have fun!
      </p>
    </DelayStep>,
  ], [
    firstNote,
    lastNote,
    clearHighlights,
    highlightC,
    highlightD,
  ]);

  return (
    <div className="w-full flex flex-col justify-center mx-auto p-6">
      <StepSequencer
        steps={steps}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
