import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, push, get } from "firebase/database";
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

// Action to add staff
export const addStaff = (email, password, staffData, dealerId) => async (dispatch, getState) => {
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
                
        // Add dealer role to the Realtime Database
        const userRef = ref(db, `users/${user.uid}`);
        await set(userRef, { role: 'staff', dealerId, userData: staffData });
        // Access the uid from the Redux state
        const userId = getState().auth.user.uid;
        
        // Add staff data under the logged-in user's node
        const staffRef = ref(db, `staff/${userId}`);
        const newStaffRef = push(staffRef);
        await set(newStaffRef, { uid: user.uid, ...staffData });

        dispatch({ type: ADD_STAFF_SUCCESS, payload: staffData });
    } catch (error) {
        console.error("Error adding staff: ", error);
        dispatch({ type: ADD_STAFF_FAILURE, payload: error.message });
    }
};


// Action to fetch staff
export const fetchStaff = () => async (dispatch, getState) => {
    try {
        // Get the uid from the auth reducer
        const uid = getState().auth.user.uid;
        console.log(uid);
        
        const staffRef = ref(db, `staff/${uid}`);
        const snapshot = await get(staffRef);

        if (snapshot.exists()) {
            const staffList = Object.entries(snapshot.val()).map(([id, data]) => ({
                id,
                ...data,
            }));

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
export const updateStaff = (staffId, staffData) => async (dispatch, getState) => {
    try {
        const dealerId = getState().auth.user.uid;
        
        // Update staff data
        const staffRef = ref(db, `staff/${dealerId}/${staffId}`);
        await set(staffRef, staffData);

        // Update user role data
        const userRef = ref(db, `users/${staffData.uid}`);
        await set(userRef, { 
            role: 'staff', 
            dealerId, 
            staffData 
        });

        dispatch({ type: UPDATE_STAFF_SUCCESS, payload: { id: staffId, ...staffData } });
    } catch (error) {
        console.error("Error updating staff: ", error);
        dispatch({ type: UPDATE_STAFF_FAILURE, payload: error.message });
    }
};

// Action to delete staff
export const deleteStaff = (staffId, staffUid) => async (dispatch, getState) => {
    try {
        const dealerId = getState().auth.user.uid;
        
        // Delete staff data
        const staffRef = ref(db, `staff/${dealerId}/${staffId}`);
        await set(staffRef, null);

        // Delete user role data
        const userRef = ref(db, `users/${staffUid}`);
        await set(userRef, null);

        dispatch({ type: DELETE_STAFF_SUCCESS, payload: staffId });
    } catch (error) {
        console.error("Error deleting staff: ", error);
        dispatch({ type: DELETE_STAFF_FAILURE, payload: error.message });
    }
};
