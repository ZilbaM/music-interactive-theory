"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useMIDIContext } from "../context/MIDIContext";
import { useGlobalState } from "../context/GlobalStateContext";

function Calibration() {
  const { setCalibrationData } = useGlobalState();

   // Ref to track if calibration has started
   const calibrationStarted = useRef(false);

  // Memoize onCalibrationComplete to prevent re-creation on every render
  const onCalibrationComplete = useCallback(
    (firstNote, lastNote) => {
      console.log("Calibration complete!");
      setCalibrationData({
        firstNote,
        lastNote,
      });
    },
    [setCalibrationData]
  );

  const { addMidiListener, removeMidiListener, isWebMidiEnabled } = useMIDIContext();
  console.log(isWebMidiEnabled)
  const [message, setMessage] = useState(
    "Welcome to the Music Interactive Theory! Let's start by calibrating the keyboard. Press any key to continue."
  );

  useEffect(() => {
    // Prevent calibration from running multiple times
    if (calibrationStarted.current || !isWebMidiEnabled) {
      return;
    }
    calibrationStarted.current = true;

    // Function to wait for a note to be pressed
    const waitForNote = () =>
      new Promise((resolve) => {
        const handleNoteOn = (event) => {
          const note = event.note.number;
          removeMidiListener("noteon", "all", handleNoteOn); // Remove the specific listener
          resolve(note);
        };
        addMidiListener("noteon", "all", handleNoteOn);
      });

    const calibrate = async () => {
      // Step 1: Wait for any key press to start
      console.log("Please press any key on your MIDI piano.");
      await waitForNote();
      
      // Step 2: Wait for the lowest key
      console.log("Please press the lowest key on your MIDI piano.");
      setMessage("Please press the lowest key on your MIDI piano.");
      const firstNote = await waitForNote();

      // Step 3: Wait for the highest key
      console.log("Please press the highest key on your MIDI piano.");
      setMessage("Please press the highest key on your MIDI piano.");
      const lastNote = await waitForNote();

      // Step 4: Save the calibration data
      setMessage("Calibration complete!");
      onCalibrationComplete(firstNote, lastNote);
    };

    calibrate(); // Start the calibration process

    return () => {
      // Clean up listeners if the component unmounts
      removeMidiListener("noteon", "all");
    };
  }, [addMidiListener, removeMidiListener, onCalibrationComplete, isWebMidiEnabled]);

  return (
    <div>
      <h2>Calibration</h2>
      <p>{message}</p>
    </div>
  );
}

export default Calibration;
