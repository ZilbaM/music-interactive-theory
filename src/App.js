// src/App.js
import React, { useState } from 'react';
import { MIDIProvider } from './Context/MIDIContext';
import Calibration from './Components/Calibration';
import NoteNotationLesson from './Lessons/NoteNotationLesson';
import VirtualKeyboard from './Components/VirtualKeyboard';

function App() {
  const [calibrationData, setCalibrationData] = useState(null);
  const [activeNotes, setActiveNotes] = useState([]);

  const handleCalibrationComplete = (data) => {
    setCalibrationData(data);
  };

  return (
    <MIDIProvider>
      {!calibrationData ? (
        <Calibration onCalibrationComplete={handleCalibrationComplete} />
      ) : (
        <>
          <NoteNotationLesson
            calibrationData={calibrationData}
            setActiveNotes={setActiveNotes}
          />
          <VirtualKeyboard
            firstNote={calibrationData.firstNote}
            lastNote={calibrationData.lastNote}
            activeNotes={activeNotes}
          />
        </>
      )}
    </MIDIProvider>
  );
}

export default App;
