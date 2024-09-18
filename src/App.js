import React from 'react';
import MIDIHandler from './components/MIDIHandler';
import PianoKeysProjection from './components/PianoKeysProjection';
import MusicSheetProjection from './components/MusicSheetProjection';

function App() {
  return (
    <div className="App">
      <MIDIHandler />
      <PianoKeysProjection />
      <MusicSheetProjection />
    </div>
  );
}

export default App;
