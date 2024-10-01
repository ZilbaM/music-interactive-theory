import React from 'react';
import MIDIHandler from './components/MIDIHandler';
import PianoKeysProjection from './components/PianoKeysProjection';
import MusicSheetProjection from './components/MusicSheetProjection';
import PlayNoteButton from './components/PlayNoteButton';

function App() {
  return (
    <div className="App">
      <MIDIHandler />
      <PianoKeysProjection />
      <MusicSheetProjection />
      <PlayNoteButton />
    </div>
  );
}

export default App;
