import { auth, db } from '../firebase';
import { ref, remove, get } from 'firebase/database';
import { deleteUser } from 'firebase/auth';

export const deleteAllUsers = async () => {
    try {
        // First verify that the current user is an admin
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('You must be logged in to perform this action');
        }

        // Get current user's role from the database
        const currentUserRef = ref(db, `users/${currentUser.uid}`);
        const currentUserSnapshot = await get(currentUserRef);
        const currentUserData = currentUserSnapshot.val();

        if (!currentUserData || currentUserData.role !== 'admin') {
            throw new Error('Only admin users can perform this action');
        }

        // Get all users from the database
        const usersRef = ref(db, 'users');
        const usersSnapshot = await get(usersRef);
        const users = usersSnapshot.val();

        if (!users) {
            console.log('No users found in the database');
            return { success: true, message: 'No users found to delete' };
        }

        // Get dealers and staff from the database
        const dealersRef = ref(db, 'dealers');
        const staffRef = ref(db, 'staff');
        const dealersSnapshot = await get(dealersRef);
        const staffSnapshot = await get(staffRef);

        // Delete all dealers data if exists
        if (dealersSnapshot.exists()) {
            await remove(dealersRef);
            console.log('All dealers data deleted from database');
        }

        // Delete all staff data if exists
        if (staffSnapshot.exists()) {
            await remove(staffRef);
            console.log('All staff data deleted from database');
        }

        // Delete users one by one from the database (except admin)
        for (const [uid, userData] of Object.entries(users)) {
            if (userData.role === 'admin') continue; // Skip admin users

            try {
                // Delete user data from database
                const userRef = ref(db, `users/${uid}`);
                await remove(userRef);
                console.log(`Deleted user ${uid} from database`);

                // Try to delete from authentication
                try {
                    // Note: We can only delete the current user from authentication
                    // For other users, they'll need to be deleted through Firebase Console
                    if (auth.currentUser?.uid === uid) {
                        await deleteUser(auth.currentUser);
                        console.log(`Deleted user ${uid} from authentication`);
                    }
                } catch (authError) {
                    console.warn(`Could not delete user ${uid} from authentication:`, authError);
                }
            } catch (error) {
                console.error(`Error deleting user ${uid}:`, error);
            }
        }

        // Delete any associated customer data
        const customersRef = ref(db, 'customers');
        try {
            await remove(customersRef);
            console.log('All customer data deleted');
        } catch (error) {
            console.error('Error deleting customer data:', error);
        }

        return { 
            success: true, 
            message: 'All dealers, staff, and users have been deleted successfully. Note: Some authentication records may need to be cleaned up in the Firebase Console.' 
        };
    } catch (error) {
        console.error('Error in deleteAllUsers:', error);
        return { 
            success: false, 
            message: error.message || 'An error occurred while deleting users' 
        };
    }
};
