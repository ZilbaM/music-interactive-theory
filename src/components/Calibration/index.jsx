"use client";
import React, { useEffect, useState, useRef } from "react";
import { useCalibrationContext } from "../context/CalibrationContext";
import { useNotesContext } from "../context/NotesContext";
import { useMIDIContext } from "../context/MIDIContext";
import FlickerText from "@/components/UI/FlickerText";

function Calibration() {
  const { setCalibrationData } = useCalibrationContext();
  const { activeNotes } = useNotesContext(); // Array of currently pressed notes
  const { isWebMidiEnabled } = useMIDIContext();

  // Phase legend:
  //   0: waiting for "any note" to start
  //   1: waiting for "lowest key" (held 3s, released after)
  //   2: waiting for "highest key" (held 3s, released after)
  //   3: done
  const [phase, setPhase] = useState(0);

  // Note being evaluated and when it was pressed
  const [pendingNote, setPendingNote] = useState(null);
  const [pressedAt, setPressedAt] = useState(null);

  const [lowestNote, setLowestNote] = useState(null);
  const [countdown, setCountdown] = useState(null); // For visual feedback
  const [message, setMessage] = useState(
    "Welcome! Press any key to begin calibration."
  );

  const intervalRef = useRef(null);

  // Start countdown timer
  useEffect(() => {
    if (phase !== 1 && phase !== 2) {
      setCountdown(null);
      return;
    }

    if (pendingNote && pressedAt) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - pressedAt;
        const remaining = Math.max(3 - Math.floor(elapsed / 1000), 0);

        if (remaining === 0 && activeNotes.length === 1) {
          clearInterval(intervalRef.current);
          setCountdown("Release!"); // Show "Release!" briefly before moving on
        } else {
          setCountdown(remaining);
        }
      }, 100);

      return () => {
        clearInterval(intervalRef.current);
      };
    }
  }, [pendingNote, pressedAt, phase, activeNotes]);

  // Confirm a note after release
  function confirmNote(note) {
    if (phase === 1) {
      setLowestNote(note);
      setMessage("Great! Now press and hold the *rightmost* key for 3 seconds.");
      setPhase(2);
      setPendingNote(null);
      setPressedAt(null);
      setCountdown(null);
    } else if (phase === 2) {
      setMessage("Calibration complete!");
      setPhase(3);

      // Save calibration data
      setCalibrationData({
        firstNote: lowestNote,
        lastNote: note,
      });
    }
  }

  // Handle logic for current phase when `activeNotes` changes
  useEffect(() => {
    if (!isWebMidiEnabled) return;

    if (phase === 0) {
      if (activeNotes.length > 0) {
        setMessage("Good!");
        setTimeout(() => {
          setMessage("Please press and hold the *leftmost* key for 3 seconds.");
          setPhase(1);
        }, 1000);
      }
      return;
    }

    if (phase === 1 || phase === 2) {
      if (activeNotes.length === 0 && countdown === "Release!") {
        // User released the key after holding for 3 seconds
        confirmNote(pendingNote);
      } else if (activeNotes.length === 0) {
        // User released keys too early
        setPendingNote(null);
        setPressedAt(null);
        setCountdown(null);
      } else {
        const targetNote =
          phase === 1 ? Math.min(...activeNotes) : Math.max(...activeNotes);

        if (pendingNote === null) {
          // Start tracking this note
          setPendingNote(targetNote);
          setPressedAt(Date.now());
        } else if (targetNote !== pendingNote || activeNotes.length > 1) {
          // User pressed a new note or multiple notes—reset
          setPendingNote(targetNote);
          setPressedAt(Date.now());
        }
      }
    }
  }, [activeNotes, phase, pendingNote, countdown, isWebMidiEnabled]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-semibold mb-4">Calibration</h2>
      {phase < 3 && (
        <div>
          {countdown !== null ? (
            <p className="text-2xl">
              {countdown === "Release!" ? (
                <span className="text-green-500">Release!</span>
              ) : (
                "Hold! " + countdown
              )}
            </p>
          ) : (
            <FlickerText className="text-lg">{message}</FlickerText>
          )}
        </div>
      )}
    </div>
  );
}

export default Calibration;
