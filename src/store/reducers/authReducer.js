const initialState = {
  isLoggedIn: false,
  user: null,
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
      };
      localStorage.setItem('authState', JSON.stringify(newState)); // Save to local storage
      return newState;
    case 'LOGOUT':
      // Object.keys(localStorage).forEach(key => {
      //   localStorage.removeItem(key);
      // });
      localStorage.removeItem('authState'); // Remove from local storage
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
