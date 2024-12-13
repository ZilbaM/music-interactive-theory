// src/Lessons/NoteNotationLesson.js
import React, { useEffect, useState, useContext } from 'react';
import { MIDIContext } from '../Context/MIDIContext';
import Container from '../Components/UI/Container';
import Text from '../Components/UI/Text';

function NoteIdentificationLesson({ calibrationData }) {
  const { addMidiListener, removeMidiListener } = useContext(MIDIContext);

  const { firstNote, lastNote } = calibrationData;
  const backKey = firstNote; // Lowest key as Back
  const nextKey = lastNote; // Highest key as Next
  const [currentStep, setCurrentStep] = useState(0);
  const [activeNotes, setActiveNotes] = useState([]);
  const { playNote } = useContext(MIDIContext);

  const steps = [
    <Text key="step1">
      Welcome to the Note Identification Lesson! Press the highest key to
      proceed.
    </Text>,
    <Text key="step2">
      Close your eyes and guess the note by clicking on it you have 3 tries.
    </Text>,
    <Text key="step3">Great job! You&apos;ve found the note.</Text>,
  ];

  const handlePlayNote = () => {
    let notetoplay = 0;
    playNote(
      (notetoplay = Math.floor(
        Math.random() * (lastNote - firstNote) + firstNote
      )),
      20,
      500,
      1
    );
    return notetoplay;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
    if (currentStep === steps.length - 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  useEffect(() => {
    let playedNote = 0;
    const handleNoteOn = (event) => {
      const note = event.note.number;

      if (note === backKey) {
        handleBack();
      } else if (note === nextKey) {
        handleNext();
      } else {
        // Handle musical input
        setActiveNotes((prev) => [...prev, note]);

        if (currentStep === 1) {
          console.log('in the if currentStep === 1');
          playedNote = handlePlayNote();
          if (playedNote === note) {
            handleNext();
          }
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

export default NoteIdentificationLesson;
