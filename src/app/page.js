"use client"

import { useMIDIContext } from "@/components/context/MIDIContext";
import { useCallback } from "react";

export default function Home() {
  const context = useCallback(() => {
    const tempContext = useMIDIContext();
    console.log(tempContext)
    return tempContext
  }, [])

  return (
    <div>
      <p>hello</p>
    </div>
  );
}
