import { ADD_DEALER_SUCCESS, ADD_DEALER_FAILURE, FETCH_DEALERS_SUCCESS, FETCH_DEALERS_FAILURE } from '../actions/dealerActions';

const initialState = {
    dealers: [],
    error: null,
};

const dealerReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_DEALER_SUCCESS:
            // Save dealers to local storage
            localStorage.setItem('dealers', JSON.stringify([...state.dealers, action.payload]));
            return {
                ...state,
                dealers: [...state.dealers, action.payload],
                error: null,
            };
        case ADD_DEALER_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case FETCH_DEALERS_SUCCESS:
            return {
                ...state,
                dealers: action.payload,
                error: null,
            };
        case FETCH_DEALERS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default dealerReducer; 