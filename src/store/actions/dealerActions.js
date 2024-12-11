import { ref, set, push, get, child, query, orderByChild, equalTo, update } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from '../../firebase';

// Action Types
export const ADD_DEALER_SUCCESS = 'ADD_DEALER_SUCCESS';
export const ADD_DEALER_FAILURE = 'ADD_DEALER_FAILURE';
export const FETCH_DEALERS_SUCCESS = 'FETCH_DEALERS_SUCCESS';
export const FETCH_DEALERS_FAILURE = 'FETCH_DEALERS_FAILURE';
export const UPDATE_DEALER_SUCCESS = 'UPDATE_DEALER_SUCCESS';
export const UPDATE_DEALER_FAILURE = 'UPDATE_DEALER_FAILURE';
export const DELETE_DEALER_SUCCESS = 'DELETE_DEALER_SUCCESS';
export const DELETE_DEALER_FAILURE = 'DELETE_DEALER_FAILURE';

// Action to register a dealer
export const registerDealer = (email, password, dealerData, dealerId) => async (dispatch) => {
    const auth = getAuth();
    const {address, name, phone, area, cnic, companyCode} = dealerData
    try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // This is the authenticated user
        
        // Add dealer role to the Realtime Database
        const userRef = ref(db, `users/${user.uid}`);
        await set(userRef, { role: 'dealer', dealerId, email, address, name, phone, area, cnic, companyCode });

        // Add dealer data to Realtime Database
        const dealerRef = ref(db, 'dealers');
        const newDealerRef = push(dealerRef);
        await set(newDealerRef, { uid: user.uid, role: 'dealer', dealerId, email, address, name, phone, area, cnic, companyCode });

        dispatch({ type: ADD_DEALER_SUCCESS, payload: { uid: user.uid, role: 'dealer', dealerId, email, address, name, phone, area, cnic, companyCode } }); // Dispatch success action
    } catch (error) {
        console.error("Error adding dealer: ", error);
        dispatch({ type: ADD_DEALER_FAILURE, payload: error.message }); // Dispatch failure action
    }
};

// Action to fetch dealers
export const fetchDealers = () => async (dispatch) => {
    let dealers = [];
    console.log(dealers, 'fetch dealers');
    try {
        const dealerRef = ref(db, 'dealers');
        const snapshot = await get(dealerRef);

        if (snapshot.exists()) {
            const dealers = Object.entries(snapshot.val()).map(([id, data]) => ({
                id,
                ...data
            }));
            localStorage.setItem('dealers', JSON.stringify(dealers));
            dispatch({ type: FETCH_DEALERS_SUCCESS, payload: dealers }); // Dispatch success action
        } else {
            dispatch({ type: FETCH_DEALERS_SUCCESS, payload: [] }); // Dispatch success action with empty list
        }
    } catch (error) {
        console.error("Error fetching dealers: ", error);
        dispatch({ type: FETCH_DEALERS_FAILURE, payload: error.message }); // Dispatch failure action
    }
};

// Action to update a dealer
export const updateDealer = (dealerId, dealerData) => async (dispatch) => {
    try {
        // Get all dealers and find the one we want to update
        // Update user in users node
        console.log(dealerData, 'dealerData');      
        const userRef = ref(db, `users/${dealerData.uid}`);
        await update(userRef, { ...dealerData });
        
        const dealersRef = ref(db, 'dealers');
        const snapshot = await get(dealersRef);
        
        if (snapshot.exists()) {
            const dealers = snapshot.val();
            // Find the dealer entry with matching uid
            const [firebaseKey] = Object.entries(dealers).find(([_, dealer]) => 
                dealer.uid === dealerData.uid
            ) || [];
            
            if (firebaseKey) {
                // Update the dealer using their Firebase key
                const dealerRef = ref(db, `dealers/${firebaseKey}`);
                await set(dealerRef, dealerData);
                
                dispatch({ type: UPDATE_DEALER_SUCCESS, payload: { id: dealerId, ...dealerData } });
            } else {
                throw new Error('Dealer not found');
            }
        } else {
            throw new Error('No dealers found');
        }
    } catch (error) {
        console.error("Error updating dealer: ", error);
        dispatch({ type: UPDATE_DEALER_FAILURE, payload: error.message });
    }
};

// Action to delete a dealer
export const deleteDealer = (dealerId) => async (dispatch) => {
    try {
        const dealerRef = ref(db, `dealers/${dealerId}`);
        await set(dealerRef, null);
        
        dispatch({ type: DELETE_DEALER_SUCCESS, payload: dealerId });
    } catch (error) {
        console.error("Error deleting dealer: ", error);
        dispatch({ type: DELETE_DEALER_FAILURE, payload: error.message });
    }
};
