// src/Lessons/NoteNotationLesson.js
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { MIDIContext } from '../Context/MIDIContext';
import Container from '../Components/UI/Container';
import Text from '../Components/UI/Text';
import LoadingBar from '../Components/UI/LoadingBar';

function NoteNotationLesson({
  calibrationData,
  setActiveNotes,
  setHighlightedNotes,
  width,
  height,
}) {
  const { addMidiListener, removeMidiListener } = useContext(MIDIContext);
  const { firstNote, lastNote } = calibrationData;

  const backKey = firstNote; // Navigation keys
  const nextKey = lastNote;

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0); // For auto-advance steps
  const stepDuration = 5000; // Time for auto-advance steps
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

  const isNoteC = (noteNumber) => noteNumber % 12 === 0;

  const startTimer = () => {
    if (!steps[currentStep].settings.autoAdvance) return;

    let timeElapsed = 0;
    timer = setInterval(() => {
      timeElapsed += 100; // Update every 100ms
      setProgress((timeElapsed / stepDuration) * 100);

      if (timeElapsed >= stepDuration) {
        clearInterval(timer);
        handleNext();
      }
    }, 100);
  };

  const resetTimer = () => {
    if (timer) clearInterval(timer);
    setProgress(0);
  };

  useEffect(() => {
    // Highlight logic based on steps:
    if (currentStep === 1) {
      // Highlight all C notes in the range:
      const cNotes = [];
      for (let n = firstNote; n <= lastNote; n += 1) {
        if (isNoteC(n)) cNotes.push(n);
      }
      setHighlightedNotes(cNotes);
    } else {
      // Clear highlights otherwise
      setHighlightedNotes([]);
    }
  }, [currentStep, firstNote, lastNote, setHighlightedNotes]);

  useEffect(() => {
    startTimer();

    const handleNoteOn = (event) => {
      const note = event.note.number;

      // Navigation keys:
      if (note === backKey) {
        handleBack();
      } else if (note === nextKey) {
        handleNext();
      }

      // Track active notes:
      setActiveNotes((prev) => [...prev, note]);

      // Step-specific logic:
      if (currentStep === 1 && isNoteC(note)) {
        handleNext();
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
  }, [
    addMidiListener,
    removeMidiListener,
    backKey,
    nextKey,
    currentStep,
    setActiveNotes,
  ]);

  // Lets compute the width and height ratio;
  const aspectRatio = width / height;

  const SurfaceWrapper = styled.div`
    aspect-ratio: ${aspectRatio};
    width: 100%;
    overflow: hidden;
  `;

  return (
    <SurfaceWrapper>
      <Container>
        {steps[currentStep].content}
        {steps[currentStep].settings.autoAdvance && (
          <LoadingBar progress={progress} color="#4caf50" />
        )}
      </Container>
    </SurfaceWrapper>
  );
}

export default NoteNotationLesson;
