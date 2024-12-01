import { ref, set, push } from 'firebase/database';
import { db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

// Function to generate a timestamp suffix for emails
const getTimestampSuffix = () => {
    const now = new Date();
    return `${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}`;
};

const dealerData = [
    {
        name: "Skynet Communications",
        address: "123 Tech Park, Silicon Valley",
        mobile: "1234567890",
        email: "skynet@example.com"
    },
    {
        name: "Digital Wave Networks",
        address: "456 Cyber Street, Digital City",
        mobile: "2345678901",
        email: "digitalwave@example.com"
    },
    {
        name: "Quantum Internet Solutions",
        address: "789 Quantum Road, Future Town",
        mobile: "3456789012",
        email: "quantum@example.com"
    }
];

const staffRoles = ['Manager', 'Technician', 'Customer Support', 'Sales Representative', 'Account Manager'];

const generateStaffEmail = (dealerName, role, index) => {
    const cleanDealerName = dealerName.toLowerCase().replace(/\s+/g, '');
    const timestamp = getTimestampSuffix();
    return `${role.toLowerCase().replace(/\s+/g, '')}${index}.${timestamp}@${cleanDealerName}.com`;
};

const generateTestDealers = async () => {
    try {
        const dealers = [];
        const timestamp = getTimestampSuffix();

        // Create dealers
        for (const dealer of dealerData) {
            try {
                // Add timestamp to dealer email to make it unique
                const emailParts = dealer.email.split('@');
                const uniqueEmail = `${emailParts[0]}.${timestamp}@${emailParts[1]}`;

                // Create authentication for dealer
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    uniqueEmail,
                    'password123' // Default password for testing
                );
                const user = userCredential.user;

                // Add dealer role to users
                const userRef = ref(db, `users/${user.uid}`);
                const dealerDataWithEmail = {
                    ...dealer,
                    email: uniqueEmail
                };
                await set(userRef, { role: 'dealer', dealerId: user.uid, userData: dealerDataWithEmail });

                // Add dealer data to dealers collection
                const dealerRef = ref(db, 'dealers');
                const newDealerRef = push(dealerRef);
                const dealerInfo = {
                    uid: user.uid,
                    ...dealerDataWithEmail,
                    role: 'dealer'
                };
                await set(newDealerRef, dealerInfo);
                dealers.push(dealerInfo);

                // Generate 5 staff members for each dealer
                for (let i = 0; i < 5; i++) {
                    const role = staffRoles[i];
                    const staffEmail = generateStaffEmail(dealer.name, role, i + 1);
                    
                    try {
                        // Create authentication for staff
                        const staffCredential = await createUserWithEmailAndPassword(
                            auth,
                            staffEmail,
                            'staffpass123' // Default password for testing
                        );
                        const staffUser = staffCredential.user;

                        // Create staff data
                        const staffInfo = {
                            uid: staffUser.uid,
                            firstName: `${role}`,
                            lastName: `${i + 1}`,
                            email: staffEmail,
                            phone: `555${String(i).padStart(7, '0')}`,
                            address: `${i + 1} Staff Street`,
                            designation: role,
                            role: 'staff'
                        };

                        // Add staff role to users
                        const staffUserRef = ref(db, `users/${staffUser.uid}`);
                        await set(staffUserRef, { 
                            role: 'staff', 
                            dealerId: user.uid,
                            userData: staffInfo 
                        });

                        // Add staff under dealer's staff collection
                        const staffRef = ref(db, `staff/${user.uid}`);
                        const newStaffRef = push(staffRef);
                        await set(newStaffRef, staffInfo);

                    } catch (staffError) {
                        console.error(`Error creating staff member for ${dealer.name}:`, staffError);
                    }
                }
            } catch (dealerError) {
                console.error(`Error creating dealer ${dealer.name}:`, dealerError);
            }
        }

        // Save dealers to localStorage for other operations
        localStorage.setItem('dealers', JSON.stringify(dealers));
        
        return true;
    } catch (error) {
        console.error('Error in generateTestDealers:', error);
        throw error;
    }
};

export default generateTestDealers;
