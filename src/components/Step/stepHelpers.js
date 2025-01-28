import { Note, Chord } from "tonal";

export function isSingleNotePressed(note, activeNotes, anyOctave = false) {
  // Convert note to its MIDI value
  const targetMidi = note;
  if (activeNotes) {
    if (anyOctave) {
      // Check if any active note matches mod 12
      return activeNotes.some((active) => active % 12 === targetMidi % 12);
    } 
    // Check if the exact MIDI note is active
    return activeNotes.includes(targetMidi);
  }
}

export function isAnyOfNotesPressed(notes, activeNotes, anyOctave = false) {
  return notes.some((note) =>
    isSingleNotePressed(note, activeNotes, anyOctave)
  );
}

export function isChordPressed(chordName, activeNotes, anyOctave = false) {
  // Get the notes of the chord as MIDI values
  const chordNotes = Chord.get(chordName).notes.map(Note.midi);

  if (anyOctave) {
    // Check if every chord note is represented (mod 12)
    return chordNotes.every((chordNote) =>
      activeNotes.some((active) => active % 12 === chordNote % 12)
    );
  }

  // Check for exact matches
  return chordNotes.every((chordNote) => activeNotes.includes(chordNote));
}

// A set timeout class that can be started and stopped and has a remaining duration
export class Timeout {
  constructor(callback, duration, handleTick) {
    this.callback = callback;
    this.duration = duration;
    this.id = null;
    this.progress = 0;
    this.running = false;
    this.handleTick = handleTick;
  }

  start() {
    if (this.running) return;
    console.log("Run timeout");
    const start = performance.now();
    const step = (timestamp) => {
      if (!this.running) return;
      this.progress = timestamp - start;
      if (this.handleTick) this.handleTick(this.progress);
      if (this.progress >= this.duration) {
        this.callback();
        this.stop();
      } else {
        this.id = requestAnimationFrame(step);
      }
    };
    this.id = requestAnimationFrame(step);
    this.running = true;
  }

  get remaining() {
    return this.duration - this.progress;
  }
  
  

  stop() {
    if (!this.running) return;
    console.log("Stop timeout");
    clearInterval(this.id);
    this.running = false;
  }

  reset() {
    console.log("Reset timeout");
    this.stop();
    this.progress = 0;
  }

  
}
