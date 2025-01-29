// context/MIDIContext.js
'use client';

import React, { createContext, useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { WebMidi } from 'webmidi';

export const MIDIContext = createContext(null);

export function MIDIContextProvider({ children }) {
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [isWebMidiEnabled, setIsWebMidiEnabled] = useState(false);

  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        console.log('WebMidi enabled');
        setInputs(WebMidi.inputs);
        setOutputs(WebMidi.outputs);
        setIsWebMidiEnabled(true);

        // Listen for device connection/disconnection
        const handleConnectionChange = () => {
          console.log('MIDI device connection changed');
          setInputs(WebMidi.inputs);
          setOutputs(WebMidi.outputs);
        };

        WebMidi.addListener('connected', handleConnectionChange);
        WebMidi.addListener('disconnected', handleConnectionChange);

        return () => {
          WebMidi.removeListener('connected', handleConnectionChange);
          WebMidi.removeListener('disconnected', handleConnectionChange);
          WebMidi.disable();
          console.log('WebMidi disabled');
        };
      })
      .catch((err) => {
        console.error('WebMidi could not be enabled:', err);
        setIsWebMidiEnabled(false);
      });
  }, []);

  // Provide methods to add and remove event listeners
  const addMidiListener = useCallback((type, channel, listener) => {
    inputs.forEach((input) => {
      input.addListener(type, channel, listener);
    })}, [isWebMidiEnabled]);

  const removeMidiListener = useCallback((type, channel, listener) => {
    inputs.forEach((input) => {
      input.removeListener(type, channel, listener);
    });
  }, [isWebMidiEnabled]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      inputs,
      outputs,
      isWebMidiEnabled,
      addMidiListener,
      removeMidiListener,
    }),
    [inputs, outputs, isWebMidiEnabled]
  );

  return (
    <MIDIContext.Provider value={contextValue}>{children}</MIDIContext.Provider>
  );
}

export const useMIDIContext = () => {
  const context = useContext(MIDIContext);
  if (!context) {
    throw new Error('useMIDIContext must be used within a MIDIContextProvider');
  }
  return context;
};
