// actions/invoiceActions.js
import { ref, update, get, push, set } from 'firebase/database';
import { db } from '../../firebase';

export const createInvoice = (invoiceData, uid) => {
    return async (dispatch, getState) => {
        try {
            // const userId = getState().auth.user.role === 'staff' ? getState().auth.user.uid : getState().auth.user.dealerId;
            console.log('Creating invoice for user:', uid);
            const { dealerId, amount, customerId, date } = invoiceData;

            if (!dealerId || !uid) {
                console.error('No dealer ID or UID found');
                return;
            }

            // Parse the date string to get year, month, and day
            const invoiceDate = new Date(date);
            const formattedDate = invoiceDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const year = invoiceDate.getFullYear();

            // Get current invoice number for this user
            const userInvoiceCountRef = ref(db, `userInvoiceCounts/${uid}/${year}`);
            const countSnapshot = await get(userInvoiceCountRef);
            let currentNumber = 0;

            if (countSnapshot.exists()) {
                currentNumber = countSnapshot.val();
            }

            // Increment the counter
            const newNumber = currentNumber + 1;

            // Create invoice ID with timestamp and random string for uniqueness
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 10);
            const invoiceId = `INV-${formattedDate.replace(/-/g, '')}-${timestamp}-${randomString}`;

            // Create invoice path
            const invoicePath = `Invoices/${dealerId}/invoices/${formattedDate}/${invoiceId}`;
            console.log('Saving invoice to path:', invoicePath);

            // Prepare enhanced invoice data
            const enhancedInvoiceData = {
                ...invoiceData,
                invoiceId,
                invoiceNumber: newNumber.toString().padStart(4, '0'), // Format number as 0001, 0002, etc.
                amount: parseFloat(amount),
                createdAt: new Date().toISOString(),
                status: 'paid',
                staffId: uid,
            };

            // Create batch operations for atomic updates
            const batch = {};

            // Save the invoice
            batch[invoicePath] = enhancedInvoiceData;

            // Update the counter
            batch[`userInvoiceCounts/${uid}/${year}`] = newNumber;

            // Update customer's payment history if customerId exists
            if (customerId) {
                const customerHistoryPath = `customerInvoiceHistory/${customerId}/${invoiceId}`;
                batch[customerHistoryPath] = enhancedInvoiceData;
            }

            // Save latest invoice reference for quick lookup
            batch[`latestUserInvoices/${uid}`] = {
                invoiceId,
                invoiceNumber: newNumber.toString().padStart(4, '0'),
                createdAt: enhancedInvoiceData.createdAt
            };

            // Execute all updates atomically
            await update(ref(db), batch);

            // Dispatch success action
            dispatch({
                type: 'CREATE_INVOICE_SUCCESS',
                payload: enhancedInvoiceData
            });

            return enhancedInvoiceData;

        } catch (error) {
            console.error('Error creating invoice:', error);
            dispatch({
                type: 'CREATE_INVOICE_ERROR',
                payload: error.message
            });
            throw error;
        }
    };
};

export const fetchInvoiceDetails = (invoiceId) => async (dispatch) => {
    try {
        const invoiceRef = ref(db, `invoices/${invoiceId}`);
        const snapshot = await get(invoiceRef);

        if (snapshot.exists()) {
            const invoiceData = snapshot.val();
            dispatch({ type: 'FETCH_INVOICE_DETAILS_SUCCESS', payload: invoiceData });
        } else {
            dispatch({ type: 'FETCH_INVOICE_DETAILS_ERROR', error: { message: 'Invoice not found' } });
        }
    } catch (error) {
        console.error('Error fetching invoice details:', error);
        dispatch({ type: 'FETCH_INVOICE_DETAILS_ERROR', error });
    }
};

export const fetchInvoicesByCustomerUid = (customerUid) => async (dispatch) => {
    try {
        const invoicesRef = ref(db, `customerInvoiceHistory/${customerUid}`);
        const snapshot = await get(invoicesRef);
        console.log('Initial snapshot:', customerUid, snapshot.val());

        if (snapshot.exists()) {
            const invoicesData = snapshot.val();

            // Structure the invoices into an array
            const invoicesList = Object.keys(invoicesData).map((invoiceId) => ({
                id: invoiceId,
                ...invoicesData[invoiceId],
            }));
            console.log('Invoices list:', invoicesList);
            dispatch({
                type: 'FETCH_INVOICES_SUCCESS',
                payload: invoicesList
            });
        } else {
            dispatch({
                type: 'FETCH_INVOICES_SUCCESS',
                payload: []
            });
        }
    } catch (error) {
        console.error('Error fetching customer invoices:', error);
        dispatch({
            type: 'FETCH_INVOICES_ERROR',
            error: { message: error.message || 'Failed to fetch invoices' }
        });
    }
};

export const fetchInvoicesByDateRange = (startDate, endDate, paymentStatus = 'paid') => async (dispatch, getState) => {
    try {
        dispatch({ type: 'FETCH_INVOICES_START' });

        const dealerId = getState().auth.user.uid;
        if (!dealerId) throw new Error('User not authenticated');

        const startMonth = startDate.getMonth() + 1;
        const startYear = startDate.getFullYear();
        const endMonth = endDate.getMonth() + 1;
        const endYear = endDate.getFullYear();

        console.log('Fetching invoices for date range:', {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            startMonth,
            startYear,
            endMonth,
            endYear,
            dealerId
        });

        let allInvoices = [];

        // Fetch invoices for each month in the range
        for (let year = startYear; year <= endYear; year++) {
            const monthStart = year === startYear ? startMonth : 1;
            const monthEnd = year === endYear ? endMonth : 12;

            for (let month = monthStart; month <= monthEnd; month++) {
                const monthRef = ref(db, `invoices/${dealerId}/${year}/${month}`);
                console.log('Fetching from path:', `invoices/${dealerId}/${year}/${month}`);

                const monthSnapshot = await get(monthRef);

                if (monthSnapshot.exists()) {
                    const monthData = monthSnapshot.val();
                    console.log('Month data:', monthData);

                    // Convert object to array if it's an object
                    const monthInvoices = Object.values(monthData);
                    allInvoices = [...allInvoices, ...monthInvoices];
                }
            }
        }

        // Filter invoices by date range
        let filteredInvoices = allInvoices.filter(invoice => {
            const invoiceDate = new Date(invoice.date);
            console.log('Comparing dates:', {
                invoiceDate,
                startDate,
                endDate,
                isInRange: invoiceDate >= startDate && invoiceDate <= endDate
            });
            return invoiceDate >= startDate && invoiceDate <= endDate;
        });

        console.log('Filtered invoices:', filteredInvoices);

        // Sort all entries by date, most recent first
        filteredInvoices.sort((a, b) => new Date(b.date) - new Date(a.date));

        dispatch({
            type: 'FETCH_INVOICES_SUCCESS',
            payload: filteredInvoices
        });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        dispatch({
            type: 'FETCH_INVOICES_ERROR',
            payload: error.message
        });
    }
};
