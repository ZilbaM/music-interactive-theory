export const NOTE_ON = 'NOTE_ON';
export const NOTE_OFF = 'NOTE_OFF';

export const noteOn = (note) => ({
  type: NOTE_ON,
  payload: note,
});

export const noteOff = (note) => ({
  type: NOTE_OFF,
  payload: note,
});
