'use client'
import React from 'react';
import clsx from 'clsx';
import { useNotesContext } from '@/components/context/NotesContext';
import { useCalibrationContext } from '@/components/context/CalibrationContext';

function VirtualKeyboard() {

  const {activeNotes, highlightedNotes, contentNotes} = useNotesContext();
  const {calibrationData:{firstNote, lastNote}} = useCalibrationContext();


  const isBlackKey = (note) => [1, 3, 6, 8, 10].includes(note % 12);
  const isActive = (note) => activeNotes.includes(note);
  const isHighlighted = (note) => Object.hasOwn(highlightedNotes, note);

  const blackNotes = [];
  const whiteNotes = [];

  for (let n = firstNote; n <= lastNote; n += 1) {
    if (isBlackKey(n)) {
      blackNotes.push(n);
    } else {
      whiteNotes.push(n);
      // insert placeholders for black keys if needed
      if (!isBlackKey(n + 1)) {
        blackNotes.push(-n);
      }
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-nowrap absolute left-2">
        {blackNotes.map((note, index) => (
          <div
            key={note}
            className={clsx(
              "h-24 w-4 px-[0.1rem] flex justify-center",
              {
                "-translate-x-[0.15rem]": blackNotes[index - 1] < 0,
                "translate-x-[0.15rem]": blackNotes[index + 1] < 0
              }
            )}
          >
            {note >= 0 && (
              <div
                className={clsx(
                  "h-[68%] w-full border-2 border-black overflow-hidden",
                  {
                    [highlightedNotes[note]]: note in highlightedNotes,
                    'border-activeNotes bg-activeNotes': isActive(note),
                    'bg-black': !isActive(note) && !isHighlighted(note),
                  }
                )}
              >
                {contentNotes[note] ?? null}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-nowrap">
        {whiteNotes.map((note) => (
          <div
            key={note}
            className="h-24 w-4 flex justify-center"
          >
            <div
              className={clsx(
                "h-full w-full border border-black flex flex-col items-center justify-end",
                {
                  [highlightedNotes[note]]: note in highlightedNotes,
                  '!bg-activeNotes': isActive(note),
                  'bg-white': !isActive(note) && !isHighlighted(note),
                }
              )}
            >
              {contentNotes[note] ?? null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualKeyboard;