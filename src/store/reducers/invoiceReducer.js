const initialState = {
  invoices: [],
  error: null,
};

const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_INVOICES_SUCCESS':
      return {
        ...state,
        invoices: action.payload,
      };
    case 'FETCH_INVOICES_FAILURE':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default invoiceReducer;
