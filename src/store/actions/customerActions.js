import { db } from '../../firebase'; // Import Realtime Database
import { ref, set, get, child, push, query, orderByChild, orderByKey, startAfter, limitToFirst, equalTo } from 'firebase/database'; // Import Realtime Database methods
import { getAuth } from "firebase/auth"; // Import Firebase Auth

// Action Types
export const ADD_CUSTOMER_SUCCESS = 'ADD_CUSTOMER_SUCCESS';
export const ADD_CUSTOMER_FAILURE = 'ADD_CUSTOMER_FAILURE';
export const FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS';
export const FETCH_CUSTOMERS_FAILURE = 'FETCH_CUSTOMERS_FAILURE';
export const UPDATE_CUSTOMER_SUCCESS = 'UPDATE_CUSTOMER_SUCCESS';
export const UPDATE_CUSTOMER_FAILURE = 'UPDATE_CUSTOMER_FAILURE';
export const DELETE_CUSTOMER_SUCCESS = 'DELETE_CUSTOMER_SUCCESS';
export const DELETE_CUSTOMER_FAILURE = 'DELETE_CUSTOMER_FAILURE';

const ITEMS_PER_PAGE = 20;

// Helper function to get paginated data
const getPaginatedData = (allCustomers = [], page, searchQuery = '') => {
    let filteredCustomers = allCustomers || [];
    
    // Apply search if query exists
    if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        filteredCustomers = filteredCustomers.filter(customer => 
            (customer?.fullName && customer.fullName.toLowerCase().includes(searchLower)) ||
            (customer?.userName && customer.userName.toLowerCase().includes(searchLower)) ||
            (customer?.phone && customer.phone.toLowerCase().includes(searchLower))
        );
    }

    // Calculate pagination
    const totalCustomers = filteredCustomers.length;
    const totalPages = Math.ceil(totalCustomers / ITEMS_PER_PAGE) || 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
        customers: paginatedCustomers,
        totalPages,
        currentPage: page,
        totalCustomers
    };
};

export const fetchCustomers = (page = 1, searchQuery = '') => async (dispatch, getState) => {
    try {
        const dealerId = getState().auth.user.role === 'staff' ? getState().auth.user.dealerId : getState().auth.user.uid;
        
        // Try to get customers from localStorage first
        let allCustomers = JSON.parse(localStorage.getItem(`customers_${dealerId}`));
        
        // If not in localStorage, fetch from database
        if (!allCustomers) {
            const customersRef = query(ref(db, `customers/${dealerId}`), orderByKey());
            const snapshot = await get(customersRef);
            allCustomers = snapshot.exists() 
                ? Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }))
                : [];
            
            // Store in localStorage
            localStorage.setItem(`customers_${dealerId}`, JSON.stringify(allCustomers));
        }

        // Get paginated data
        const paginatedData = getPaginatedData(allCustomers, page, searchQuery);

        dispatch({
            type: FETCH_CUSTOMERS_SUCCESS,
            payload: paginatedData
        });
    } catch (error) {
        console.error("Error fetching customers: ", error);
        dispatch({
            type: FETCH_CUSTOMERS_FAILURE,
            payload: error.message,
        });
    }
};

export const fetchCustomersByDealerId = (dealerId, page = 1, searchQuery = '') => async (dispatch) => {
    try {
        if (!dealerId) {
                dispatch({
                    type: FETCH_CUSTOMERS_SUCCESS,
                payload: {
                    customers: [],
                    totalPages: 0,
                    currentPage: 1,
                    totalCustomers: 0,
                },
                });
                return;
            }

        // Try to get customers from localStorage first
        let allCustomers = JSON.parse(localStorage.getItem(`customers_${dealerId}`));
        
        // If not in localStorage, fetch from database
        if (!allCustomers) {
            const customersRef = query(ref(db, `customers/${dealerId}`), orderByKey());
            const snapshot = await get(customersRef);
            allCustomers = snapshot.exists() 
                ? Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }))
                : [];
            
            // Store in localStorage
            localStorage.setItem(`customers_${dealerId}`, JSON.stringify(allCustomers));
        }

        // Ensure allCustomers is an array
        if (!Array.isArray(allCustomers)) {
            allCustomers = [];
        }

        // Get paginated data
        const paginatedData = getPaginatedData(allCustomers, page, searchQuery);

        dispatch({
            type: FETCH_CUSTOMERS_SUCCESS,
            payload: paginatedData
        });
    } catch (error) {
        console.error("Error fetching customers by dealer: ", error);
        dispatch({
            type: FETCH_CUSTOMERS_FAILURE,
            payload: error.message,
        });
    }
};

export const addCustomer = (customer) => async (dispatch, getState) => {
    try {
        const dealerId = getState().auth.user.role === 'staff' ? getState().auth.user.dealerId : getState().auth.user.uid;
        
        // Add to database
        const customerRef = ref(db, `customers/${dealerId}`);
        const newCustomerRef = push(customerRef);
        await set(newCustomerRef, customer);

        // Update localStorage
        const allCustomers = JSON.parse(localStorage.getItem(`customers_${dealerId}`)) || [];
        allCustomers.push({ id: newCustomerRef.key, ...customer });
        localStorage.setItem(`customers_${dealerId}`, JSON.stringify(allCustomers));

        dispatch({
            type: ADD_CUSTOMER_SUCCESS,
            payload: { id: newCustomerRef.key, ...customer },
        });

        // Refresh the customer list
        dispatch(fetchCustomers(1));
    } catch (error) {
        console.error("Error adding customer: ", error);
        dispatch({
            type: ADD_CUSTOMER_FAILURE,
            payload: error.message,
        });
    }
};

export const deleteCustomer = (customerId) => async (dispatch, getState) => {
    try {
        const dealerId = getState().auth.user.role === 'staff' ? getState().auth.user.dealerId : getState().auth.user.uid;
        
        // Delete from database
        const customerRef = ref(db, `customers/${dealerId}/${customerId}`);
        await set(customerRef, null);

        // Update localStorage
        const allCustomers = JSON.parse(localStorage.getItem(`customers_${dealerId}`)) || [];
        const updatedCustomers = allCustomers.filter(customer => customer.id !== customerId);
        localStorage.setItem(`customers_${dealerId}`, JSON.stringify(updatedCustomers));

        dispatch({
            type: DELETE_CUSTOMER_SUCCESS,
            payload: customerId,
        });

        // Refresh the customer list
        dispatch(fetchCustomers(1));
    } catch (error) {
        console.error("Error deleting customer: ", error);
        dispatch({
            type: DELETE_CUSTOMER_FAILURE,
            payload: error.message,
        });
    }
};

export const updateCustomer = (customerId, customerData) => async (dispatch, getState) => {
    try {
        const dealerId = getState().auth.user.role === 'staff' 
            ? getState().auth.user.dealerId 
            : getState().auth.user.uid;

        // Update customer data
        const customerRef = ref(db, `customers/${dealerId}/${customerId}`);
        await set(customerRef, { ...customerData, id: customerId });

        // Update local storage
        const customers = JSON.parse(localStorage.getItem(`customers_${dealerId}`)) || [];
        const updatedCustomers = customers.map(customer => 
            customer.id === customerId ? { ...customerData, id: customerId } : customer
        );
        localStorage.setItem(`customers_${dealerId}`, JSON.stringify(updatedCustomers));

        dispatch({ 
            type: UPDATE_CUSTOMER_SUCCESS, 
            payload: { ...customerData, id: customerId } 
        });
    } catch (error) {
        console.error('Error updating customer: ', error);
        dispatch({ type: UPDATE_CUSTOMER_FAILURE, payload: error.message });
    }
};