"use client"

import { useMIDIContext } from "@/components/context/MIDIContext";
import { useCallback } from "react";

export default function Home() {
  useCallback(() => {
    const tempContext = useMIDIContext();
    return tempContext
  }, [])

  return (
    <div>
      <p>hello</p>
    </div>
  );
}
