import { FETCH_CUSTOMERS_SUCCESS, FETCH_CUSTOMERS_FAILURE } from '../actions/customerActions';

const initialState = {
  customers: [],
  error: null,
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CUSTOMER_SUCCESS':
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };
    case 'ADD_CUSTOMER_FAILURE':
      return {
        ...state,
        error: action.payload,
      };
    case FETCH_CUSTOMERS_SUCCESS:
      return {
        ...state,
        customers: action.payload,
        error: null,
      };
    case FETCH_CUSTOMERS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default customerReducer;
