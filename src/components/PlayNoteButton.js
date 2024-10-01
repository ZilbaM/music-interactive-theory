// src/components/PlayNoteButton.js

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WebMidi } from 'webmidi';
import { noteOn, noteOff } from '../redux/slices/pianoSlice';

function PlayNoteButton() {
  const dispatch = useDispatch();
  const [noteNumber, setNoteNumber] = useState(60); // Default to Middle C
  const [outputDevice, setOutputDevice] = useState(null);

  useEffect(() => {
    const enableWebMidi = async () => {
      try {
        await WebMidi.enable();
        console.log('WebMidi enabled for output!');
        if (WebMidi.outputs.length > 0) {
          // Choose the first available output device
          const output = WebMidi.outputs[0];
          setOutputDevice(output);
          console.log(`Using MIDI output: ${output.name}`);
        } else {
          console.log('No MIDI output devices found.');
        }
      } catch (err) {
        console.error('WebMidi could not be enabled.', err);
      }
    };

    enableWebMidi();

    // Cleanup function
    return () => {
      WebMidi.disable();
    };
  }, []);

  const playNote = () => {
    if (outputDevice) {
      const channel = outputDevice.channels[1]; // MIDI channels are 1-indexed
      const velocity = 0.8; // Velocity between 0 and 1

      // Dispatch noteOn action
      dispatch(noteOn(noteNumber));

      // Send Note On
      channel.playNote(noteNumber, { velocity });

      // Optionally, stop the note after a duration
      setTimeout(() => {
        // Send Note Off
        channel.stopNote(noteNumber);
        // Dispatch noteOff action
        dispatch(noteOff(noteNumber));
      }, 1000); // Stop the note after 1 second
    } else {
      console.log('No MIDI output device available.');
    }
  };

  const handleNoteChange = (e) => {
    setNoteNumber(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <p>Select Note:</p>
      <input
        type="number"
        value={noteNumber}
        onChange={handleNoteChange}
        min="21"
        max="108"
      />

      <button type="button" onClick={playNote} disabled={!outputDevice}>
        Play Note {noteNumber}
      </button>
    </div>
  );
}

export default PlayNoteButton;
