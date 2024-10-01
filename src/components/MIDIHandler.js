// src/components/MIDIHandler.js

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { WebMidi } from 'webmidi';
import { noteOn, noteOff } from '../redux/slices/pianoSlice';

function MIDIHandler() {
  const dispatch = useDispatch();
  const listenersAdded = useRef(false);
  const webMidiEnabled = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let input = null;
    let handleNoteOn = null;
    let handleNoteOff = null;

    const enableWebMidi = async () => {
      if (!webMidiEnabled.current) {
        try {
          await WebMidi.enable();
          webMidiEnabled.current = true;
          console.log('WebMidi enabled!');
        } catch (err) {
          console.error('WebMidi could not be enabled.', err);
          return;
        }
      } else {
        console.log('WebMidi already enabled.');
      }

      if (!isMounted) return;

      [input] = WebMidi.inputs;

      if (input && !listenersAdded.current) {
        // Define handlers
        handleNoteOn = (e) => {
          dispatch(noteOn(e.note.number));
        };
        handleNoteOff = (e) => {
          dispatch(noteOff(e.note.number));
        };

        // Attach listeners
        input.addListener('noteon', 'all', handleNoteOn);
        input.addListener('noteoff', 'all', handleNoteOff);
        listenersAdded.current = true;
      } else if (!input) {
        console.log('No MIDI input devices found.');
      }
    };

    enableWebMidi();

    // Cleanup on unmount or effect re-run
    return () => {
      isMounted = false;
      if (input && listenersAdded.current) {
        input.removeListener('noteon', 'all', handleNoteOn);
        input.removeListener('noteoff', 'all', handleNoteOff);
        listenersAdded.current = false;
      }
      // Do not call WebMidi.disable() to prevent issues in development mode
    };
  }, [dispatch]);

  return null; // This component does not render anything
}

export default MIDIHandler;
