import {
    FETCH_CUSTOMERS_REQUEST,
    FETCH_CUSTOMERS_SUCCESS,
    FETCH_CUSTOMERS_FAILURE,
    UPDATE_CUSTOMER_SUCCESS,
    DELETE_CUSTOMER_SUCCESS
} from '../actions/customerActions';

const initialState = {
    customers: [],
    totalPages: 1,
    currentPage: 1,
    totalCustomers: 0,
    loading: false,
    error: null
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CUSTOMERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_CUSTOMERS_SUCCESS:
            return {
                ...state,
                customers: action.payload.customers || [], // Ensure customers is an array
                currentPage: action.payload.currentPage,
                totalPages: action.payload.totalPages,
                totalCustomers: action.payload.totalCustomers,
                error: null
            };
        case FETCH_CUSTOMERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case UPDATE_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: action.payload.customers || [],
                totalPages: action.payload.totalPages || 0,
                currentPage: action.payload.currentPage || 1,
                totalCustomers: action.payload.totalCustomers || 0,
                loading: false,
                error: null
            };
        case DELETE_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: state.customers.filter(customer => customer.id !== action.payload),
                totalCustomers: state.totalCustomers - 1,
                loading: false,
                error: null
            };
        case FETCH_CUSTOMERS_SUCCESS:
        case 'SEARCH_CUSTOMERS_SUCCESS':
            return {
                ...state,
                customers: action.payload.customers,
                currentPage: action.payload.currentPage,
                totalPages: action.payload.totalPages,
                totalCustomers: action.payload.totalCustomers,
                error: null
            };

        default:
            return state;
    }
};

export default customerReducer;
