// src/Lessons/NoteNotationLesson.js
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { MIDIContext } from '../Context/MIDIContext';
import Container from '../Components/UI/Container';
import Text from '../Components/UI/Text';

const noteLetters = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];
const getNoteName = (noteNumber) => {
  const mod = noteNumber % 12;
  return noteLetters[mod];
};

function NoteNotationLesson({
  calibrationData,
  activeNotes,
  setActiveNotes,
  setHighlightedNotes,
  width,
  height,
}) {
  const { firstNote, lastNote } = calibrationData;

  const backKey = firstNote;
  const nextKey = lastNote;

  const [currentStep, setCurrentStep] = useState(0);

  const [randomSequence, setRandomSequence] = useState([]);
  const [sequenceIndex, setSequenceIndex] = useState(0);

  const noteLettersForExercise = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const letterToMod = {
    C: 0,
    'C#': 1,
    D: 2,
    'D#': 3,
    E: 4,
    F: 5,
    'F#': 6,
    G: 7,
    'G#': 8,
    A: 9,
    'A#': 10,
    B: 11,
  };

  const isNoteC = (noteNumber) => noteNumber % 12 === 0;
  const isNoteD = (noteNumber) => noteNumber % 12 === 2;

  // Steps simplified and broken into smaller instructions
  const steps = [
    {
      content: (
        <>
          <Text key="step0">Welcome to this lesson on note notation.</Text>
          <Text style={{ marginTop: '20px', color: '#4371B1' }}>
            Press the highest key to continue.
          </Text>
        </>
      ),
      settings: { autoAdvance: false },
    },
    {
      content: (
        <>
          <Text key="step1">
            Notes are named A, B, C, D, E, F, G. After G, it loops back to A.
          </Text>
          <Text style={{ marginTop: '20px', color: '#4371B1' }}>
            Press the highest key to continue.
          </Text>
        </>
      ),
      settings: { autoAdvance: false },
    },
    {
      content: (
        <>
          <Text key="step2">
            Let's look at the note C. I've highlighted all C notes.
          </Text>
          <Text style={{ marginTop: '20px', color: '#4371B1' }}>
            Press a C note now.
          </Text>
        </>
      ),
      settings: { autoAdvance: false },
    },
    {
      content: <Text key="step3">Good job !</Text>,
      settings: { autoAdvance: false },
    },
    {
      content: (
        <>
          <Text key="step4">I've highlighted D notes now.</Text>
          <Text style={{ marginTop: '20px', color: '#4371B1' }}>
            Press a D note now.
          </Text>
        </>
      ),
      settings: { autoAdvance: false },
    },
    {
      content: (
        <>
          <Text key="step5">
            Great! Notes go C, D, E, F, G, A, B, then back to C higher.
          </Text>
          <Text style={{ marginTop: '20px', color: '#4371B1' }}>
            Experiment with the notes and their notation. When you are ready for
            an exercise, press the highest key.
          </Text>
        </>
      ),
      settings: { autoAdvance: false },
    },
    {
      content: (
        <Text key="step6">
          Exercise time: I'll pick 3 random letters (A-G). Play them in order.
          Once done, lesson ends. I've highlighted these notes for you.
        </Text>
      ),
      settings: { autoAdvance: false },
    },
    {
      content: (
        <Text key="step7">
          Excellent! You've done the sequence. Keep exploring and have fun!
        </Text>
      ),
      settings: { autoAdvance: false },
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

  useEffect(() => {
    if (currentStep === 2) {
      // Highlight all C notes
      const cNotes = [];
      for (let n = firstNote; n <= lastNote; n += 1) {
        if (isNoteC(n)) cNotes.push(n);
      }
      setHighlightedNotes(cNotes);
    } else if (currentStep === 3) {
      // Clear highlights, after short wait highlight D and move next
      setHighlightedNotes([]);
      const timeout = setTimeout(() => {
        if (currentStep === 3) {
          const dNotes = [];
          for (let n = firstNote; n <= lastNote; n += 1) {
            if (isNoteD(n)) dNotes.push(n);
          }
          setHighlightedNotes(dNotes);
          handleNext(); // Move to step 4
        }
      }, 1000);
      return () => clearTimeout(timeout);
    } else if (currentStep === 4) {
      // D notes step
      const dNotes = [];
      for (let n = firstNote; n <= lastNote; n += 1) {
        if (isNoteD(n)) dNotes.push(n);
      }
      setHighlightedNotes(dNotes);
    } else if (currentStep === 6) {
      // Generate random sequence
      const chosenLetters = [];
      for (let i = 0; i < 3; i += 1) {
        const randomLetter =
          noteLettersForExercise[
            Math.floor(Math.random() * noteLettersForExercise.length)
          ];
        chosenLetters.push(randomLetter);
      }
      setRandomSequence(chosenLetters);
      setSequenceIndex(0);

      // Highlight these notes
      const highlightNotes = [];
      for (let n = firstNote; n <= lastNote; n += 1) {
        const noteMod = n % 12;
        if (chosenLetters.some((letter) => letterToMod[letter] === noteMod)) {
          highlightNotes.push(n);
        }
      }
      setHighlightedNotes(highlightNotes);
    } else {
      setHighlightedNotes([]);
    }
  }, [currentStep, firstNote, lastNote, setHighlightedNotes]);

  const handlePressSequenceNote = (note) => {
    const currentLetter = randomSequence[sequenceIndex];
    const targetMod = letterToMod[currentLetter];
    if (note % 12 === targetMod) {
      const nextIndex = sequenceIndex + 1;
      setSequenceIndex(nextIndex);
      if (nextIndex >= randomSequence.length) {
        // Completed sequence
        handleNext(); // Move to step 7 (end)
      }
    }
  };

  const { addMidiListener, removeMidiListener } = useContext(MIDIContext);
  useEffect(() => {
    const handleNoteOn = (event) => {
      const note = event.note.number;

      // Navigation keys
      if (note === backKey) {
        handleBack();
        return;
      } else if (note === nextKey) {
        handleNext();
        return;
      }

      setActiveNotes((prev) => {
        if (!prev.includes(note)) return [...prev, note];
        return prev;
      });

      // Step logic
      if (currentStep === 2 && isNoteC(note)) {
        handleNext();
      }

      if (currentStep === 4 && isNoteD(note)) {
        handleNext();
      }

      if (currentStep === 6) {
        handlePressSequenceNote(note);
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
  }, [
    addMidiListener,
    removeMidiListener,
    backKey,
    nextKey,
    currentStep,
    setActiveNotes,
    randomSequence,
    sequenceIndex,
  ]);

  const SurfaceWrapper = styled.div`
    width: 100%;
    aspect-ratio: ${width} / ${height};
    overflow: hidden;
  `;

  const activeNoteNames = activeNotes.map((n) => getNoteName(n));
  const activeNoteText =
    activeNoteNames.length > 0 ? activeNoteNames.join(', ') : '';

  const SequenceContainer = styled.div`
    margin-top: 20px;
    font-size: 1.5rem;
    display: flex;
    gap: 10px;
  `;
  const CompletedNote = styled.span`
    color: green;
  `;
  const PendingNote = styled.span`
    color: black;
  `;

  let sequenceDisplay = null;
  if (currentStep === 6 && randomSequence.length > 0) {
    sequenceDisplay = (
      <SequenceContainer>
        {randomSequence.map((letter, i) => {
          if (i < sequenceIndex) {
            // Already played this note
            return <CompletedNote key={letter}>{letter}</CompletedNote>;
          } else {
            return <PendingNote key={letter}>{letter}</PendingNote>;
          }
        })}
      </SequenceContainer>
    );
  }

  return (
    <SurfaceWrapper>
      <Container>
        {steps[currentStep].content}
        {sequenceDisplay && sequenceDisplay}
        <Text style={{ marginTop: '20px', fontSize: '2rem' }}>
          {activeNoteText}
        </Text>
      </Container>
    </SurfaceWrapper>
  );
}

export default NoteNotationLesson;
