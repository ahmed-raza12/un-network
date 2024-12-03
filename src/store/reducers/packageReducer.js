import {
    ADD_PACKAGE,
    FETCH_PACKAGES,
    UPDATE_PACKAGE,
    DELETE_PACKAGE
} from '../actions/packageActions';

const initialState = {
    packages: {},
    loading: false,
    error: null
};

const packageReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PACKAGE:
            return {
                ...state,
                packages: {
                    ...state.packages,
                    [action.payload.id]: action.payload
                }
            };

        case FETCH_PACKAGES:
            return {
                ...state,
                packages: action.payload
            };

        case UPDATE_PACKAGE:
            return {
                ...state,
                packages: {
                    ...state.packages,
                    [action.payload.id]: {
                        ...state.packages[action.payload.id],
                        ...action.payload
                    }
                }
            };

        case DELETE_PACKAGE:
            const { [action.payload]: deletedPackage, ...remainingPackages } = state.packages;
            return {
                ...state,
                packages: remainingPackages
            };

        default:
            return state;
    }
};

export default packageReducer;
