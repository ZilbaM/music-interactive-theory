'use client'
import React from 'react';
import clsx from 'clsx';
import { useGlobalState } from '../context/GlobalStateContext';

function VirtualKeyboard() {
  const {calibrationData, activeNotes, highlightedNotes} = useGlobalState();

  const {firstNote, lastNote} = calibrationData

  const isBlackKey = (note) => [1, 3, 6, 8, 10].includes(note % 12);
  const isActive = (note) => activeNotes.includes(note);
  const isHighlighted = (note) => highlightedNotes.includes(note);

  const blackNotes = [];
  const whiteNotes = [];

  for (let n = firstNote; n <= lastNote; n += 1) {
    if (isBlackKey(n)) {
      blackNotes.push(n);
    } else {
      whiteNotes.push(n);
      // insert placeholders for black keys if needed
      if (!isBlackKey(n + 1)) {
        blackNotes.push(-2 * n);
      }
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-nowrap absolute left-2">
        {blackNotes.map((note) => (
          <div
            key={note}
            className="h-24 w-5 flex justify-center"
          >
            {note >= 0 && (
              <div
                className={clsx(
                  "h-3/5 w-full border border-black",
                  {
                    'bg-lightblue': isHighlighted(note),
                    'bg-red': isActive(note),
                    'bg-black': !isActive(note) && !isHighlighted(note),
                  }
                )}
              ></div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-nowrap">
        {whiteNotes.map((note) => (
          <div
            key={note}
            className="h-24 w-5 flex justify-center"
          >
            <div
              className={clsx(
                "h-full w-full border border-black",
                {
                  'bg-red': isHighlighted(note),
                  'bg-orange': isActive(note),
                  'bg-white': !isActive(note) && !isHighlighted(note),
                }
              )}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualKeyboard;