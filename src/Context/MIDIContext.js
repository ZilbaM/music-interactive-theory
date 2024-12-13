// src/Context/MIDIContext.js
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { WebMidi } from 'webmidi';

export const MIDIContext = createContext();

export function MIDIProvider({ children }) {
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [isWebMidiEnabled, setIsWebMidiEnabled] = useState(false);

  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        setInputs(WebMidi.inputs);
        setOutputs(WebMidi.outputs);
        setIsWebMidiEnabled(true);

        // Listen for device connection/disconnection
        const handleConnectionChange = () => {
          setInputs(WebMidi.inputs);
          setOutputs(WebMidi.outputs);
        };

        WebMidi.addListener('connected', handleConnectionChange);
        WebMidi.addListener('disconnected', handleConnectionChange);

        return () => {
          WebMidi.removeListener('connected', handleConnectionChange);
          WebMidi.removeListener('disconnected', handleConnectionChange);
          WebMidi.disable();
        };
      })
      .catch((err) => {
        console.error('WebMidi could not be enabled:', err);
        setIsWebMidiEnabled(false);
      });
  }, []);

  const playNote = (note, attackSpeed, duration, channel) => {
    const output = outputs[0]; // Use first output as default
    output.sendNoteOn(note, { attackSpeed, channel });

    if (duration !== null) {
      setTimeout(() => {
        output.sendNoteOff(note, { channel });
      }, duration);
    }
  };

  // Provide methods to add and remove event listeners
  const addMidiListener = (type, channel, listener) => {
    inputs.forEach((input) => {
      input.addListener(type, channel, listener);
    });
  };

  const removeMidiListener = (type, channel, listener) => {
    inputs.forEach((input) => {
      input.removeListener(type, channel, listener);
    });
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      inputs,
      outputs,
      isWebMidiEnabled,
      addMidiListener,
      removeMidiListener,
      playNote,
    }),
    [inputs, outputs, isWebMidiEnabled]
  );

  return (
    <MIDIContext.Provider value={contextValue}>{children}</MIDIContext.Provider>
  );
}
