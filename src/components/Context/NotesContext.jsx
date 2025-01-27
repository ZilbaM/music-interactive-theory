// ActiveNotesContext.jsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useMIDIContext } from "@/components/context/MIDIContext";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [activeNotes, setActiveNotes] = useState([]);
  const [highlightedNotes, setHighlightedNotes] = useState([]);

  const {addMidiListener, removeMidiListener, isWebMidiEnabled} = useMIDIContext();
  
    useEffect(() => {
      if (!isWebMidiEnabled) return
  
      function handleNoteOn(e) {
        console.log("Note detected:", e.note.number);
        const note = e.note.number;
        setActiveNotes((prev) => Array.from(new Set([...prev, note])));
      }
      function handleNoteOff(e) {
        console.log("Note released:", e.note.number);
        const note = e.note.number;
        setActiveNotes((prev) => prev.filter((n) => n !== note));
      }
  
      console.log("Adding MIDI listeners");
      addMidiListener('noteon', 'all', handleNoteOn);
      addMidiListener('noteoff', 'all', handleNoteOff);
      return () => {
        console.log("Removing MIDI listeners");
        removeMidiListener('noteon', 'all', handleNoteOn);
        removeMidiListener('noteoff', 'all', handleNoteOff);
      };
    }, [isWebMidiEnabled])

  return (
    <NotesContext.Provider
      value={{ activeNotes, setActiveNotes, highlightedNotes, setHighlightedNotes }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotesContext() {
  return useContext(NotesContext);
}
