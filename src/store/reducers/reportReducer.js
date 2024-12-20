const initialState = {
  invoices: [],
  todayInvoices: [],
  loading: false,
  error: null,
};


const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_INVOICES_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_INVOICES_SUCCESS':
      return {
        ...state,
        invoices: action.payload,
        loading: false
      };
    case 'FETCH_INVOICES_EMPTY':
      return {
        ...state,
        invoices: [],
        loading: false
      };
    case 'FETCH_INVOICES_ERROR':
      return {
        ...state,
        invoices: [],
        loading: false,
        error: action.payload
      };
    case 'FETCH_TODAY_INVOICES_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_TODAY_INVOICES_SUCCESS':
      return {
        ...state,
        todayInvoices: action.payload,
        loading: false,
      };
    case 'FETCH_TODAY_INVOICES_EMPTY':
      return {
        ...state,
        todayInvoices: [],
        loading: false,
      };
    case 'FETCH_TODAY_INVOICES_ERROR':
      return {
        ...state,
        todayInvoices: [],
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reportReducer;
