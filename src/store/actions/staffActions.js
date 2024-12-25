import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, push, get, remove } from "firebase/database";
import { db } from "../../firebase";
// Action Types
export const ADD_STAFF_SUCCESS = "ADD_STAFF_SUCCESS";
export const ADD_STAFF_FAILURE = "ADD_STAFF_FAILURE";
export const FETCH_STAFF_SUCCESS = "FETCH_STAFF_SUCCESS";
export const FETCH_STAFF_FAILURE = "FETCH_STAFF_FAILURE";
export const UPDATE_STAFF_SUCCESS = "UPDATE_STAFF_SUCCESS";
export const UPDATE_STAFF_FAILURE = "UPDATE_STAFF_FAILURE";
export const DELETE_STAFF_SUCCESS = "DELETE_STAFF_SUCCESS";
export const DELETE_STAFF_FAILURE = "DELETE_STAFF_FAILURE";
export const FETCH_STAFF_ERROR = "FETCH_STAFF_ERROR";
export const SET_MESSAGE = "SET_MESSAGE";
export const SET_ERROR = "SET_ERROR";

export const addStaff = (email, password, staffData) => async (dispatch, getState) => {
    const auth = getAuth();
    const { address, name, phone, designation, companyCode, dealerId } = staffData;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Add dealer role to the Realtime Database
        const userRef = ref(db, `users/${user.uid}`);
        await set(userRef, { role: 'staff', dealerId, email, address, name, phone, designation, companyCode, uid: user.uid });

        // Add staff data under the logged-in user's node
        const staffRef = ref(db, `staff/${dealerId}`);
        const newStaffRef = push(staffRef);
        const newStaffId = newStaffRef.key;
        const newStaffData = { id: newStaffId, uid: user.uid, address, email, role: 'staff', name, phone, designation, companyCode, dealerId };
        await set(newStaffRef, newStaffData);

        // Clear cache to force a fresh fetch
        localStorage.removeItem('staffData');

        // Fetch updated staff list
        if (dealerId) {
            dispatch(fetchStaffByDealerId(dealerId));
        } else {
            dispatch(fetchStaff());
        }

        dispatch({ type: ADD_STAFF_SUCCESS, payload: newStaffData });
        dispatch({ type: SET_MESSAGE, payload: 'Staff added successfully' });
    } catch (error) {
        console.error("Error adding staff: ", error);
        dispatch({ type: ADD_STAFF_FAILURE, payload: error.message });
        dispatch({ type: SET_ERROR, payload: 'Failed to add staff' });
        throw error; // Rethrow the error so `handleSubmit` can catch it
    }
};


// Action to fetch staff
export const fetchStaff = () => async (dispatch, getState) => {
    try {
        // Check local storage for existing staff data
        const cachedStaff = localStorage.getItem('staffData');
        if (cachedStaff) {
            console.log('Using cached staff data');
            // If cached data exists, parse it and dispatch the success action
            const staffList = JSON.parse(cachedStaff);
            dispatch({ type: FETCH_STAFF_SUCCESS, payload: staffList });
            return;
        }

        // If no cached data, fetch from Firebase
        const uid = getState().auth.user.role === 'staff' 
            ? getState().auth.user.dealerId 
            : getState().auth.user.uid;

        console.log('Fetching staff for UID:', uid);
        
        const staffRef = ref(db, `staff/${uid}`);
        const snapshot = await get(staffRef);

        if (snapshot.exists()) {
            const staffList = Object.entries(snapshot.val()).map(([id, data]) => ({
                id,
                ...data,
            }));

            // Save the fetched data to local storage for future use
            localStorage.setItem('staffData', JSON.stringify(staffList));
            dispatch({ type: FETCH_STAFF_SUCCESS, payload: staffList });
        } else {
            dispatch({ type: FETCH_STAFF_SUCCESS, payload: [] });
        }
    } catch (error) {
        console.error("Error fetching staff: ", error);
        dispatch({ type: FETCH_STAFF_FAILURE, payload: error.message });
    }
};

// Action to fetch staff based on dealer uid
export const fetchStaffByDealerId = (dealerId) => async (dispatch) => {
    try {
        // Try to get staff from localStorage first
        const cachedData = localStorage.getItem(`staff_${dealerId}`);
        if (cachedData) {
            const { timestamp, data } = JSON.parse(cachedData);
            // Use cached data if it's less than 5 minutes old
            if (Date.now() - timestamp < 5 * 60 * 1000) {
                dispatch({ type: FETCH_STAFF_SUCCESS, payload: data });
                return;
            }
        }

        // If no valid cache, fetch from Firebase
        const staffRef = ref(db, `staff/${dealerId}`);
        const snapshot = await get(staffRef);

        if (snapshot.exists()) {
            const staffList = Object.entries(snapshot.val()).map(([id, data]) => ({
                id,
                ...data,
            }));
            
            // Cache the data with timestamp
            localStorage.setItem(`staff_${dealerId}`, JSON.stringify({
                timestamp: Date.now(),
                data: staffList
            }));
            
            dispatch({ type: FETCH_STAFF_SUCCESS, payload: staffList });
        } else {
            dispatch({ type: FETCH_STAFF_SUCCESS, payload: [] });
        }
    } catch (error) {
        console.error("Error fetching staff by dealer id: ", error);
        dispatch({ type: FETCH_STAFF_FAILURE, payload: error.message });
    }
};

// Action to update staff
export const updateStaff = (staffData) => async (dispatch, getState) => {
    try {
        console.log(staffData);
        const dealerId = staffData.dealerId;
        const staffRef = ref(db, `staff/${dealerId}/${staffData.id}`);
        
        // Update staff data in Firebase
        await set(staffRef, staffData);

        // Update user data in Firebase Authentication
        const userRef = ref(db, `users/${staffData.uid}`);
        await set(userRef, {
            role: 'staff',
            dealerId,
            userData: staffData
        });

        // Clear cache to force a fresh fetch
        localStorage.removeItem('staffData');

        // Fetch updated staff list
        if (dealerId) {
            dispatch(fetchStaffByDealerId(dealerId));
        } else {
            dispatch(fetchStaff());
        }

        dispatch({
            type: UPDATE_STAFF_SUCCESS,
            payload: staffData
        });

        // Show success message
        dispatch({
            type: SET_MESSAGE,
            payload: 'Staff updated successfully'
        });
    } catch (error) {
        console.error('Error updating staff:', error);
        dispatch({
            type: UPDATE_STAFF_FAILURE,
            payload: error.message
        });
        
        // Show error message
        dispatch({
            type: SET_ERROR,
            payload: 'Failed to update staff'
        });
    }
};

// Action to delete staff
export const deleteStaff = (staffId, staffUid, dealerId) => async (dispatch, getState) => {
    try {
        // If dealerId is not provided, get it from state
        const actualDealerId = dealerId || getState().auth.user.uid;
        
        // Delete staff data
        const staffRef = ref(db, `staff/${actualDealerId}/${staffId}`);
        await set(staffRef, null);

        // Delete user role data
        const userRef = ref(db, `users/${staffUid}`);
        await set(userRef, null);

        // Clear cache to force a fresh fetch
        localStorage.removeItem('staffData');

        // Dispatch delete success before fetching updated list
        dispatch({ type: DELETE_STAFF_SUCCESS, payload: staffId });
        dispatch({ type: SET_MESSAGE, payload: 'Staff deleted successfully' });
    } catch (error) {
        console.error("Error deleting staff: ", error);
        dispatch({ type: DELETE_STAFF_FAILURE, payload: error.message });
        dispatch({ type: SET_ERROR, payload: 'Failed to delete staff' });
        throw error; // Re-throw to handle in component
    }
};
