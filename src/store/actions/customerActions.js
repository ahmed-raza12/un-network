import { db } from '../../firebase'; // Import Realtime Database
import { ref, set, get, child, push } from 'firebase/database'; // Import Realtime Database methods
import { getAuth } from "firebase/auth"; // Import Firebase Auth

export const addCustomer = (customer) => {
    console.log(customer, 'pro');
    
  return async (dispatch, getState) => {
    try {
      const dealerId = getState().auth.user.dealerId;
      console.log(dealerId);
      const dealerRef = ref(db, `customers/${dealerId}`);
      const newCustomerRef = push(dealerRef);
      const newCustomerKey = newCustomerRef.key;

      // Add the customer data with the generated key
      await set(newCustomerRef, { ...customer, id: newCustomerKey });
const customers = JSON.parse(localStorage.getItem('customers')) || [];
      customers.push({ ...customer, id: newCustomerKey }); // Add the new customer with the generated ID
      localStorage.setItem('customers', JSON.stringify(customers));
      dispatch({ type: 'ADD_CUSTOMER_SUCCESS', payload: { ...customer, id: newCustomerKey } });
    } catch (error) {
      console.error('Error adding customer: ', error);
      dispatch({ type: 'ADD_CUSTOMER_FAILURE', payload: error.message });
    }
  };
}; 


export const FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS';
export const FETCH_CUSTOMERS_FAILURE = 'FETCH_CUSTOMERS_FAILURE';

export const fetchCustomers = () => async (dispatch, getState) => {
    try {
      const dealerId = getState().auth.user.role === 'staff' ? getState().auth.user.dealerId : getState().auth.user.uid;
      console.log(dealerId);
      
        const customersRef = ref(db, `customers/${dealerId}`); 
        const snapshot = await get(customersRef); 
        const customersList = snapshot.exists() ? Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data })) : []; // Map the data to the desired format
        console.log(customersList);
        // Save customers to local storage
        localStorage.setItem('customers', JSON.stringify(customersList));

        // Dispatch success action
        dispatch({
            type: FETCH_CUSTOMERS_SUCCESS,
            payload: customersList,
        });
    } catch (error) {
        console.error("Error fetching customers: ", error);
        dispatch({
            type: FETCH_CUSTOMERS_FAILURE,
            payload: error.message,
        });
    }
};

export const fetchCustomersByDealerId = (dealerId) => async (dispatch) => {
  try {
      const customersRef = ref(db, `customers/${dealerId}`);
      const snapshot = await get(customersRef);

      if (snapshot.exists()) {
          const customersList = Object.entries(snapshot.val()).map(([id, data]) => ({
              id,
              ...data,
          }));
          console.log(customersList);
          
          dispatch({ type: FETCH_CUSTOMERS_SUCCESS, payload: customersList });
      } else {
          dispatch({ type: FETCH_CUSTOMERS_SUCCESS, payload: [] });
      }
  } catch (error) {
      console.error("Error fetching staff by dealer id: ", error);
      dispatch({ type: FETCH_CUSTOMERS_FAILURE, payload: error.message });
  }
};