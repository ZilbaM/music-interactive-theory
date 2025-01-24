'use client';

import React, { useState, useCallback, useMemo } from 'react';
import StepSequencer from '@/components/StepSequencer';

// Specialized Steps
import ManualStep from '@/components/Step/ManualStep';
import ChordStep from '@/components/Step/ChordStep';
import TimeStep from '@/components/Step/TimeStep';
import ExerciseStep from '@/components/Step/ExerciseStep';

// Utility functions
import { getAllNotesOfModRange, getRandomSequence, getNoteName } from '@/utils/notes';
import { useGlobalState } from '@/components/context/GlobalStateContext';

export default function NoteNotationLessonPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {highlightedNotes, setHighlightedNotes} = useGlobalState();

  const firstNote = 48; // C2
  const lastNote = 72; // C4
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
  
  console.log("Mounting NoteNotationLessonPage");

  return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Note Notation Lesson</h1>
        <StepSequencer
          steps={steps}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className={`px-4 py-2 bg-gray-300 rounded ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
            }`}
          >
            Back
          </button>
          <button
            onClick={() => setCurrentIndex((i) => (i < steps.length - 1 ? i + 1 : i))}
            disabled={currentIndex >= steps.length - 1}
            className={`px-4 py-2 bg-blue-300 rounded ${
              currentIndex >= steps.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400'
            }`}
          >
            Next
          </button>
        </div>
      </div>
  );
}
