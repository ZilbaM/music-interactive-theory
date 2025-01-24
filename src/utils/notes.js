// utils/notes.js
export const noteLetters = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function getNoteName(noteNumber) {
  const mod = noteNumber % 12;
  return noteLetters[mod];
}

export function getAllNotesOfModRange(firstNote, lastNote, modValue) {
  const notes = [];
  for (let n = firstNote; n <= lastNote; n++) {
    if (n % 12 === modValue) {
      notes.push(n);
    }
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
