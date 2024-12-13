// src/Lessons/NoteNotationLesson.js
import React, { useEffect, useState, useContext } from 'react';
import { Note } from 'tonal';
import { MIDIContext } from '../Context/MIDIContext';
import Container from '../Components/UI/Container';
import Text from '../Components/UI/Text';

function NoteNotationLesson({ calibrationData }) {
  const { addMidiListener, removeMidiListener } = useContext(MIDIContext);

  const { firstNote, lastNote } = calibrationData;
  const backKey = firstNote; // Lowest key as Back
  const nextKey = lastNote; // Highest key as Next
  const [currentStep, setCurrentStep] = useState(0);
  const [activeNotes, setActiveNotes] = useState([]);
  const [noteCount, setNoteCount] = useState({});

  const steps = [
    <Text key="step1">
      Welcome to the Note Notation Lesson! Press the highest key to proceed.
    </Text>,
    <Text key="step2">
      This is the note C. Find and press the C note on your piano.
    </Text>,
    <Text key="step3">Great job! You&apos;ve found the C note.</Text>,
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateNoteCount = (note) => {
    setNoteCount((prevCounts) => {
      const updatedCounts = { ...prevCounts };
      updatedCounts[note] = (updatedCounts[note] || 0) + 1;
      return updatedCounts;
    });
  };

  const isNote = (noteNumber, toCompare) => {
    const midiNote = Note.fromMidi(noteNumber);
    const chroma = Note.chroma(midiNote);
    const targetChroma = Note.chroma(Note.get(toCompare));
    console.log(
      `Note MIDI: ${midiNote}, Chroma: ${chroma}, Target Chroma: ${targetChroma}`
    );
    return chroma === targetChroma;
  };

  const PlaygroundCompareNote = (note, noteToCompare) => {
    if (currentStep === 1 && isNote(note, noteToCompare)) {
      setNoteCount((prevCounts) => {
        const updatedCounts = { ...prevCounts };
        updatedCounts[noteToCompare] = (updatedCounts[noteToCompare] || 0) + 1;
        if (updatedCounts[noteToCompare] > 3) {
          handleNext();
        }

        return updatedCounts;
      });
    }
  };

  useEffect(() => {
    const handleNoteOn = (event) => {
      const note = event.note.number;
      if (note === backKey) {
        handleBack();
      } else if (note === nextKey) {
        handleNext();
      } else {
        // Handle musical input
        setActiveNotes((prev) => [...prev, note]);
        PlaygroundCompareNote(note, 'C');
      }
    };

    const handleNoteOff = (event) => {
      const note = event.note.number;
      setActiveNotes((prev) => prev.filter((n) => n !== note));
    };

    addMidiListener('noteon', 'all', handleNoteOn);
    addMidiListener('noteoff', 'all', handleNoteOff);

    return () => {
      removeMidiListener('noteon', 'all', handleNoteOn);
      removeMidiListener('noteoff', 'all', handleNoteOff);
    };
  }, [addMidiListener, removeMidiListener, backKey, nextKey, currentStep]);

  return <Container>{steps[currentStep]}</Container>;
}

export default NoteNotationLesson;
