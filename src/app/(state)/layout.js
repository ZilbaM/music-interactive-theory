"use client";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import Calibration from "@/components/Calibration";
import {PerspectiveTransform} from "react-perspective-transform";
import {PerspectiveTransform} from "react-perspective-transform";
import { useCalibrationContext } from "@/components/context/CalibrationContext";

export default function SubLayout({ children }) {
  const { calibrationData, projectionWidth, projectionHeight } = useCalibrationContext();

  return calibrationData ? (
    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-between py-16">
      <PerspectiveTransform storageKey="ift-content">
        <div style={{"aspectRatio" : `${projectionWidth} / ${projectionHeight}`}} className="overflow-hidden">
          {children}
        </div>
        </PerspectiveTransform>
      <PerspectiveTransform storageKey="ift-piano">
        <VirtualKeyboard firstNote={calibrationData.firstNote} lastNote={calibrationData.lastNote} />
      </PerspectiveTransform>
    </div>
  ) : (
      <div className="flex justify-center items-center h-screen w-screen overflow-hidden pb-16">
        <Calibration />
      </div>
  );
}
