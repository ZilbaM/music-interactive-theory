import { Note } from "tonal";

// utils/notes.js
export const noteLetters = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function getNoteLetter(noteNumber) {
  return Note.pitchClass(Note.fromMidi(noteNumber));
}

export function getAllNotesOfModRange(firstNote, lastNote, modValue) {
  const firstOctave = Note.octave(Note.fromMidi(firstNote));
  const lastOctave = Note.octave(Note.fromMidi(lastNote));
  const noteLetter = noteLetters[modValue];

  const notes = [];
  for (let octave = firstOctave; octave <= lastOctave; octave++) {
      notes.push(Note.midi(`${noteLetter}${octave}`));
  }
  return notes;
}

export function getRandomSequence(length, range = [0, 11]) {
  const [min, max] = range;
  const sequence = [];
  for (let i = 0; i < length; i++) {
    const randomMod = Math.floor(Math.random() * (max - min + 1)) + min;
    sequence.push(randomMod);
  }
  return sequence;
}
