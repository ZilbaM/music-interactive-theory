import { combineReducers } from 'redux';
import pianoReducer from '../slices/pianoSlice';

const rootReducer = combineReducers({
  piano: pianoReducer,
  // Add other reducers here
});

export default rootReducer;
