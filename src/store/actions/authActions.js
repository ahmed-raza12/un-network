export const login = (credentials) => {
  return async (dispatch) => {
    try {
      // Perform login logic (e.g., API call)
      if (credentials) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: credentials });
        return true; // Indicate success
      }
    } catch (error) {
      console.error('Login failed', error);
      return false; // Indicate failure
    }
  };
};

export const logout = () => {
  return  (dispatch) => {
    // Remove all local storage items
    Object.keys(localStorage).forEach(key => localStorage.removeItem(key));
    dispatch({ type: 'LOGOUT' }); // Dispatch logout action to update Redux state
  };

};
