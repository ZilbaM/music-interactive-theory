// src/Lessons/NoteNotationLesson.js
import React, { useEffect, useState, useContext } from 'react';
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

  const isNoteC = (noteNumber) => noteNumber % 12 === 0;

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

        // For specific steps, check if the correct note is played
        if (currentStep === 1 && isNoteC(note)) {
          setCurrentStep((prev) => prev + 1);
        }
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
