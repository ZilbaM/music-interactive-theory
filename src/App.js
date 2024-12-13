// src/App.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { MIDIProvider } from './Context/MIDIContext';
import Calibration from './Components/Calibration';
import NoteNotationLesson from './Lessons/NoteNotationLesson';
import VirtualKeyboard from './Components/VirtualKeyboard';
import PerspectiveTransform from './Components/PerspectiveTransform';

function App() {
  const [calibrationData, setCalibrationData] = useState(null);
  const [activeNotes, setActiveNotes] = useState([]);
  const [highlightedNotes, setHighlightedNotes] = useState([]);

  const handleCalibrationComplete = (data) => {
    setCalibrationData(data);
  };

  // Define projection surface size (in any consistent unit, e.g., cm)
  const projectionWidth = 88; // Example: 30 units wide
  const projectionHeight = 33; // Example: 20 units tall

  return (
    <MIDIProvider>
      {!calibrationData ? (
        <Calibration onCalibrationComplete={handleCalibrationComplete} />
      ) : (
        <>
          <PerspectiveTransform>
            <NoteNotationLesson
              calibrationData={calibrationData}
              setActiveNotes={setActiveNotes}
              setHighlightedNotes={setHighlightedNotes}
              width={projectionWidth}
              height={projectionHeight}
            />
          </PerspectiveTransform>
          <PerspectiveTransform>
            <VirtualKeyboard
              firstNote={calibrationData.firstNote}
              lastNote={calibrationData.lastNote}
              activeNotes={activeNotes}
              highlightedNotes={highlightedNotes}
            />
          </PerspectiveTransform>
        </>
      )}
    </MIDIProvider>
  );
}

export default App;
