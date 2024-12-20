// actions/reportActions.js
import { getDatabase, ref, query, orderByChild, orderByKey, startAt, endAt, get } from 'firebase/database';
import { db } from '../../firebase';

export const fetchTodayInvoicesByStaff = (dealerId, staffId) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_TODAY_INVOICES_REQUEST' });
    console.log(dealerId, staffId, 'staff');
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      
      const invoicesPath = `Invoices/${dealerId}/invoices/${formattedDate}`;
      const invoicesRef = ref(db, invoicesPath);
      
      const snapshot = await get(invoicesRef);
      console.log('Today\'s invoices snapshot:', snapshot.val());
      
      if (snapshot.exists()) {
        const todayInvoices = snapshot.val();
        const invoicesList = [];

        // Convert invoices object to array and filter by staffId
        Object.keys(todayInvoices).forEach((invoiceId) => {
          const invoice = {
            id: invoiceId,
            ...todayInvoices[invoiceId],
          };
          // Only add invoices that match the staffId (if provided)
          if (!staffId || invoice.staffId === staffId) {
            console.log(invoice.staffId === staffId, 'invoice');
            invoicesList.push(invoice);
          }
        });
      
        dispatch({
          type: 'FETCH_TODAY_INVOICES_SUCCESS',
          payload: invoicesList,
        });
      } else {
        dispatch({
          type: 'FETCH_TODAY_INVOICES_EMPTY',
          payload: [],
        });
      }
    } catch (error) {
      console.error('Error fetching today\'s invoices:', error);
      dispatch({
        type: 'FETCH_TODAY_INVOICES_ERROR',
        payload: error.message,
      });
    }
  };
};

export const fetchInvoicesByDateRanges = (none, startDate, endDate, menuItem) => {
  return async (dispatch, getState) => {
    dispatch({ type: 'FETCH_INVOICES_REQUEST' });
    const uid = getState().auth.user.role === 'staff' ? getState().auth.user.uid : getState().auth.user.dealerId;
    const dealerId = getState().auth.user.role === 'dealer' ? getState().auth.user.uid : getState().auth.user.dealerId;
    console.log(uid, 'uid');
    console.log(dealerId, 'dealerId');
    try {
      const invoicesPath = `Invoices/${dealerId}/invoices`;
      const invoicesRef = ref(db, invoicesPath);
      
      const invoicesQuery = query(
        invoicesRef,
        orderByKey(),
        startAt(startDate),
        endAt(endDate)
      );

      const snapshot = await get(invoicesQuery);
      console.log('Invoices snapshot:', snapshot.val());
      
      if (snapshot.exists()) {
        const allInvoicesByDate = snapshot.val();
        let invoicesList = [];

        Object.keys(allInvoicesByDate).forEach((dateKey) => {
          const invoicesForDate = allInvoicesByDate[dateKey];
          Object.keys(invoicesForDate).forEach((invoiceId) => {
            invoicesList.push({
              id: invoiceId,
              ...invoicesForDate[invoiceId],
            });
          });
        });
        console.log('Invoices list:', uid, dealerId, menuItem);

        // Filter based on menuItem
        if (menuItem === 'onlydealer') {
          console.log('Filtered to only dealers:', invoicesList);
          invoicesList = invoicesList.filter(invoice => invoice.staffId === dealerId);
          // Show all dealer invoices (no additional filtering needed)
        } else if (menuItem !== 'all') {
          // Filter by staffId if a specific staff is selected
          invoicesList = invoicesList.filter(invoice => invoice.staffId === menuItem);
        }
        // If menuItem === 'all', show all invoices (no filtering needed)

        dispatch({
          type: 'FETCH_INVOICES_SUCCESS',
          payload: invoicesList,
        });
      } else {
        dispatch({
          type: 'FETCH_INVOICES_EMPTY',
          payload: [],
        });
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      dispatch({
        type: 'FETCH_INVOICES_ERROR',
        payload: error.message,
      });
    }
  };
};

export const fetchPaidCustomers = (year, month, dealerId) => async (dispatch) => {
    try {
      const invoicesRef = ref(db, `invoices/${dealerId}/${year}/${month}`);
      const snapshot = await get(invoicesRef);
      
      const paidCustomers = [];
      if (snapshot.exists()) {
        snapshot.forEach((invoiceSnap) => {
          const invoice = invoiceSnap.val();
          paidCustomers.push(invoice);
        });
      }
      
      dispatch({ type: 'FETCH_PAID_CUSTOMERS_SUCCESS', payload: paidCustomers });
    } catch (error) {
      dispatch({ type: 'FETCH_PAID_CUSTOMERS_ERROR', error });
    }
};
 
export const fetchInvoicesByDateRange = (startDate, endDate, paymentStatus = 'paid') => async (dispatch, getState) => {
  try {
    dispatch({ type: 'FETCH_REPORT_START' });

    const { user } = getState().auth;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const dealerId = user.dealerId || user.uid;
    if (!dealerId) {
      throw new Error('Dealer ID not found');
    }

    // Convert dates to local timezone for comparison
    const localStartDate = new Date(startDate);
    const localEndDate = new Date(endDate);

    console.log('Date range:', {
      startDate: localStartDate.toISOString(),
      endDate: localEndDate.toISOString(),
      startLocal: localStartDate.toLocaleString(),
      endLocal: localEndDate.toLocaleString()
    });

    // First get all customers for this dealer
    const dealerCustomersRef = ref(db, `customers/${dealerId}`);
    const customersSnapshot = await get(dealerCustomersRef);
    const customers = customersSnapshot.val() || {};
    const allCustomerIds = Object.keys(customers || {});

    console.log(`Found ${allCustomerIds.length} total customers`);

    let allInvoices = [];
    
    // Get all months between start and end date
    const startMonth = new Date(localStartDate.getFullYear(), localStartDate.getMonth(), 1);
    const endMonth = new Date(localEndDate.getFullYear(), localEndDate.getMonth(), 1);
    
    console.log('Fetching invoices from months:', {
      startMonth: startMonth.toLocaleString(),
      endMonth: endMonth.toLocaleString()
    });

    // Loop through each month in the range
    const currentMonth = new Date(startMonth);
    while (currentMonth <= endMonth) {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      
      console.log(`Fetching invoices for ${year}-${month}`);
      
      const monthRef = ref(db, `invoices/${dealerId}/${year}/${month}`);
      const monthSnapshot = await get(monthRef);
      
      if (monthSnapshot.exists()) {
        const monthData = monthSnapshot.val() || {};
        const monthInvoices = Object.values(monthData).filter(Boolean);
        console.log(`Found ${monthInvoices.length} invoices for ${year}-${month}`);
        allInvoices = [...allInvoices, ...monthInvoices];
      } else {
        console.log(`No invoices found for ${year}-${month}`);
      }

      // Move to next month
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    console.log(`Found ${allInvoices.length} total invoices across all months`);

    // Filter invoices by date range
    let filteredInvoices = (allInvoices || []).filter(invoice => {
      if (!invoice || !invoice.date) return false;
      const invoiceDate = new Date(invoice.date);
      return invoiceDate >= localStartDate && invoiceDate <= localEndDate;
    });

    console.log(`Filtered down to ${filteredInvoices.length} invoices in date range`);

    if (paymentStatus === 'paid') {
      // Calculate summary for paid invoices
      const summary = {
        totalAmount: filteredInvoices.reduce((sum, inv) => sum + (inv?.amount || 0), 0),
        totalInvoices: filteredInvoices.length,
        paidCount: filteredInvoices.length,
        dueCount: 0,
        startDate: localStartDate,
        endDate: localEndDate
      };

      dispatch({ 
        type: 'FETCH_REPORT_SUCCESS', 
        payload: {
          invoices: filteredInvoices || [],
          summary
        }
      });
    } else if (paymentStatus === 'due') {
      // If fetching due customers, find all customers who have not paid
      const paidCustomerIds = new Set(
        (filteredInvoices || [])
          .filter(invoice => invoice && invoice.customerId)
          .map(invoice => invoice.customerId)
      );

      const dueCustomers = allCustomerIds
        .filter(customerId => !paidCustomerIds.has(customerId))
        .map(customerId => {
          const customer = customers[customerId];
          return {
            customerId,
            customerName: customer?.fullName || customer?.userName || 'N/A',
            ispName: customer?.ispName || 'N/A',
            amount: customer?.monthlyFee || 0,
            status: 'due',
            date: localEndDate.toISOString(),
            createdAt: localEndDate.toISOString(),
            invoiceNo: 'N/A'
          };
        });

      const summary = {
        totalAmount: dueCustomers.reduce((sum, cust) => sum + (cust?.amount || 0), 0),
        totalInvoices: dueCustomers.length,
        paidCount: 0,
        dueCount: dueCustomers.length,
        startDate: localStartDate,
        endDate: localEndDate
      };

      dispatch({ 
        type: 'FETCH_REPORT_SUCCESS', 
        payload: {
          invoices: dueCustomers || [],
          summary
        }
      });
    }

    dispatch({ type: 'FETCH_REPORT_END' });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    dispatch({ type: 'FETCH_REPORT_ERROR', error: error.message });
    // Ensure we always have an array in the state
    dispatch({ 
      type: 'FETCH_REPORT_SUCCESS', 
      payload: {
        invoices: [],
        summary: {
          totalAmount: 0,
          totalInvoices: 0,
          paidCount: 0,
          dueCount: 0,
          startDate: null,
          endDate: null
        }
      }
    });
  }
};