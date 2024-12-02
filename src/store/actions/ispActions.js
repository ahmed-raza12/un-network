
import { db } from '../../firebase';
import { ref, set, get, push } from 'firebase/database';

// Action Types
export const ADD_ISP_SUCCESS = 'ADD_ISP_SUCCESS';
export const ADD_ISP_FAILURE = 'ADD_ISP_FAILURE';
export const FETCH_ISPS_SUCCESS = 'FETCH_ISPS_SUCCESS';
export const FETCH_ISPS_FAILURE = 'FETCH_ISPS_FAILURE';

// Action to add ISP
export const addISP = (ispData) => async (dispatch, getState) => {
    try {
        // Get the uid from the auth reducer
        const uid = getState().auth.user.uid;
        
        // Add ISP data under the logged-in user's node
        const ispsRef = ref(db, `isps/${uid}`);
        const newIspRef = push(ispsRef);
        const ispId = newIspRef.key;

        await set(newIspRef, {
            ...ispData,
            createdAt: Date.now(),
            id: ispId
        });

        dispatch({
            type: ADD_ISP_SUCCESS,
            payload: { ...ispData, id: ispId }
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
export const fetchISPs = () => async (dispatch, getState) => {
    try {
        // Get the uid from the auth reducer
        const uid = getState().auth.user.uid;
        
        const ispsRef = ref(db, `isps/${uid}`);
        const snapshot = await get(ispsRef);

        if (snapshot.exists()) {
            const isps = Object.entries(snapshot.val()).map(([id, data]) => ({
                id,
                ...data
            }));
            
            dispatch({
                type: FETCH_ISPS_SUCCESS,
                payload: isps
            });
        } else {
            dispatch({
                type: FETCH_ISPS_SUCCESS,
                payload: []
            });
        }
    } catch (error) {
        console.error('Error fetching ISPs:', error);
        dispatch({
            type: FETCH_ISPS_FAILURE,
            payload: error.message
        });
    }
};
