import { combineReducers } from 'redux';
// Import your individual reducers here
import exampleReducer from './exampleReducer'; // Example reducer
import authReducer from './authReducer'; // Import the auth reducer
import customerReducer from './customerReducer';
import dealerReducer from './dealerReducer';
import staffReducer from './staffReducer'; // Import the staff reducer

const rootReducer = combineReducers({
  example: exampleReducer, // Add your reducers here
  auth: authReducer, // Add auth reducer
  customers: customerReducer,
  dealers: dealerReducer,
  staff: staffReducer,
});

export default rootReducer;
