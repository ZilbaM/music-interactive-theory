// src/Lessons/NoteNotationLesson.js
import React, { useEffect, useState, useContext } from 'react';
import { MIDIContext } from '../Context/MIDIContext';
import Container from '../Components/UI/Container';
import Text from '../Components/UI/Text';
import LoadingBar from '../Components/UI/LoadingBar';

function NoteNotationLesson({ calibrationData }) {
  const { addMidiListener, removeMidiListener } = useContext(MIDIContext);

  const { firstNote, lastNote } = calibrationData;
  const backKey = firstNote; // Lowest key as Back
  const nextKey = lastNote; // Highest key as Next
  const [currentStep, setCurrentStep] = useState(0);
  const [activeNotes, setActiveNotes] = useState([]);
  const [progress, setProgress] = useState(0); // LoadingBar progress
  const stepDuration = 5000;
  let timer = null;

  const steps = [
    {
      content: (
        <Text key="step1">
          Welcome to the Note Notation Lesson! Press the highest key to proceed.
        </Text>
      ),
      settings: {
        autoAdvance: false,
      },
    },
    {
      content: (
        <Text key="step2">
          This is the note C. Find and press the C note on your piano.
        </Text>
      ),
      settings: {
        autoAdvance: false,
      },
    },
    {
      content: (
        <Text key="step3">Great job! You&apos;ve found the C note.</Text>
      ),
      settings: {
        autoAdvance: true,
      },
    },
    {
      content: <Text key="step4">The end of the lesson</Text>,
      settings: {
        autoAdvance: false,
      },
    },
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

  const startTimer = () => {
    if (!steps[currentStep].settings.autoAdvance) return; // no timer is set if autoAdvance is false

    let timeElapsed = 0;
    timer = setInterval(() => {
      timeElapsed += 100; // Update every 100ms
      setProgress((timeElapsed / stepDuration) * 100);

      if (timeElapsed >= stepDuration) {
        clearInterval(timer);
        handleNext(); // If the timer is passed then the steps go on
      }
    }, 100);
  };

  const resetTimer = () => {
    clearInterval(timer);
    setProgress(0);
  };

  const isNoteC = (noteNumber) => noteNumber % 12 === 0;

  useEffect(() => {
    startTimer();
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
          handleNext();
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
      resetTimer();
    };
  }, [addMidiListener, removeMidiListener, backKey, nextKey, currentStep]);

  return (
    <Container>
      {steps[currentStep].content}
      {steps[currentStep].settings.autoAdvance && (
        <LoadingBar progress={progress} color="#4caf50" />
      )}
    </Container>
  );
}

export default NoteNotationLesson;
