// src/components/MIDIOutput.js

import { useEffect, useState } from 'react';
import { WebMidi } from 'webmidi';

const MIDIOutput = () => {
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

  // Expose the output device for other components to use
  return null;
};

export default MIDIOutput;
