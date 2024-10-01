// src/redux/slices/pianoSlice.js

import { createSlice } from '@reduxjs/toolkit';

const pianoSlice = createSlice({
  name: 'piano',
  initialState: {
    activeNotes: [],
  },
  reducers: {
    noteOn(state, action) {
      if (!state.activeNotes.includes(action.payload)) {
        state.activeNotes.push(action.payload);
      }
    },
    noteOff(state, action) {
      const index = state.activeNotes.indexOf(action.payload);
      if (index !== -1) {
        state.activeNotes.splice(index, 1);
      }
    },
  },
});

export const { noteOn, noteOff } = pianoSlice.actions;

export default pianoSlice.reducer;
