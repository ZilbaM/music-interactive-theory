// src/App.js
import React, { useState } from 'react';
import { MIDIProvider } from './Context/MIDIContext';
import Calibration from './Components/Calibration';
import NoteNotationLesson from './Lessons/NoteNotationLesson';
import NoteIdentificationLesson from './Lessons/NoteIdentificationLesson';
import VirtualKeyboard from './Components/VirtualKeyboard';
import PerspectiveTransform from './Components/PerspectiveTransform';

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
          <NoteIdentificationLesson
            calibrationData={calibrationData}
            setActiveNotes={setActiveNotes}
          />
          <PerspectiveTransform>
            <VirtualKeyboard
              firstNote={calibrationData.firstNote}
              lastNote={calibrationData.lastNote}
              activeNotes={activeNotes}
            />
          </PerspectiveTransform>
        </>
      )}
    </MIDIProvider>
  );
}

export default App;
