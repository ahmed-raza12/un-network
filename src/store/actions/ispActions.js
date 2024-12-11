import { db } from '../../firebase';
import { ref, set, get, push } from 'firebase/database';

// Action Types
export const ADD_ISP_SUCCESS = 'ADD_ISP_SUCCESS';
export const ADD_ISP_FAILURE = 'ADD_ISP_FAILURE';
export const FETCH_ISPS_SUCCESS = 'FETCH_ISPS_SUCCESS';
export const FETCH_ISPS_FAILURE = 'FETCH_ISPS_FAILURE';
export const DELETE_ISP_SUCCESS = 'DELETE_ISP_SUCCESS';
export const DELETE_ISP_FAILURE = 'DELETE_ISP_FAILURE';
export const UPDATE_ISP_SUCCESS = 'UPDATE_ISP_SUCCESS';
export const UPDATE_ISP_FAILURE = 'UPDATE_ISP_FAILURE';

// Action to add ISP
export const addISP = (ispData, dealerId = null) => async (dispatch, getState) => {
    try {
        const user = getState().auth.user;
        const uid = dealerId || user.uid;  // Use dealerId if provided (admin case), otherwise use user's uid
        
        // Add ISP data under the specified user's node
        const ispsRef = ref(db, `isps/${uid}`);
        const newIspRef = push(ispsRef);
        const ispId = newIspRef.key;

        await set(newIspRef, {
            ...ispData,
            createdAt: Date.now(),
            id: ispId,
            dealerId: uid // Store the dealer ID with the ISP
        });

        dispatch({
            type: ADD_ISP_SUCCESS,
            payload: { ...ispData, id: ispId, dealerId: uid }
        });

        return ispId;
    } catch (error) {
        console.error('Error adding ISP:', error);
        dispatch({
            type: ADD_ISP_FAILURE,
            payload: error.message
        });
        throw error;
    }
}; 

// Action to fetch ISPs
export const fetchISPs = (dealerId = null) => async (dispatch, getState) => {
    try {
        const user = getState().auth.user;
        const uid = dealerId || user.uid;  // Use dealerId if provided (admin case), otherwise use user's uid
        
        const ispsRef = ref(db, `isps/${uid}`);
        const snapshot = await get(ispsRef);
        
        const isps = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                isps.push({
                    ...childSnapshot.val(),
                    id: childSnapshot.key
                });
            });
            localStorage.setItem(`isps_${uid}`, JSON.stringify(isps));
        }

        dispatch({
            type: FETCH_ISPS_SUCCESS,
            payload: isps
        });
    } catch (error) {
        console.error('Error fetching ISPs:', error);
        dispatch({
            type: FETCH_ISPS_FAILURE,
            payload: error.message
        });
    }
};

// Action to delete ISP
export const deleteISP = (ispId, dealerId = null) => async (dispatch, getState) => {
    try {
        const user = getState().auth.user;
        const uid = dealerId || user.uid;  // Use dealerId if provided (admin case), otherwise use user's uid
        const ispRef = ref(db, `isps/${uid}/${ispId}`);
        await set(ispRef, null);

        dispatch({
            type: DELETE_ISP_SUCCESS,
            payload: ispId
        });
    } catch (error) {
        console.error('Error deleting ISP:', error);
        dispatch({
            type: DELETE_ISP_FAILURE,
            payload: error.message
        });
        throw error;
    }
};

// Action to update ISP
export const updateISP = (ispId, ispData, dealerId = null) => async (dispatch, getState) => {
    try {
        const user = getState().auth.user;
        const uid = dealerId || user.uid;  // Use dealerId if provided (admin case), otherwise use user's uid
        const ispRef = ref(db, `isps/${uid}/${ispId}`);
        await set(ispRef, {
            ...ispData,
            updatedAt: Date.now(),
            id: ispId
        });

        dispatch({
            type: UPDATE_ISP_SUCCESS,
            payload: { ...ispData, id: ispId }
        });
    } catch (error) {
        console.error('Error updating ISP:', error);
        dispatch({
            type: UPDATE_ISP_FAILURE,
            payload: error.message
        });
        throw error;
    }
};
