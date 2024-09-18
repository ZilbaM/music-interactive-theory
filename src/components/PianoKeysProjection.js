import React from 'react';
import { useSelector } from 'react-redux';

function PianoKeysProjection() {
  const activeNotes = useSelector((state) => state.piano.activeNotes);

  // Logic to render highlights based on activeNotes
  // For simplicity, we'll just display the active notes

  return (
    <div className="piano-keys-projection">
      {activeNotes.map((note) => (
        <div key={note} className="key-highlight">
          Note {note} is active
        </div>
      ))}
    </div>
  );
}

export default PianoKeysProjection;
