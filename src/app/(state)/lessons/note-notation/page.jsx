"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import StepSequencer from "@/components/StepSequencer";

// Steps
import SingleNoteStep from "@/components/Step/SingleNoteStep";
import SequenceStep from "@/components/Step/SequenceStep";
import DelayStep from "@/components/Step/DelayStep";

// Utility functions
import {
  getAllNotesOfModRange,
  getRandomSequence,
  noteLetters,
} from "@/utils/notes";

// Context providers
import { useNotesContext } from "@/components/context/NotesContext";
import { useCalibrationContext } from "@/components/context/CalibrationContext";

// UI Components
import { Midi, Note } from "tonal";
import StandardStep from "@/components/Step/StandardStep";
import FlickerText from "@/components/UI/FlickerText";

export default function NoteNotationLessonPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setHighlightedNotes } = useNotesContext();
  const { calibrationData } = useCalibrationContext();

  // Safely destructure firstNote / lastNote (defaults if undefined)
  const firstNote = calibrationData.firstNote ?? 48; // fallback to C2
  const lastNote = calibrationData.lastNote ?? 72; // fallback to C4

  // Refactored highlight function
  const highlightNotes = useCallback(
    (mods, className = " bg-highlights") => {
      const newHighlightValue = {};

      mods.forEach((mod) => {
        const notesToHighlight = getAllNotesOfModRange(
          firstNote,
          lastNote,
          mod
        );
        notesToHighlight.forEach((note) => {
          newHighlightValue[note] = className
        });
      });

      setHighlightedNotes(newHighlightValue);
    },
    [firstNote, lastNote, setHighlightedNotes]
  );

  const getChroma = (noteLetter) => Note.get(`${noteLetter}3`).chroma;
  const getChromas = (noteLetters) => noteLetters.map(getChroma);

  const highlightSingleNote = useCallback(
    (note, className = " bg-highlights") => {
      const newHighlightValue = {};
      newHighlightValue[note] = className;
      setHighlightedNotes(newHighlightValue);

    }, [setHighlightedNotes]
  )

  const clearHighlights = useCallback(() => {
    setHighlightedNotes({});
  }, [setHighlightedNotes]);

  const steps = useMemo(
    () => [
      // Step 1: Welcome
      <SingleNoteStep
        key="welcome"
        onEnter={() => {
          clearHighlights()
          highlightSingleNote(lastNote, " bg-hint")
        }}
        onExit={clearHighlights}
        triggerNote={lastNote}
        completeStep={() => {}}
      >
        <h2 className="text-xl font-semibold">
          Welcome to the Note Notation Lesson!
        </h2>
        <p className="mt-2 text-gray-700">
          In this lesson, we'll explore the names of the keys on the piano
        </p>
        <FlickerText>Press the rightmost key to continue.</FlickerText>
      </SingleNoteStep>,
      <SingleNoteStep
        key="pressC"
        triggerNote={Midi.toMidi("C3")}
        anyOctave={true}
        onEnter={() => {
          highlightNotes([0]);
        }}
        onExit={clearHighlights}
        completeStep={() => {}}
      >
        <h2 className="text-xl font-semibold">Press a C Note</h2>
        <p className="mt-2 text-gray-700">
          I've highlighted all C notes in your range. Press any C now.
        </p>
      </SingleNoteStep>,
      <SingleNoteStep
        key="pressD"
        triggerNote={Midi.toMidi("D3")}
        anyOctave={true}
        onEnter={() => {
          highlightNotes([2]);
        }}
        onExit={clearHighlights}
        completeStep={() => {}}
      >
        <h2 className="text-xl font-semibold">Press a D Note</h2>
        <p className="mt-2 text-gray-700">
          Great ! After C comes D. Press any D note now.
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
          highlightNotes(getChromas(["C", "E", "G"]));
        }}
        onExit={clearHighlights}
        completeStep={() => {}}
      >
        <h2 className="text-xl font-semibold">Play C, E and G in Order</h2>
        <p className="mt-2 text-gray-700">
          Try pressing these 3 notes in ascending order. If you press a wrong
          note, try again!
        </p>
      </SequenceStep>,

      // Step 4: Completion
      <StandardStep
        key="completion"
        onEnter={() => {
          clearHighlights();
        }}
        onExit={clearHighlights}
        completeStep={() => {
        }}
      >
        <h2 className="text-xl font-semibold">Excellent!</h2>
        <p className="mt-2 text-green-600">
          You've completed the sequence. Keep exploring and have fun!
        </p>
      </StandardStep>,
    ],
    [firstNote, lastNote, clearHighlights]
  );

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
