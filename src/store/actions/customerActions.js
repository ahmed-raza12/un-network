import { db } from '../../firebase'; // Import Realtime Database
import { ref, set, get, child, push, query, startAt, orderByChild, orderByKey, startAfter, limitToFirst, equalTo } from 'firebase/database'; // Import Realtime Database methods
import { getAuth } from "firebase/auth"; // Import Firebase Auth

// Action Types
export const ADD_CUSTOMER_SUCCESS = 'ADD_CUSTOMER_SUCCESS';
export const ADD_CUSTOMER_FAILURE = 'ADD_CUSTOMER_FAILURE';
export const FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS';
export const FETCH_CUSTOMERS_FAILURE = 'FETCH_CUSTOMERS_FAILURE';
export const FETCH_CUSTOMERS_REQUEST = 'FETCH_CUSTOMERS_REQUEST';
export const UPDATE_CUSTOMER_SUCCESS = 'UPDATE_CUSTOMER_SUCCESS';
export const UPDATE_CUSTOMER_FAILURE = 'UPDATE_CUSTOMER_FAILURE';
export const DELETE_CUSTOMER_SUCCESS = 'DELETE_CUSTOMER_SUCCESS';
export const DELETE_CUSTOMER_FAILURE = 'DELETE_CUSTOMER_FAILURE';

const ITEMS_PER_PAGE = 10;

// Helper function to get paginated data
export const getPaginatedData = (allCustomers = [], page, searchQuery = '') => {
    let filteredCustomers = allCustomers.data;
    console.log('filteredCustomers:', filteredCustomers);
    // Apply search if query exists
    if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        filteredCustomers = filteredCustomers.filter(customer => 
            (customer?.name && customer.name.toLowerCase().includes(searchLower)) ||
            (customer?.email && customer.email.toLowerCase().includes(searchLower)) ||
            (customer?.phone && customer.phone.toLowerCase().includes(searchLower))
        );
    }

    // Calculate pagination
    const totalCustomers = filteredCustomers.length;
    const totalPages = Math.ceil(totalCustomers / ITEMS_PER_PAGE) || 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    return {
        customers: paginatedCustomers,
        totalPages,
        currentPage: page,
        totalCustomers
    };
};


export const searchCustomers = (searchQuery, dealerId) => async (dispatch) => {
    console.log('searchQuery:', searchQuery, 'dealerId:', dealerId);
    try {
        // Reference to customers for this dealer
        const customersRef = ref(db, `customers/${dealerId}`);

        // Create search queries for different fields (e.g., userName and phoneNumber)
        const searchQueries = [
            query(customersRef, orderByChild('userName'), equalTo(searchQuery)),
            query(customersRef, orderByChild('phone'), equalTo(searchQuery)), // Add phone number search
            query(customersRef, orderByChild('CNIC'), equalTo(searchQuery)), // Add phone number search
        ];
        console.log(searchQueries, searchQuery, 'searchQueries');

        // Combine results from multiple search queries
        let customers = [];
        for (let searchQuery of searchQueries) {
            const snapshot = await get(searchQuery);
            console.log(snapshot.val());
            if (snapshot.exists()) {
                const newCustomers = Object.entries(snapshot.val()).map(([id, data]) => ({
                    id,
                    ...data
                }));
                
                // Combine without duplicates
                customers = [...new Set([...customers, ...newCustomers])];
            }
        }

        // Dispatch action with search results
        dispatch({
            type: 'SEARCH_CUSTOMERS_SUCCESS',
            payload: {
                customers,
                totalCustomers: customers.length,
                totalPages: 1,
                currentPage: 1
            }
        });

    } catch (error) {
        console.error("Error searching customers: ", error);
        dispatch({
            type: 'FETCH_CUSTOMERS_FAILURE',
            payload: error.message,
        });
    }
};


export const deleteCustomers = (customerIds, dealerId) => async (dispatch) => {
    console.log('Deleting customers:', customerIds);
    try {
        for (let customerId of customerIds) {
            const customerRef = ref(db, `customers/${dealerId}/${customerId}`);
            await set(customerRef, null);
        }

        dispatch({
            type: 'DELETE_CUSTOMERS_SUCCESS',
            payload: customerIds,
        });

    } catch (error) {
        console.error("Error deleting customers: ", error);
        dispatch({
            type: 'DELETE_CUSTOMERS_FAILURE',
            payload: error.message,
        });
    }
};


export const fetchCustomers = (page, searchQuery = '') => async (dispatch, getState) => {
    try {
        const dealerId = getState().auth.user.role === 'staff' 
            ? getState().auth.user.dealerId 
            : getState().auth.user.uid;
        
        const PAGE_SIZE = 20;
        const customersRef = ref(db, `customers/${dealerId}`);

        const countSnapshot = await get(customersRef);
        const totalCustomers = countSnapshot.exists() ? Object.keys(countSnapshot.val()).length : 0;
        const totalPages = Math.ceil(totalCustomers / PAGE_SIZE);

        let allCustomers = [];
        const allCustomersSnapshot = await get(customersRef);
        
        if (allCustomersSnapshot.exists()) {
            allCustomers = Object.entries(allCustomersSnapshot.val())
                .map(([id, data]) => ({ id, ...data }))
                .sort((a, b) => (a.userName || '').localeCompare(b.userName || ''));

            if (searchQuery) {
                const lowercaseQuery = searchQuery.toLowerCase();
                allCustomers = allCustomers.filter(customer => 
                    customer.fullName?.toLowerCase().includes(lowercaseQuery) ||
                    customer.phone?.includes(lowercaseQuery) ||
                    customer.userName?.toLowerCase().includes(lowercaseQuery)
                );
            }

            const startIdx = (page - 1) * PAGE_SIZE;
            const endIdx = startIdx + PAGE_SIZE;
            const paginatedCustomers = allCustomers.slice(startIdx, endIdx);

            dispatch({
                type: FETCH_CUSTOMERS_SUCCESS,
                payload: {
                    customers: paginatedCustomers,
                    currentPage: page,
                    totalPages: Math.ceil(allCustomers.length / PAGE_SIZE),
                    totalCustomers: allCustomers.length
                }
            });
            return;
        }

        dispatch({
            type: FETCH_CUSTOMERS_SUCCESS,
            payload: {
                customers: [],
                currentPage: page,
                totalPages: 0,
                totalCustomers: 0
            }
        });

    } catch (error) {
        console.error("Error fetching customers: ", error);
        dispatch({ type: FETCH_CUSTOMERS_FAILURE, payload: error.message });
    }
};
export const fetchCustomersByDealerId = (dealerId, page = 1, searchQuery = '') => async dispatch => {
    dispatch({ type: FETCH_CUSTOMERS_REQUEST });
    try {
        const customersRef = ref(db, `customers/${dealerId}`);
        const snapshot = await get(customersRef);
        let customers = [];
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            customers = Object.keys(data).map(key => ({
                ...data[key],
                id: key
            }));
            // Store all customers in localStorage
            localStorage.setItem(`customers_${dealerId}`, JSON.stringify(customers));
        }

        const paginatedData = getPaginatedData(customers, page, searchQuery);
        
        dispatch({
            type: FETCH_CUSTOMERS_SUCCESS,
            payload: paginatedData
        });

        return paginatedData;
    } catch (error) {
        console.error('Error fetching customers:', error);
        dispatch({
            type: FETCH_CUSTOMERS_FAILURE,
            payload: error.message
        });
        throw error;
    }
};

export const addCustomer = (customerData, dealerId) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const customersRef = ref(db, `customers/${dealerId}`);
        const snapshot = await get(customersRef);

        if (snapshot.exists()) {
            const existingCustomers = snapshot.val();
            const usernameExists = Object.values(existingCustomers).some(
                (customer) => customer.userName === customerData.userName
            );

            if (usernameExists) {
                throw new Error('Username already in use');
            }
        }

        const newCustomerRef = push(customersRef);
        const customer = {
            ...customerData,
            dealerId,
            createdAt: new Date().toISOString(),
        };

        await set(newCustomerRef, customer);

        dispatch({
            type: ADD_CUSTOMER_SUCCESS,
            payload: { id: newCustomerRef.key, ...customer },
        });
    } catch (error) {
        console.error('Error adding customer: ', error);
        dispatch({
            type: ADD_CUSTOMER_FAILURE,
            payload: error.message,
        });
        throw error; // Pass error to the caller
    } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
    }
};

export const updateCustomer = (customerId, customerData, dealerId) => async (dispatch, getState) => {
    console.log('customerId:', customerId, 'dealerId:', dealerId, 'customerData:', customerData);
    try {
        // Ensure we're not overwriting critical fields
        const updatedData = {
            ...customerData,
            id: customerId,
            dealerId,
            uid: customerData.uid || customerId
        };

        // Update customer data in Firebase
        const customerRef = ref(db, `customers/${dealerId}/${customerId}`);
        await set(customerRef, updatedData);

        // Update Redux state
        dispatch({ 
            type: UPDATE_CUSTOMER_SUCCESS,
            payload: true
        });
        
        return true;
    } catch (error) {
        console.error('Error updating customer:', error);
        dispatch({ type: UPDATE_CUSTOMER_FAILURE, payload: error.message });
        throw error;
    }
};

export const deleteCustomer = (customerId, dealerId) => async (dispatch, getState) => {
    try {
        console.log('Deleting customer:', dealerId, customerId);
        // Delete from Firebase
        const customerRef = ref(db, `customers/${dealerId}/${customerId}`);
        await set(customerRef, null);
        
        // Then update the list with new paginated data
        dispatch({
            type: FETCH_CUSTOMERS_SUCCESS,
            payload: true
        });
        
        return true;
    } catch (error) {
        console.error("Error deleting customer: ", error);
        dispatch({
            type: DELETE_CUSTOMER_FAILURE,
            payload: error.message
        });
        throw error;
    }
};