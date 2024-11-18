import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, push, get } from "firebase/database";
import { db } from "../../firebase";

// Action Types
export const ADD_STAFF_SUCCESS = "ADD_STAFF_SUCCESS";
export const ADD_STAFF_FAILURE = "ADD_STAFF_FAILURE";
export const FETCH_STAFF_SUCCESS = "FETCH_STAFF_SUCCESS";
export const FETCH_STAFF_FAILURE = "FETCH_STAFF_FAILURE";

// Action to add staff
export const addStaff = (email, password, staffData, dealerId) => async (dispatch, getState) => {
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
                
        // Add dealer role to the Realtime Database
        const userRef = ref(db, `users/${user.uid}`);
        await set(userRef, { role: 'staff', dealerId });
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
        const staffRef = ref(db, `staff/${dealerId}`);
        const snapshot = await get(staffRef);

        if (snapshot.exists()) {
            const staffList = Object.entries(snapshot.val()).map(([id, data]) => ({
                id,
                ...data,
            }));
            console.log(staffList);
            
            dispatch({ type: FETCH_STAFF_SUCCESS, payload: staffList });
        } else {
            dispatch({ type: FETCH_STAFF_SUCCESS, payload: [] });
        }
    } catch (error) {
        console.error("Error fetching staff by dealer id: ", error);
        dispatch({ type: FETCH_STAFF_FAILURE, payload: error.message });
    }
};
