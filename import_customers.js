import { initializeApp } from "firebase/app";
import { getDatabase,  ref, set, push } from 'firebase/database';
import fs from 'fs';
// Your Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyDVUA2FtMGPybk1gFt5GoQ0091k1bPAw-M",
    authDomain: "business-management-app-70a93.firebaseapp.com",
    databaseURL: "https://business-management-app-70a93-default-rtdb.firebaseio.com",
    projectId: "business-management-app-70a93",
    storageBucket: "business-management-app-70a93.firebasestorage.app",
    messagingSenderId: "861187083442",
    appId: "1:861187083442:web:677d064945d50fd4a4cdab",
    measurementId: "G-FKVVD8MVVX"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function importCustomers() {
    try {
        // Read the JSON file
        const rawData = fs.readFileSync('customers.json');
        const customers = JSON.parse(rawData);

        console.log(`Processing ${customers.length} customers...`);

        // Process each customer
        for (const customer of customers) {
            // Generate a new reference with auto ID

            const  uid = '1bHVdTrCiuWAb2VjCRaSlhph0Af2'
            const newCustomerRef = push(ref(db, `customers/${uid}`));
            // Get the auto-generated key
            const newId = newCustomerRef.key;
            
            // Add the data with the new ID
            await set(newCustomerRef, {
                ...customer,
                id: newId  // Optionally add the ID to the customer data itself
            });
            
            console.log(`Added customer with ID: ${newId}`);
        }

        console.log('Import completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error importing customers:', error);
        process.exit(1);
    }
}

// Run the import
importCustomers();
