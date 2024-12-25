import { ref, set } from 'firebase/database';
import { db } from '../../firebase';
import { startAllRealtimeSyncs, stopAllRealtimeSyncs, clearLocalStorage } from '../../utils/databaseSync';

// Action Types
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

export const login = (credentials) => {
  return async (dispatch) => {
    try {
      // Perform login logic (e.g., API call)
      if (credentials) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: credentials });
        
        // Start real-time syncs after successful login
        // startAllRealtimeSyncs();
        
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
      // Stop all real-time syncs
      // stopAllRealtimeSyncs();
      
      // Clear all localStorage data
      // clearLocalStorage();
      
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




export const updateProfile = (userData) => {
  return async (dispatch) => {
    try {
      const { uid } = userData;
      console.log(userData, 'userData')
      const userRef = ref(db, `users/${uid}`);
      
      // Update user data in Firebase
      await set(userRef, userData);

      // If user is staff or dealer, update their respective collections
      if (userData.role === 'staff') {
        const staffRef = ref(db, `staff/${userData.dealerId}/${uid}`);
        await set(staffRef, userData);
      } else if (userData.role === 'dealer') {
        const dealerRef = ref(db, `dealers/${uid}`);
        await set(dealerRef, userData);
      }

      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: userData
      });

      // Show success message
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      dispatch({
        type: UPDATE_PROFILE_FAILURE,
        payload: error.message
      });
      
      // Show error message
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to update profile'
      });
    }
  };
};
