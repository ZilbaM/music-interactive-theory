import { combineReducers } from 'redux';
import pianoReducer from './pianoReducer';

const rootReducer = combineReducers({
  piano: pianoReducer,
  // Add other reducers here
});

export default rootReducer;
