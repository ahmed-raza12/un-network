import { ref, onValue, off } from 'firebase/database';
import { db } from '../firebase';
import store from '../store/store';

// Map to store active database listeners
const activeListeners = new Map();

// Function to start real-time sync for a specific data type
export const startRealtimeSync = (dataType, dealerId = null) => {
    // If a listener already exists for this data type, remove it first
    stopRealtimeSync(dataType);

    // Get user info from Redux store
    const state = store.getState();
    const user = state.auth.user;
    const uid = dealerId || (user.role === 'staff' ? user.dealerId : user.uid);

    let dbPath;
    switch (dataType) {
        case 'customers':
            dbPath = `customers/${uid}`;
            break;
        case 'dealers':
            dbPath = 'dealers';
            break;
        case 'staff':
            dbPath = `staff/${uid}`;
            break;
        case 'isps':
            dbPath = `isps/${uid}`;
            break;
        case 'packages':
            dbPath = `packages/${uid}`;
            break;
        default:
            console.error(`Invalid data type: ${dataType}`);
            return;
    }

    // Create database reference
    const dbRef = ref(db, dbPath);

    // Create and store the listener
    const listener = onValue(dbRef, (snapshot) => {
        const data = snapshot.exists() ? Object.entries(snapshot.val()).map(([id, value]) => ({
            id,
            ...value
        })) : [];

        // Update localStorage
        localStorage.setItem(`${dataType}_${uid}`, JSON.stringify({
            timestamp: Date.now(),
            data
        }));

        // Dispatch appropriate action to update Redux store
        store.dispatch({
            type: `FETCH_${dataType.toUpperCase()}_SUCCESS`,
            payload: data
        });
    }, (error) => {
        console.error(`Error in ${dataType} listener:`, error);
        store.dispatch({
            type: `FETCH_${dataType.toUpperCase()}_FAILURE`,
            payload: error.message
        });
    });

    // Store the listener reference
    activeListeners.set(dataType, { listener, ref: dbRef });
};

// Function to stop real-time sync for a specific data type
export const stopRealtimeSync = (dataType) => {
    const listenerInfo = activeListeners.get(dataType);
    if (listenerInfo) {
        off(listenerInfo.ref); // Remove the listener
        activeListeners.delete(dataType);
    }
};

// Function to stop all real-time syncs
export const stopAllRealtimeSyncs = () => {
    activeListeners.forEach((listenerInfo, dataType) => {
        stopRealtimeSync(dataType);
    });
};

// Function to clear all localStorage data
export const clearLocalStorage = () => {
    const keysToKeep = ['theme']; // Add any keys you want to preserve
    const state = store.getState();
    const user = state.auth.user;
    const uid = user?.role === 'staff' ? user.dealerId : user?.uid;

    // Get all keys from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Skip keys we want to keep
        if (keysToKeep.includes(key)) {
            continue;
        }

        // Clear dealer-specific data
        if (uid && key.includes(uid)) {
            localStorage.removeItem(key);
            continue;
        }

        // Clear general data
        if (key.includes('customers_') || 
            key.includes('dealers_') ||
            key.includes('staff_') ||
            key.includes('isps_') ||
            key.includes('packages_') ||
            key.includes('selectedDealer') ||
            key.includes('invoices_') ||
            key.includes('reports_')) {
            localStorage.removeItem(key);
        }
    }
};

// Function to start all necessary real-time syncs based on user role
export const startAllRealtimeSyncs = () => {
    const state = store.getState();
    const user = state.auth.user;
    if (!user) return;

    // Start syncs based on user role
    switch (user.role) {
        case 'admin':
            startRealtimeSync('dealers');
            startRealtimeSync('customers');
            startRealtimeSync('staff');
            startRealtimeSync('isps');
            startRealtimeSync('packages');
            break;
        case 'dealer':
            startRealtimeSync('customers');
            startRealtimeSync('staff');
            startRealtimeSync('isps');
            startRealtimeSync('packages');
            break;
        case 'staff':
            startRealtimeSync('customers');
            startRealtimeSync('isps');
            startRealtimeSync('packages');
            break;
        default:
            console.error(`Unknown user role: ${user.role}`);
    }
};
