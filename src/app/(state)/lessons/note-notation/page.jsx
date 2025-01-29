"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
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
import { redirect } from "next/dist/server/api-utils";

export default function NoteNotationLessonPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setHighlightedNotes, setContentNotes } = useNotesContext();
  const { calibrationData } = useCalibrationContext();

  // Safely destructure firstNote / lastNote (defaults if undefined)
  const firstNote = calibrationData.firstNote ?? 48; // fallback to C2
  const lastNote = calibrationData.lastNote ?? 72; // fallback to C4
  const noteLetters = ["C", "D", "E", "F", "G", "A", "B"];

  const randomSequence = useRef(
    getRandomSequence(3, [0, noteLetters.length - 1]).map(index => {
      const noteName = noteLetters[index]; // Pick letter correctly
      const octave = Note.octave(Note.fromMidi(firstNote)); // Keep it in the correct octave
      const midiNote = Note.midi(`${noteName}${octave}`);
  
      console.log("Generated MIDI Note:", midiNote, "Letter:", noteName);
      return { midi: midiNote, letter: noteName }; // Store both for use later
    })
  );
  
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
          newHighlightValue[note] = className;
        });
      });

      setHighlightedNotes((prev) => {return {...prev, ...newHighlightValue}});
    },
    [firstNote, lastNote, setHighlightedNotes]
  );

  const addNoteLetters = useCallback(
    (letters) => {
      if (letters.length > 0) {
        const newContentValue = {};
        const firstOctave = Note.octave(Note.fromMidi(firstNote));
        const lastOctave = Note.octave(Note.fromMidi(lastNote));

        letters.forEach((letter) => {
          for (let octave = firstOctave; octave <= lastOctave; octave++) {
            newContentValue[Note.midi(`${letter}${octave}`)] = letter;
          }
        });

        setContentNotes((prev) => {return {...prev, ...newContentValue}});
      }
    },
    [firstNote, lastNote, setContentNotes]
  );

  const addNextIcon = useCallback(() => {
    const newContentValue = {};
    newContentValue[lastNote] = "→";
    setContentNotes((prev) => {return {...prev, ...newContentValue}});
  }, [lastNote, setContentNotes]);

  const colorOctaves = useCallback(() => {
    const newHighlightValue = {};
    const firstOctave = Note.octave(Note.fromMidi(firstNote));
    const lastOctave = Note.octave(Note.fromMidi(lastNote));

    for (let octave = firstOctave; octave <= lastOctave; octave++) {
      const colorClass = octave % 2 === 0 ? " bg-amber-400" : " bg-emerald-400";
      ["C", "D", "E", "F", "G", "A", "B"].forEach((letter) => {
        newHighlightValue[Note.midi(`${letter}${octave}`)] = colorClass;
      });
    }
    setHighlightedNotes((prev) => {return {...prev, ...newHighlightValue}});
  });

  const clearContent = useCallback(() => {
    setContentNotes({});
  }, [setContentNotes]);

  const highlightSingleNote = useCallback(
    (note, className = " bg-highlights") => {
      const newHighlightValue = {};
      newHighlightValue[note] = className;
      setHighlightedNotes(newHighlightValue);
    },
    [setHighlightedNotes]
  );

  const clearHighlights = useCallback(() => {
    setHighlightedNotes({});
  }, [setHighlightedNotes]);

  const getChroma = (noteLetter) => Note.get(`${noteLetter}3`).chroma;
  const getChromas = (noteLetters) => noteLetters.map(getChroma);
  const steps = useMemo(
    () => [
      // Step 1: Welcome
      <SingleNoteStep
        key="welcome"
        onEnter={() => {
          clearHighlights();
          highlightSingleNote(lastNote, " bg-hint");
          addNextIcon();
        }}
        onExit={() => {
          clearContent();
          clearHighlights()
        }}
        triggerNote={lastNote}
        completeStep={() => {}}
      >
        <h2 className="text-xl font-semibold">Welcome</h2>
        <p className="mt-2 text-center  text-gray-700">
          Welcome to the Note Notation Lesson! Here, you'll learn the names of
          the piano's white keys and how they repeat across octaves. Take your
          time, and don't worry if you make mistakes—I'll guide you through!
        </p>
        <FlickerText>Press the rightmost key to continue.</FlickerText>
      </SingleNoteStep>,
      <SingleNoteStep
        key="welcome2"
        onEnter={() => {
          addNoteLetters(["A", "B", "C", "D", "E", "F", "G"]);
          highlightSingleNote(lastNote, " bg-hint");
          addNextIcon();
        }}
        onExit={() => {
          clearContent();
        }}
        triggerNote={lastNote}
        completeStep={() => {}}
      >
        <p className="mt-2 text-center text-gray-700">
          The white keys are named A, B, C, D, E, F, and G. Once you reach G, it
          starts back at A. Let’s explore this together.
        </p>
        <FlickerText>Press the rightmost key to continue.</FlickerText>
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
        <p className="mt-2 text-center text-gray-700">
          Find a D note! All D notes are highlighted for you.
        </p>
      </SingleNoteStep>,
      <SingleNoteStep
        key="octaves"
        onEnter={() => {
          colorOctaves();
          addNoteLetters(["C", "D", "E"]);
          highlightSingleNote(lastNote, " bg-hint");
          addNextIcon();
        }}
        onExit={() => {
          clearHighlights()
          clearContent();
        }}
        triggerNote={lastNote}
        completeStep={() => {}}
      >
        <p className="mt-2 text-center text-gray-700">
          Notes like C, D, and E don’t just exist once—they repeat across the
          keyboard in what we call octaves. I color separated octaves for you.
        </p>
        <FlickerText>Press the rightmost key to continue.</FlickerText>
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
        <p className="mt-2 text-center text-gray-700">
          Try pressing these 3 notes in ascending order. If you press a wrong
          note, try again!
        </p>
      </SequenceStep>,
      <SequenceStep
        key="playScale"
        triggerNotes={["C", "D", "E", "F", "G", "A", "B"].map((note) => Midi.toMidi(`${note}3`))}
        progressTexts={["C", "D", "E", "F", "G", "A", "B"]}
        ordered={true}
        anyOctave={true}
        resetOnMistake={true}
        onEnter={() => {
          colorOctaves();
        }}
        onExit={clearHighlights}
        completeStep={() => {}}
      >
        <p className="mt-2 text-center text-gray-700">
          Now that you know the names of the white keys, let’s play a simple
          scale. Start with C, then move up to D, E, F, and G.
        </p>
      </SequenceStep>,
      <SingleNoteStep
      key="exercise"
      onEnter={() => {
        colorOctaves();
        addNoteLetters(["C", "D", "E", "F", "G", "A", "B"]);
        highlightSingleNote(lastNote, " bg-hint");
        addNextIcon();
      }}
      onExit={() => {
        clearContent();
        clearHighlights();
      }}
      triggerNote={lastNote}
      completeStep={() => {}}
    >
      <p className="mt-2 text-center text-gray-700">
        Let’s test what you’ve learned! I’ll name a note, and you find it.
      </p>
      <FlickerText>Press the rightmost key when you're ready to start the exercise.</FlickerText>
    </SingleNoteStep>,
    ...randomSequence.current.map((note, index) => (
  <SingleNoteStep
    key={`note-${index}`}
    triggerNote={note.midi}
    anyOctave={true}
    completeStep={() => {}}
  >
    <p className="mt-2 text-center text-gray-700">
      Find a <span className="font-bold">{note.letter}</span>!
    </p>
  </SingleNoteStep>
)),
      // Step 4: Completion
      <SingleNoteStep
        key="completion"
        onEnter={() => {
          addNextIcon();
        }}
        triggerNote={lastNote}
        onExit={() => {
          clearHighlights()
          highlightSingleNote(lastNote, " bg-hint");
          addNextIcon();
          clearContent();
        }}
        completeStep={() => {
          redirect('/')
        }}
      >
        <h2 className="text-xl font-semibold">Excellent!</h2>
        <p className="mt-2 text-center text-green-600">
          You've completed the lesson. Thanks for learning and I hope you had fun!
        </p>
        <FlickerText>Press the rightmost key to continue.</FlickerText>
      </SingleNoteStep>,
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
