// actions/reportActions.js
import { ref, get } from 'firebase/database';
import { db } from '../../firebase';

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