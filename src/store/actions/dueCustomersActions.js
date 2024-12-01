// actions/dueCustomersActions.js
export const fetchDueCustomers = (year, month, dealerId) => async (dispatch) => {
    try {
      // First get all customers for this dealer
      const customersRef = ref(db, `customers/${dealerId}`);
      const customersSnapshot = await get(customersRef);
      
      const dueCustomers = [];
      
      if (customersSnapshot.exists()) {
        // Iterate through all customers
        for (const [customerId, customerData] of Object.entries(customersSnapshot.val())) {
          // Check if customer has an invoice for this month
          const customerHistoryRef = ref(db, 
            `customerInvoiceHistory/${customerId}/monthlyInvoices/${year}/${month}`);
          const historySnapshot = await get(customerHistoryRef);
          
          // If no invoice exists for this month, customer is due
          if (!historySnapshot.exists() || historySnapshot.val() === false) {
            dueCustomers.push({
              ...customerData,
              id: customerId,
              lastInvoiceDate: await getCustomerLastInvoiceDate(customerId)
            });
          }
        }
      }
      
      dispatch({ type: 'FETCH_DUE_CUSTOMERS_SUCCESS', payload: dueCustomers });
    } catch (error) {
      dispatch({ type: 'FETCH_DUE_CUSTOMERS_ERROR', error });
    }
  };
  
  // Helper function to get customer's last invoice date
  const getCustomerLastInvoiceDate = async (customerId) => {
    const lastInvoiceDateRef = ref(db, `customerInvoiceHistory/${customerId}/lastInvoiceDate`);
    const snapshot = await get(lastInvoiceDateRef);
    return snapshot.exists() ? snapshot.val() : null;
  };