import { ref, set } from 'firebase/database';
import { db } from '../firebase';

const packages = [
    { name: 'Basic Internet', amount: 1000 },
    { name: 'Premium Internet', amount: 2000 },
    { name: 'Ultra Internet', amount: 3000 },
    { name: 'CATV Basic', amount: 500 },
    { name: 'CATV Premium', amount: 1000 }
];

// Generate a random date between start and end date
const getRandomDate = (start, end) => {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
};

// Format date to YYYY-MM-DD
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

const generateTestInvoices = async () => {
    try {
        // Get customers from localStorage
        const user = localStorage.getItem('authState');
        console.log('Raw authState:', user);

        const parsedUser = JSON.parse(user);
        console.log('Parsed user:', parsedUser);

        const dealerId = parsedUser?.user?.dealerId;
        console.log('Dealer ID:', dealerId);

        const customersStr = localStorage.getItem(`customers_${dealerId}`) || JSON.stringify(customers);
        console.log('Raw customers from localStorage:', customersStr);

        const customers = JSON.parse(customersStr) || [];
        console.log('Parsed customers:', customers);

        if (customers.length === 0) {
            console.error('No customers found in localStorage');
            return;
        }

        // Generate invoices only for randomly selected "paid" customers
        const promises = [];
        customers.slice(0, 15).forEach(customer => {
            // Randomly decide if this customer is a paying customer (70% chance)
            const isPaidCustomer = Math.random() < 0.7;

            if (!isPaidCustomer) {
                console.log(`Customer ${customer.fullName} marked as unpaid - skipping invoice generation`);
                return;
            }

            const customerId = customer.id;
            console.log('Processing paid customer:', customerId);

            if (!customerId) {
                console.error('Customer has no id:', customer);
                return;
            }

            // Generate invoices for the last 3 months
            const today = new Date();
            const threeMonthsAgo = new Date(today);
            threeMonthsAgo.setMonth(today.getMonth() - 2); // Start from 2 months ago

            let invoiceNumber = 1;

            // Generate multiple invoices per month for each customer
            for (let month = 0; month < 3; month++) {
                const monthStart = new Date(threeMonthsAgo);
                monthStart.setMonth(threeMonthsAgo.getMonth() + month);
                const monthEnd = new Date(monthStart);
                monthEnd.setMonth(monthStart.getMonth() + 1);
                monthEnd.setDate(0); // Last day of the month

                // Generate 1-3 invoices per customer per month
                const numInvoices = Math.floor(Math.random() * 3) + 1;

                for (let i = 0; i < numInvoices; i++) {
                    const invoiceDate = getRandomDate(monthStart, monthEnd);
                    const year = invoiceDate.getFullYear();
                    const month = String(invoiceDate.getMonth() + 1).padStart(2, '0');

                    const invoice = {
                        invoiceNo: `INV-${year}${month}-${String(invoiceNumber).padStart(3, '0')}-${String(invoiceDate.getHours()).padStart(2, '0')}${String(invoiceDate.getMinutes()).padStart(2, '0')}`,
                        customerId: customer.id,
                        userName: customer.userName,
                        customerName: customer.fullName || 'N/A',
                        ispName: customer.ispName || 'N/A',
                        amount: customer.monthlyFee || packages[Math.floor(Math.random() * packages.length)].amount,
                        date: formatDate(invoiceDate),
                        createdAt: invoiceDate.toISOString(),
                        status: 'paid', // All generated invoices are paid
                        phone: customer.mobile || 'N/A',
                        address: customer.address || 'N/A'
                    };

                    // Save invoice under the correct year/month path
                    const invoicePath = `invoices/${dealerId}/${year}/${month}/${invoice.invoiceNo}`;
                    promises.push(set(ref(db, invoicePath), invoice));

                    // Save reference in customer history
                    const historyPath = `customerInvoiceHistory/${customerId}/monthlyInvoices/${year}/${month}`;
                    promises.push(set(ref(db, historyPath), invoice));

                    invoiceNumber++;
                }
            }
        });

        await Promise.all(promises);
        console.log('Successfully generated and saved all test invoices');
        return true;
    } catch (error) {
        console.error('Error generating test invoices:', error);
        throw error;
    }
};

export default generateTestInvoices;
