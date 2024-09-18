import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import WebMidi from 'webmidi';
import { noteOn, noteOff } from '../redux/actions/pianoActions';

function MIDIHandler() {
  const dispatch = useDispatch();

  useEffect(() => {
    WebMidi.enable((err) => {
      if (err) {
        console.error('WebMidi could not be enabled.', err);
      } else {
        console.log('WebMidi enabled!');
        const input = WebMidi.inputs[0];
        if (input) {
          input.addListener('noteon', 'all', (e) => {
            dispatch(noteOn(e.note.number));
          });

          input.addListener('noteoff', 'all', (e) => {
            dispatch(noteOff(e.note.number));
          });
        } else {
          console.log('No MIDI input devices found.');
        }
      }
    });

    // Cleanup on unmount
    return () => {
      WebMidi.disable();
    };
  }, [dispatch]);

  return null; // This component does not render anything
}

export default MIDIHandler;
