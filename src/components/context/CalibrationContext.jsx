"use client";
import React, { createContext, useContext, useState } from "react";

const CalibrationContext = createContext();

export function CalibrationProvider({ children }) {
  const [calibrationData, setCalibrationData] = useState(null);
  const projectionWidth = process.env.NEXT_PUBLIC_PROJECTION_SURFACE_WIDTH;
  const projectionHeight = process.env.NEXT_PUBLIC_PROJECTION_SURFACE_HEIGHT;

  return (
    <CalibrationContext.Provider
      value={{ calibrationData, setCalibrationData, projectionWidth, projectionHeight }}
    >
      {children}
    </CalibrationContext.Provider>
  );
}

export function useCalibrationContext() {
  return useContext(CalibrationContext);
}
