// app/providers.jsx
"use client"; // only this file is a client component
import React from 'react';
import { MIDIContextProvider } from '@/components/context/MIDIContext';
import { GlobalStateProvider } from '@/components/context/GlobalStateContext';

export default function Providers({ children }) {
  return (
    <MIDIContextProvider>
      <GlobalStateProvider>{children}</GlobalStateProvider>
    </MIDIContextProvider>
  );
}
