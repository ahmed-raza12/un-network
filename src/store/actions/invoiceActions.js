// actions/invoiceActions.js
import { ref, update, get, push, set } from 'firebase/database';
import { db } from '../../firebase';

export const createInvoice = (invoiceData) => {
    return async (dispatch) => {
        try {
            const { dealerId, customerId } = invoiceData;

            if (!dealerId) {
                console.error('No dealer ID found');
                return;
            }

            // Parse the date string to get year and month
            const invoiceDate = new Date(invoiceData.date);
            const year = invoiceDate.getFullYear();
            const month = String(invoiceDate.getMonth() + 1).padStart(2, '0');

            // Generate invoice number
            const timestamp = Date.now();
            const invoiceNo = `INV-${year}${month}-${String(timestamp).slice(-3)}`;

            // Create invoice path
            const invoicePath = `invoices/${dealerId}/${year}/${month}/${customerId}`;
            console.log('Saving invoice to path:', invoicePath);

            // Create invoice reference
            const invoiceRef = ref(db, invoicePath);

            // Add additional fields
            const enhancedInvoiceData = {
                ...invoiceData,
                invoiceNo,
                amount: parseFloat(invoiceData.amount),
                createdAt: new Date().toISOString(),
                status: 'paid',
                year,
                month
            };

            // Save invoice
            await set(invoiceRef, enhancedInvoiceData);

            // Update customer's payment history
            if (customerId) {
                const customerHistoryPath = `customerInvoiceHistory/${customerId}/monthlyInvoices/${year}/${month}`;
                console.log('Updating customer history at:', customerHistoryPath);
                
                const historyRef = ref(db, customerHistoryPath);
                await set(historyRef, enhancedInvoiceData);
            }

            // Dispatch success action
            dispatch({
                type: 'CREATE_INVOICE_SUCCESS',
                payload: enhancedInvoiceData
            });

        } catch (error) {
            console.error('Error creating invoice:', error);
            dispatch({
                type: 'CREATE_INVOICE_ERROR',
                payload: error.message
            });
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
        const invoicesRef = ref(db, `customerInvoiceHistory/${customerUid}/monthlyInvoices`);
        const snapshot = await get(invoicesRef);
        console.log('Initial snapshot:', snapshot.val());

        if (snapshot.exists()) {
            const invoicesPromises = [];

            // Collect all invoice references
            snapshot.forEach((yearSnapshot) => {
                const year = yearSnapshot.key;
                yearSnapshot.forEach((monthSnapshot) => {
                    const month = monthSnapshot.key;
                    const invoiceData = monthSnapshot.val();
                    console.log('Invoice reference data:', invoiceData);

                    // Get the full invoice details from invoices path
                    const invoiceRef = ref(db, `invoices/${invoiceData.dealerId}/${year}/${month}/${customerUid}`);
                    console.log('Fetching from path:', `invoices/${invoiceData.dealerId}/${year}/${month}/${customerUid}`);

                    invoicesPromises.push(
                        get(invoiceRef).then(invoiceSnap => {
                            if (!invoiceSnap.exists()) return null;
                            const data = invoiceSnap.val();
                            console.log('Fetched invoice data:', data);
                            return {
                                id: data.invoiceId || `${year}${month}-${customerUid}`,
                                invoiceNo: data.invoiceNo || `INV-${year}${month}-${customerUid.slice(-4)}`,
                                customerName: data.customerName,
                                ispName: data.ispName,
                                amount: data.amount,
                                createdAt: data.createdAt,
                                status: data.status || 'paid',
                                year,
                                month
                            };
                        })
                    );
                });
            });

            // Wait for all invoice details to be fetched
            const invoicesData = await Promise.all(invoicesPromises);
            console.log('Final invoices data:', invoicesData);

            const validInvoices = invoicesData.filter(invoice => invoice !== null);
            console.log('Valid invoices:', validInvoices);

            // Sort invoices by date, most recent first
            validInvoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            dispatch({
                type: 'FETCH_INVOICES_SUCCESS',
                payload: validInvoices
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
