// app/providers.jsx
"use client"; // only this file is a client component
import React from "react";
import { MIDIContextProvider } from "@/components/context/MIDIContext";
import { NotesProvider } from "@/components/context/NotesContext";
import { CalibrationProvider } from "@/components/context/CalibrationContext";

export default function Providers({ children }) {
  return (
    <MIDIContextProvider>
      <NotesProvider>
        <CalibrationProvider>{children}</CalibrationProvider>
      </NotesProvider>
    </MIDIContextProvider>
  );
}
