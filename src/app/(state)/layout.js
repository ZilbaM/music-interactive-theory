"use client";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import Calibration from "@/components/Calibration";
import PerspectiveTransform from "react-perspective-transform";
import { useCalibrationContext } from "@/components/context/CalibrationContext";

export default function SubLayout({ children }) {
  const { calibrationData, projectionWidth, projectionHeight } = useCalibrationContext();

  return calibrationData ? (
    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center gap-3">
      <PerspectiveTransform>
        <div style={{"aspectRatio" : `${projectionWidth} / ${projectionHeight}`}}>
          {children}
        </div>
        </PerspectiveTransform>
      <PerspectiveTransform>
        <VirtualKeyboard firstNote={calibrationData.firstNote} lastNote={calibrationData.lastNote} />
      </PerspectiveTransform>
    </div>
  ) : (
      <div className="flex justify-center items-center h-screen w-screen overflow-hidden">
        <Calibration />
      </div>
  );
}
