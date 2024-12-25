import { ref, push, set, get, remove, update } from 'firebase/database';
import { db } from '../../firebase';

// Action Types
export const ADD_PACKAGE = 'ADD_PACKAGE';
export const FETCH_PACKAGES = 'FETCH_PACKAGES';
export const UPDATE_PACKAGE = 'UPDATE_PACKAGE';
export const DELETE_PACKAGE = 'DELETE_PACKAGE';

// Action Creators
export const addPackage = (packageData, ispId) => {
    return async (dispatch) => {
        try {
            const packagesRef = ref(db, `packages/${ispId}`);
            const newPackageRef = push(packagesRef);
            await set(newPackageRef, {
                ...packageData,
                createdAt: new Date().toISOString()
            });
            localStorage.removeItem(`packages_${ispId}`);
            dispatch({
                type: ADD_PACKAGE,
                payload: {
                    id: newPackageRef.key,
                    ...packageData
                }
            });

            return newPackageRef.key;
        } catch (error) {
            console.error('Error adding package:', error);
            throw error;
        }
    };
};

export const fetchPackages = (ispId) => {
    console.log('Fetching packages for ISP:', ispId);
    return async (dispatch) => {
        try {
            const packagesRef = ref(db, `packages/${ispId}`);
            const snapshot = await get(packagesRef);
            let packages = {}; // Change from const to let

            const packageData = localStorage.getItem(`packages_${ispId}`);
            if (packageData) {
                console.log('Using cached packages data', typeof JSON.parse(packageData), packageData);
                // If packages are in localStorage, use them and dispatch
                packages = JSON.parse(packageData);
                dispatch({
                    type: FETCH_PACKAGES,
                    payload: packages
                });
                return packages;
            }
            console.log('Fetching packages from Firebase', snapshot.exists());
            // If no cached data, fetch from Firebase and store in localStorage
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    packages[childSnapshot.key] = {
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    };
                });
                localStorage.setItem(`packages_${ispId}`, JSON.stringify(packages));
            }

            // Save fetched data to localStorage

            // Dispatch the fetched data
            dispatch({
                type: FETCH_PACKAGES,
                payload: packages
            });

            return packages;
        } catch (error) {
            console.error('Error fetching packages:', error);
            throw error;
        }
    };
};

export const updatePackage = (packageId, ispId, updateData) => {
    return async (dispatch) => {
        try {
            const packageRef = ref(db, `packages/${ispId}/${packageId}`);
            await update(packageRef, {
                ...updateData,
                updatedAt: new Date().toISOString()
            });

            dispatch({
                type: UPDATE_PACKAGE,
                payload: {
                    id: packageId,
                    ...updateData
                }
            });
        } catch (error) {
            console.error('Error updating package:', error);
            throw error;
        }
    };
};

export const deletePackage = (packageId, ispId) => {
    return async (dispatch) => {
        try {
            const packageRef = ref(db, `packages/${ispId}/${packageId}`);
            await remove(packageRef);

            dispatch({
                type: DELETE_PACKAGE,
                payload: packageId
            });
        } catch (error) {
            console.error('Error deleting package:', error);
            throw error;
        }
    };
};
