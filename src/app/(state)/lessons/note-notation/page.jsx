'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import StepSequencer from '@/components/StepSequencer';

// Specialized Steps
import ManualStep from '@/components/Step/ManualStep';
import ChordStep from '@/components/Step/ChordStep';
import TimeStep from '@/components/Step/TimeStep';
import ExerciseStep from '@/components/Step/ExerciseStep';

// Utility functions
import { getAllNotesOfModRange, getRandomSequence, getNoteName } from '@/utils/notes';

// Context providers
import { useNotesContext } from '@/components/context/NotesContext';
import { useCalibrationContext } from '@/components/context/CalibrationContext';

export default function NoteNotationLessonPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {highlightedNotes, setHighlightedNotes} = useNotesContext();
  const {calibrationData: {firstNote, lastNote}} = useCalibrationContext();
  
  const backKey = firstNote;
  const nextKey = lastNote;


  // Generate random sequence for exercise
  const generateRandomSequence = () => {
    const randomMods = getRandomSequence(3); // Generates 3 random mod values [0-11]
    return randomMods;
  };

  const [exerciseSequence, setExerciseSequence] = useState(generateRandomSequence());

  // Define the steps
  const steps = useMemo(() => [
    // Step 1: Welcome - ManualStep waiting for highest key or button
    <ManualStep
      key="welcome"
      triggerNote={nextKey}
    >
      <h2 className="text-xl font-semibold">Welcome to the Note Notation Lesson!</h2>
      <p className="mt-2 text-gray-700">Press the highest key or click the button below to continue.</p>
    </ManualStep>,

    // Step 2: Introduction - ManualStep
    <ManualStep
      key="intro"
      triggerNote={nextKey}
    >
      <h2 className="text-xl font-semibold">Introduction to Notes</h2>
      <p className="mt-2 text-gray-700">
        Notes are named A, B, C, D, E, F, G. After G, it loops back to A.
      </p>
      <p className="mt-2 text-blue-600">Press the highest key to continue.</p>
    </ManualStep>,

    // Step 3: Press a C note - ChordStep for single note
    <ChordStep
      key="pressC"
      requiredNotes={[]} // Empty array since we're checking any single C note
      simultaneous={false} // Any single C note
      completeStep={() => {
        // Feedback handled within the step
      }}
    >
      <h2 className="text-xl font-semibold">Press a C Note</h2>
      <p className="mt-2 text-gray-700">Let's look at the note C. I've highlighted all C notes.</p>
      <p className="mt-2 text-blue-600">Press a C note now.</p>
    </ChordStep>,

    // Step 4: Feedback - TimeStep to display "Good job!"
    <TimeStep
      key="goodJob"
      delay={1000}
      onEnter={() => {
        // Optionally do something on enter
      }}
      onExit={() => {
        // Cleanup if needed
      }}
    >
      <h2 className="text-xl font-semibold">Good Job!</h2>
      <p className="mt-2 text-green-600">You've pressed a C note correctly.</p>
    </TimeStep>,

    // Step 5: Press a D note - ChordStep for single note
    <ChordStep
      key="pressD"
      requiredNotes={[]} // Empty array since we're checking any single D note
      simultaneous={false} // Any single D note
      completeStep={() => {
        // Feedback handled within the step
      }}
    >
      <h2 className="text-xl font-semibold">Press a D Note</h2>
      <p className="mt-2 text-gray-700">I've highlighted D notes now.</p>
      <p className="mt-2 text-blue-600">Press a D note now.</p>
    </ChordStep>,

    // Step 6: Explanation - ManualStep
    <ManualStep
      key="explanation"
      triggerNote={nextKey}
    >
      <h2 className="text-xl font-semibold">Understanding Notes</h2>
      <p className="mt-2 text-gray-700">
        Great! Notes go C, D, E, F, G, A, B, then back to a higher C.
      </p>
      <p className="mt-2 text-blue-600">
        Experiment with the notes and their notation. When you are ready for an exercise, press the highest key.
      </p>
    </ManualStep>,

    // Step 7: Exercise - ExerciseStep with random sequence
    <ExerciseStep
      key="exercise"
      sequence={exerciseSequence}
      onEnter={() => {
        // Optionally display the sequence or provide instructions
        console.log('Exercise sequence:', exerciseSequence.map(getNoteName).join(', '));
      }}
    >
      <h2 className="text-xl font-semibold">Exercise Time</h2>
      <p className="mt-2 text-gray-700">
        I'll pick 3 random notes. Play them in order. Once done, the lesson ends.
      </p>
      <p className="mt-2 text-blue-600">
        Sequence to play: {exerciseSequence.map(getNoteName).join(' → ')}
      </p>
    </ExerciseStep>,

    // Step 8: Completion - ManualStep
    <ManualStep
      key="completed"
      triggerNote={nextKey}
    >
      <h2 className="text-xl font-semibold">Excellent!</h2>
      <p className="mt-2 text-green-600">You've completed the sequence. Keep exploring and have fun!</p>
    </ManualStep>,
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
