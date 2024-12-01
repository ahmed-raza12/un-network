const initialState = {
    reports: [],
    invoices: [],
    summary: {
        totalAmount: 0,
        totalInvoices: 0,
        paidCount: 0,
        dueCount: 0,
        startDate: null,
        endDate: null
    },
    loading: false,
    error: null,
};

const reportReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_REPORT_START':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'FETCH_REPORT_SUCCESS':
            return {
                ...state,
                loading: false,
                invoices: action.payload.invoices,
                summary: action.payload.summary,
                error: null
            };

        case 'FETCH_REPORT_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case 'FETCH_REPORTS_SUCCESS':
            return {
                ...state,
                reports: action.payload,
                error: null,
            };

        case 'FETCH_REPORTS_FAILURE':
            return {
                ...state,
                error: action.payload,
            };

        case 'FETCH_PAID_CUSTOMERS_SUCCESS':
            return {
                ...state,
                reports: action.payload,
                error: null,
            };

        case 'FETCH_PAID_CUSTOMERS_ERROR':
            return {
                ...state,
                error: action.error,
            };

        case 'RESET_REPORT':
            return initialState;

        default:
            return state;
    }
};

export default reportReducer;
