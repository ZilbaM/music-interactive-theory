"use client";
import { useGlobalState } from "@/components/context/GlobalStateContext";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import Calibration from "@/components/Calibration";
import PerspectiveTransform from "react-perspective-transform";

export default function SubLayout({ children }) {
  const { calibrationData } = useGlobalState();

  return calibrationData ? (
    <>
      <PerspectiveTransform>{children}</PerspectiveTransform>
      <PerspectiveTransform>
        <VirtualKeyboard />
      </PerspectiveTransform>
    </>
  ) : (
    <PerspectiveTransform>
      <Calibration />
    </PerspectiveTransform>
  );
}
