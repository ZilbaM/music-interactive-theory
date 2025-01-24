'use client'
// components/steps/BaseStep.js
import React, { useEffect } from 'react';
import { useMIDIContext } from '../context/MIDIContext';

/**
 * BaseStep
 *
 * Props:
 *   - completeStep: function to call when the step is complete.
 *   - onEnter: function called when the step becomes active.
 *   - onExit: function called when the step is about to leave.
 *   - children: UI content of the step.
 *
 * Behavior:
 *   - Manages MIDI event subscriptions.
 *   - Provides a structure for specialized steps to implement validation.
 */
export default function BaseStep({ completeStep, onEnter, onExit, children }) {
  const { addMIDIListener, removeMIDIListener } = useMIDIContext();

  useEffect(() => {
    // Call onEnter when the step mounts
    if (onEnter) onEnter();

    // Cleanup: call onExit when the step unmounts
    return () => {
      if (onExit) onExit();
    };
  }, [onEnter, onExit]);

  return <div>{children}</div>;
}
