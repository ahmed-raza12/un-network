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
  return (dispatch) => {
    try {
      // Clear all localStorage items
      localStorage.clear();
      
      // Reset all reducers to their initial state
      dispatch({ type: 'LOGOUT' });
      dispatch({ type: 'RESET_CUSTOMERS' });
      dispatch({ type: 'RESET_INVOICES' });
      dispatch({ type: 'RESET_REPORT' });
      dispatch({ type: 'RESET_DUE_CUSTOMERS' });
      dispatch({ type: 'RESET_STAFF' });
      
      // Redirect to login page or show success message
      console.log('Successfully logged out');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
};
