import {
    ADD_CUSTOMER_SUCCESS,
    ADD_CUSTOMER_FAILURE,
    FETCH_CUSTOMERS_SUCCESS,
    FETCH_CUSTOMERS_FAILURE,
    UPDATE_CUSTOMER_SUCCESS,
    UPDATE_CUSTOMER_FAILURE,
    DELETE_CUSTOMER_SUCCESS,
    DELETE_CUSTOMER_FAILURE
} from '../actions/customerActions';

const initialState = {
    customers: [],
    error: null,
    totalPages: 0,
    currentPage: 1,
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: [...state.customers, action.payload],
                error: null,
            };
        case ADD_CUSTOMER_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case FETCH_CUSTOMERS_SUCCESS:
            return {
                ...state,
                customers: action.payload.customers,
                totalPages: action.payload.totalPages,
                currentPage: action.payload.currentPage,
                error: null,
            };
        case FETCH_CUSTOMERS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case UPDATE_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: state.customers.map(customer =>
                    customer.id === action.payload.id
                        ? action.payload
                        : customer
                ),
                error: null,
            };
        case UPDATE_CUSTOMER_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case DELETE_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: state.customers.filter(customer => customer.id !== action.payload),
                error: null,
            };
        case DELETE_CUSTOMER_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default customerReducer;
