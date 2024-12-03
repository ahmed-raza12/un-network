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
    return async (dispatch) => {
        try {
            const packagesRef = ref(db, `packages/${ispId}`);
            const snapshot = await get(packagesRef);
            const packages = {};

            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    packages[childSnapshot.key] = {
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    };
                });
            }

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
