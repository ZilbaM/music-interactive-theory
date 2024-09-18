import { NOTE_ON, NOTE_OFF } from '../actions/pianoActions';

const initialState = {
  activeNotes: [],
};

const pianoReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTE_ON:
      return {
        ...state,
        activeNotes: [...state.activeNotes, action.payload],
      };
    case NOTE_OFF:
      return {
        ...state,
        activeNotes: state.activeNotes.filter(
          (note) => note !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default pianoReducer;
