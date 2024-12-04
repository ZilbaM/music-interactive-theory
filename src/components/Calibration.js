// src/Components/Calibration.js
import React, { useEffect, useState, useContext } from 'react';
import { MIDIContext } from '../Context/MIDIContext';
import Container from './UI/Container';
import Text from './UI/Text';

function Calibration({ onCalibrationComplete }) {
  const { addMidiListener, removeMidiListener } = useContext(MIDIContext);
  const [step, setStep] = useState(1);
  const [firstNote, setFirstNote] = useState(null);
  const [lastNote, setLastNote] = useState(null);

  useEffect(() => {
    const handleNoteOn = (event) => {
      const note = event.note.number;

      if (step === 1) {
        setFirstNote(note);
        setStep(2);
      } else if (step === 2) {
        setLastNote(note);
        onCalibrationComplete({ firstNote, lastNote: note });
      }
    };

    addMidiListener('noteon', 'all', handleNoteOn);

    return () => {
      removeMidiListener('noteon', 'all', handleNoteOn);
    };
  }, [addMidiListener, removeMidiListener, step, onCalibrationComplete]);

  return (
    <Container>
      <Text size="24px" margin="20px 0">
        Calibration
      </Text>
      {step === 1 && (
        <Text>
          Please press the <strong>lowest</strong> key on your MIDI piano.
        </Text>
      )}
      {step === 2 && (
        <Text>
          Please press the <strong>highest</strong> key on your MIDI piano.
        </Text>
      )}
    </Container>
  );
}

export default Calibration;
