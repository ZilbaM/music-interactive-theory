// src/components/PianoKeysProjection.js

import React from 'react';
import { useSelector } from 'react-redux';

function PianoKeysProjection() {
  const activeNotes = useSelector((state) => state.piano.activeNotes);
  console.log(activeNotes);
  return (
    <div className="piano-keys-projection">
      {activeNotes.map((note, index) => (
        <div key={`${note}`} className="key-highlight">
          Note {note} is active
        </div>
      ))}
    </div>
  );
}

export default PianoKeysProjection;
