const initialState = {
  dueCustomers: [],
  error: null,
};

const dueCustomersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_DUE_CUSTOMERS_SUCCESS':
      return {
        ...state,
        dueCustomers: action.payload,
        error: null,
      };
    case 'FETCH_DUE_CUSTOMERS_FAILURE':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default dueCustomersReducer;
