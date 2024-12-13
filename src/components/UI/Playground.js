// src/Components/Playground.js
import React, { useContext, useEffect } from 'react';
import { MIDIContext } from '../../Context/MIDIContext';

function Playground({ onMIDIEvent, children }) {
  const { addMidiListener, removeMidiListener } = useContext(MIDIContext);

  useEffect(() => {
    // Forward all noteon events to onMIDIEvent
    const handleNoteOn = (event) => {
      if (onMIDIEvent) {
        onMIDIEvent(event);
      }
    };

    addMidiListener('noteon', 'all', handleNoteOn);
    return () => {
      removeMidiListener('noteon', 'all', handleNoteOn);
    };
  }, [addMidiListener, removeMidiListener, onMIDIEvent]);

  return <div>{children}</div>;
}

export default Playground;
