"use client";
import React, { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [calibrationData, setCalibrationData] = useState(null);
  const [activeNotes, setActiveNotes] = useState([]);
  const [highlightedNotes, setHighlightedNotes] = useState([]);

  const projectionWidth = 88; // Example width in arbitrary units
  const projectionHeight = 33; // Example height in arbitrary units

  return (
    <GlobalStateContext.Provider
      value={{
        calibrationData,
        setCalibrationData,
        activeNotes,
        setActiveNotes,
        highlightedNotes,
        setHighlightedNotes,
        projectionHeight,
        projectionWidth
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
