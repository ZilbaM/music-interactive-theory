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
  const [activeNotes, setActiveNotes] = useState([]); // Maintained here
  const [highlightedNotes, setHighlightedNotes] = useState([]); // Also maintained here

  const handleCalibrationComplete = (data) => {
    setCalibrationData(data);
  };

  // Define projection surface size
  const projectionWidth = 88; // Example width in arbitrary units
  const projectionHeight = 33; // Example height in arbitrary units

  return (
    <MIDIProvider>
      {!calibrationData ? (
        <Calibration onCalibrationComplete={handleCalibrationComplete} />
      ) : (
        <>
          <PerspectiveTransform>
            <NoteNotationLesson
              calibrationData={calibrationData}
              activeNotes={activeNotes} // Pass activeNotes down
              setActiveNotes={setActiveNotes} // Pass setter down
              setHighlightedNotes={setHighlightedNotes}
              width={projectionWidth}
              height={projectionHeight}
            />
          </PerspectiveTransform>
          <PerspectiveTransform>
            <VirtualKeyboard
              firstNote={calibrationData.firstNote}
              lastNote={calibrationData.lastNote}
              activeNotes={activeNotes} // VirtualKeyboard sees the same activeNotes
              highlightedNotes={highlightedNotes}
            />
          </PerspectiveTransform>
        </>
      )}
    </MIDIProvider>
  );
}

export default App;
