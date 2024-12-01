import {
    ADD_STAFF_SUCCESS,
    ADD_STAFF_FAILURE,
    FETCH_STAFF_SUCCESS,
    FETCH_STAFF_FAILURE,
    UPDATE_STAFF_SUCCESS,
    UPDATE_STAFF_FAILURE,
    DELETE_STAFF_SUCCESS,
    DELETE_STAFF_FAILURE
} from '../actions/staffActions';

const initialState = {
    staff: [],
    error: null,
};

const staffReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_STAFF_SUCCESS:
            return {
                ...state,
                staff: [...state.staff, action.payload],
                error: null,
            };
        case ADD_STAFF_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case FETCH_STAFF_SUCCESS:
            return {
                ...state,
                staff: action.payload,
                error: null,
            };
        case FETCH_STAFF_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case UPDATE_STAFF_SUCCESS:
            return {
                ...state,
                staff: state.staff.map(staffMember =>
                    staffMember.id === action.payload.id
                        ? action.payload
                        : staffMember
                ),
                error: null,
            };
        case UPDATE_STAFF_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case DELETE_STAFF_SUCCESS:
            return {
                ...state,
                staff: state.staff.filter(staffMember => staffMember.id !== action.payload),
                error: null,
            };
        case DELETE_STAFF_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default staffReducer;