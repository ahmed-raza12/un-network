import {
    ADD_ISP_SUCCESS,
    ADD_ISP_FAILURE,
    FETCH_ISPS_SUCCESS,
    FETCH_ISPS_FAILURE
} from '../actions/ispActions';

const initialState = {
    isps: [],
    error: null,
    loading: false
};

const ispReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ISP_SUCCESS:
            return {
                ...state,
                isps: [...state.isps, action.payload],
                error: null
            };

        case ADD_ISP_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case FETCH_ISPS_SUCCESS:
            return {
                ...state,
                isps: action.payload,
                error: null
            };

        case FETCH_ISPS_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        default:
            return state;
    }
};

export default ispReducer;
