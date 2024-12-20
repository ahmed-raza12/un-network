import { create } from "@mui/material/styles/createTransitions";
import { createInvoice } from "../store/actions/invoiceActions";

// import { createInvoice } from './createInvoice'; // Ensure this path is correct

const packages = [
    { name: 'Basic', amount: 1000 },
    { name: 'Premium', amount: 2000 },
    { name: 'Ultra', amount: 3000 },
];

// Generate a random date between start and end date
const getRandomDate = (start, end) => {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
};

// Format date to YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

const generateTestInvoices = async (dispatch) => {
    try {
        // Get customers from localStorage
        const user = localStorage.getItem('authState');
        const parsedUser = JSON.parse(user);
        const dealerId = parsedUser?.user?.uid;

        if (!dealerId) {
            console.error('Dealer ID not found in authState');
            return;
        }

        const customersStr = localStorage.getItem(`customers_${dealerId}`);
        const customers = JSON.parse(customersStr) || [];
        console.log('customers:', customers);
        if (customers.data.length === 0) {
            console.error('No customers found for dealer:', dealerId);
            return;
        }

        const today = new Date();
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 2); // Start from 2 months ago

        const promises = [];
        customers.data.slice(0, 15).forEach((customer) => {
            // 70% chance to create invoices for the customer
            if (Math.random() < 0.3) {
                console.log(`Skipping unpaid customer: ${customer.fullName}`);
                return;
            }

            for (let month = 0; month < 3; month++) {
                const monthStart = new Date(threeMonthsAgo);
                monthStart.setMonth(threeMonthsAgo.getMonth() + month);
                const monthEnd = new Date(monthStart);
                monthEnd.setMonth(monthStart.getMonth() + 1);
                monthEnd.setDate(0);

                const numInvoices = Math.floor(Math.random() * 3) + 1;

                for (let i = 0; i < numInvoices; i++) {
                    const invoiceDate = getRandomDate(monthStart, monthEnd);

                    const invoiceData = {
                        dealerId,
                        customerId: customer.id,
                        userName: customer.userName,
                        fullName: customer.fullName || 'N/A',
                        ispName: customer.ispName || 'N/A',
                        amount: customer.monthlyFee || packages[Math.floor(Math.random() * packages.length)].amount,
                        date: formatDate(invoiceDate),
                        phone: customer.mobile || 'N/A',
                        address: customer.address || 'N/A',
                        status: 'paid',
                    };

                    promises.push(dispatch(createInvoice(invoiceData)));
                }
            }
        });

        await Promise.all(promises);
        console.log('Successfully generated all test invoices');
    } catch (error) {
        console.error('Error generating test invoices:', error);
        throw error;
    }
};

export default generateTestInvoices;
