"use client"

import { useMIDIContext } from "@/components/context/MIDIContext";
import Link from "next/link";
import { useCallback } from "react";

export default function Home() {
  useCallback(() => {
    const tempContext = useMIDIContext();
    return tempContext
  }, [])

  return (
    <ul className="flex flex-wrap width-full height-full justify-evenly p-4">
      <li>
        <Link className="flex flex-col items-center border-2 rounded-lg p-4" href="/lessons/note-notation">
          <p className="text-3xl mb-3">Note Notation</p>
          <p className="text-2xl text-gray-500">Learn to read and write notes</p>
        </Link>

      </li>
    </ul>
  );
}
