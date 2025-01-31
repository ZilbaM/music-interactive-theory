"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
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
    getRandomSequence(3, [0, noteLetters.length - 1]).map((index) => {
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

      setHighlightedNotes((prev) => {
        return { ...prev, ...newHighlightValue };
      });
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

        setContentNotes((prev) => {
          return { ...prev, ...newContentValue };
        });
      }
    },
    [firstNote, lastNote, setContentNotes]
  );

  const addNextIcon = useCallback(() => {
    const newContentValue = {};
    newContentValue[lastNote] = "→";
    setContentNotes((prev) => {
      return { ...prev, ...newContentValue };
    });
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
    setHighlightedNotes((prev) => {
      return { ...prev, ...newHighlightValue };
    });
  });

  const clearContent = useCallback(() => {
    setContentNotes({});
  }, [setContentNotes]);

  const highlightSingleNote = useCallback(
    (note, className = " bg-highlights") => {
      const newHighlightValue = {};
      newHighlightValue[note] = className;
      setHighlightedNotes((prev) => {
        return { ...prev, ...newHighlightValue };
      });
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
          clearHighlights();
        }}
        triggerNote={lastNote}
        completeStep={() => {}}
      >
        <h2 className="text-xl font-semibold">Welcome</h2>
        <p className="mt-2 text-center  text-gray-700">
          Welcome to the Note Notation Lesson! 🎹 In this lesson, you'll learn
          the names of the white keys on the piano and how they repeat across
          octaves. Don't worry about making mistakes—I’ll guide you through step
          by step!
        </p>
        <FlickerText>Press the rightmost key to continue.</FlickerText>
      </SingleNoteStep>,
      <SingleNoteStep
        key="welcome2"
        onEnter={() => {
          addNoteLetters(["A", "B", "C", "D", "E", "F", "G"]);
          highlightNotes([9]);
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
        The <span className="font-bold">white keys</span> on a piano are named using the letters <span className="font-bold">A, B, C, D, E, F, and G</span>. After G, the pattern starts over from A.
        <br />
        <br />
        This repeating sequence is fundamental to understanding music notation.
Now, let’s highlight these notes so you can see them clearly.
        </p>
        <FlickerText>Press the rightmost key to continue.</FlickerText>
      </SingleNoteStep>,
      <SingleNoteStep
        key="pressD"
        triggerNote={Midi.toMidi("D3")}
        anyOctave={true}
        onEnter={() => {
          addNoteLetters(["D"]);
          highlightNotes([2]);
        }}
        onExit={() => {
          clearContent();
          clearHighlights();
        }}
        completeStep={() => {}}
      >
        <p className="mt-2 text-center text-gray-700">
          Let's take a closer look at a specific note: <span className="font-bold">D</span>.
          <br />
          Notice that every <span className="font-bold">D</span> key looks the same on the keyboard—it’s always positioned between the two black keys in a set of three.
        </p>
          <FlickerText>Press any <span className="font-bold">D</span> key to continue.</FlickerText>
      </SingleNoteStep>,
      <SingleNoteStep
        key="octaves"
        onEnter={() => {
          highlightSingleNote(lastNote, " bg-hint");
          colorOctaves();
          addNextIcon();
        }}
        onExit={() => {
          clearHighlights();
          clearContent();
        }}
        triggerNote={lastNote}
        completeStep={() => {}}
      >
        <p className="mt-2 text-center text-gray-700">
        A <span className="font-bold">piano keyboard is organized into repeating groups of 12 notes</span>—we call these groups <span className="font-bold">octaves</span>.
          <br />
          If you play a C, D, or E in one octave, you'll find that the same notes exist in other octaves, but they sound higher or lower. 
          <br />
          To help you visualize this, I’ve highlighted each octave in a different color.
        </p>
        <FlickerText>Press the rightmost key to continue.</FlickerText>
      </SingleNoteStep>,
      <SingleNoteStep
        key="octaves2"
        onEnter={() => {
          addNoteLetters(["A"]);
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
        <p className="text-justify mx-auto text-gray-700">
        When you play the same note in different octaves, the pitch changes, but the note keeps its identity.
          <br />
          <br />
          Think of how different singers can sing the same song at higher or lower pitches—it's still the same song!
          Musically, a note played one octave higher has exactly double the frequency of the lower one.
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
          Now, let’s try playing a simple sequence:
          <br />
          <span className="font-bold">C → E → G</span>
          These notes are part of a basic chord. You can play them in any octave, but make sure you play them in the correct order.
          <br />
          Try playing them now!
        </p>
      </SequenceStep>,
      <SequenceStep
        key="playScale"
        triggerNotes={["C", "D", "E", "F", "G", "A", "B"].map((note) =>
          Midi.toMidi(`${note}3`)
        )}
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
          Now that you know the note names, let’s play every white key in one octave:
          <br />
          <span className="font-bold">C → D → E → F → G → A → B</span>
          <br />
          These seven notes complete an octave, after which the pattern repeats.
          <br />
          I’ve colored each octave differently to help you see this pattern.
        </p>
        <FlickerText>Press each key in order to continue.</FlickerText>
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
        You're doing great! Now, let's test your knowledge.
        <br />
        <br />
        I will show you a note, and you have to find and play it without any hints.
        Take your time, and remember what you’ve learned so far.
        </p>
        <FlickerText>
        Press the rightmost key when you’re ready to start.
        </FlickerText>
      </SingleNoteStep>,
      ...randomSequence.current.map((note, index) => (
        <SingleNoteStep
          key={`note-${index}`}
          triggerNote={note.midi}
          anyOctave={true}
          completeStep={() => {}}
        >
          <p className="mt-2 text-center text-gray-700">
            Find a{" "}
            <span className="font-bold text-blue-700">{note.letter}</span>!
          </p>
          <FlickerText>Find and play the note {note.letter} anywhere on the keyboard!</FlickerText>
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
          clearHighlights();
          clearContent();
        }}
        completeStep={() => {
          setCurrentIndex(0);
        }}
      >
        <h2 className="text-xl font-semibold">🎉 Well done! You’ve completed the lesson.!</h2>
        <p className="mt-2 text-center text-green-600">
          You now understand how notes are named, how octaves work, and how to recognize notes across the keyboard.
        </p>
        <FlickerText>
          Press the rightmost key to restart the lesson.
        </FlickerText>
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
