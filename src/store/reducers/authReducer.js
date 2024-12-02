const initialState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null
};

// Load initial state from local storage
const loadState = () => {
  const savedState = localStorage.getItem('authState');
  return savedState ? JSON.parse(savedState) : initialState;
};

const authReducer = (state = loadState(), action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      const newState = {
        ...state,
        isLoggedIn: true,
        user: action.payload,
        error: null
      };
      localStorage.setItem('authState', JSON.stringify(newState)); // Save to local storage
      return newState;
    case 'LOGOUT':
      localStorage.removeItem('authState'); // Remove from local storage
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        error: null
      };
    case 'UPDATE_PROFILE_SUCCESS':
      const updatedState = {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        },
        error: null
      };
      localStorage.setItem('authState', JSON.stringify(updatedState)); // Save to local storage
      return updatedState;
    case 'UPDATE_PROFILE_FAILURE':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

export default authReducer;
