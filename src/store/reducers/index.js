import { combineReducers } from 'redux';
// Import your individual reducers here
import exampleReducer from './exampleReducer'; // Example reducer
import authReducer from './authReducer'; // Import the auth reducer
import customerReducer from './customerReducer';
import dealerReducer from './dealerReducer';
import staffReducer from './staffReducer'; // Import the staff reducer
import invoiceReducer from './invoiceReducer';
import dueCustomersReducer from './dueCustomersReducer';
import reportReducer from './reportReducer';
import ispReducer from './ispReducer';

const rootReducer = combineReducers({
  example: exampleReducer, // Add your reducers here
  auth: authReducer, // Add auth reducer
  customers: customerReducer,
  dealers: dealerReducer,
  invoices: invoiceReducer,
  dueCustomers: dueCustomersReducer,
  report: reportReducer, // Changed from 'reports' to 'report' to match the selector
  staff: staffReducer,
  isp: ispReducer
});

export default rootReducer;
