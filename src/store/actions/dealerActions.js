import { ref, set, push, get, child, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from '../../firebase';

// Action Types
export const ADD_DEALER_SUCCESS = 'ADD_DEALER_SUCCESS';
export const ADD_DEALER_FAILURE = 'ADD_DEALER_FAILURE';
export const FETCH_DEALERS_SUCCESS = 'FETCH_DEALERS_SUCCESS';
export const FETCH_DEALERS_FAILURE = 'FETCH_DEALERS_FAILURE';

// Action to register a dealer
export const registerDealer = (email, password, dealerData, dealerId) => async (dispatch) => {
    const auth = getAuth();
    try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // This is the authenticated user
        
        // Add dealer role to the Realtime Database
        const userRef = ref(db, `users/${user.uid}`);
        await set(userRef, { role: 'dealer', dealerId });

        // Add dealer data to Realtime Database
        const dealerRef = ref(db, 'dealers');
        const newDealerRef = push(dealerRef);
        await set(newDealerRef, { uid: user.uid, ...dealerData });

        dispatch({ type: ADD_DEALER_SUCCESS, payload: { uid: user.uid, ...dealerData } }); // Dispatch success action
    } catch (error) {
        console.error("Error adding dealer: ", error);
        dispatch({ type: ADD_DEALER_FAILURE, payload: error.message }); // Dispatch failure action
    }
};

// Action to fetch dealers
export const fetchDealers = () => async (dispatch) => {
    try {
        const dealerRef = ref(db, 'dealers');
        const snapshot = await get(dealerRef);

        if (snapshot.exists()) {
            const dealers = Object.entries(snapshot.val()).map(([id, data]) => ({
                id,
                ...data
            }));
            dispatch({ type: FETCH_DEALERS_SUCCESS, payload: dealers }); // Dispatch success action
        } else {
            dispatch({ type: FETCH_DEALERS_SUCCESS, payload: [] }); // Dispatch success action with empty list
        }
    } catch (error) {
        console.error("Error fetching dealers: ", error);
        dispatch({ type: FETCH_DEALERS_FAILURE, payload: error.message }); // Dispatch failure action
    }
};
