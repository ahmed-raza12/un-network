import React, { useEffect, useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TextField,
    IconButton,
    Button,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Pagination,
    CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { Search, Link, Public } from '@mui/icons-material';
import { fetchCustomers, fetchCustomersByDealerId, getPaginatedData } from '../store/actions/customerActions';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';
import { useTheme } from '@mui/material/styles';
import { fetchDealers } from '../store/actions/dealerActions';
import { ref, onValue } from 'firebase/database';
import {db} from '../firebase';

function Customers() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { customers, totalPages, currentPage, totalCustomers } = useSelector((state) => state.customers);
    const dealeruId = useSelector((state) => state.dealers.uid);
    const allDealers = useSelector((state) => state.dealers.dealers);
    const role = useSelector((state) => state.auth.user.role);
    const error = useSelector((state) => state.customers.error);
    const navigate = useNavigate();

    // State for search and pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedDealer, setSelectedDealer] = useState(() => {
        const savedDealer = localStorage.getItem('selectedDealer');
        return savedDealer || dealeruId;
    });

    // State for loading
    const [isLoading, setIsLoading] = useState(false);

    // Effect to handle dealer selection persistence
    useEffect(() => {
        if (selectedDealer) {
            localStorage.setItem('selectedDealer', selectedDealer);
        }
    }, [selectedDealer]);

    // Effect to load dealers for admin
    useEffect(() => {
        const localDealers = localStorage.getItem('dealers');
        if (localDealers) {
            dispatch({
                type: 'FETCH_DEALERS_SUCCESS',
                payload: JSON.parse(localDealers),
            });
        } else {
            dispatch(fetchDealers());
        }
    }, [dispatch]);

    // Effect to fetch customers based on selected dealer
    useEffect(() => {
        const fetchCustomersData = async () => {
            setIsLoading(true);
            try {
                if (role === 'admin' && selectedDealer) {
                    // Try to get data from localStorage first
                    const storedCustomers = localStorage.getItem(`customers_${selectedDealer}`);
                    if (storedCustomers) {
                        const customers = JSON.parse(storedCustomers);
                        const paginatedData = getPaginatedData(customers, page, searchQuery);
                        dispatch({
                            type: 'FETCH_CUSTOMERS_SUCCESS',
                            payload: paginatedData
                        });
                    } else {
                        await dispatch(fetchCustomersByDealerId(selectedDealer, page, searchQuery));
                    }
                } else if (role === 'dealer') {
                    // Try to get data from localStorage first
                    const storedCustomers = localStorage.getItem(`customers_${dealeruId}`);
                    if (storedCustomers) {
                        const customers = JSON.parse(storedCustomers);
                        const paginatedData = getPaginatedData(customers, page, searchQuery);
                        dispatch({
                            type: 'FETCH_CUSTOMERS_SUCCESS',
                            payload: paginatedData
                        });
                    } else {
                        await dispatch(fetchCustomersByDealerId(dealeruId, page, searchQuery));
                    }
                } else {
                    await dispatch(fetchCustomers(page, searchQuery));
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomersData();
    }, [searchQuery, page, selectedDealer, role, dealeruId, dispatch, customers.length]);

    // Listen for customer updates
    useEffect(() => {
        const customersRef = ref(db, `customers/${selectedDealer || dealeruId}`);
        const unsubscribe = onValue(customersRef, (snapshot) => {
            if (snapshot.exists()) {
                dispatch(fetchCustomersByDealerId(selectedDealer || dealeruId, page, searchQuery));
            }
        });

        return () => unsubscribe();
    }, [selectedDealer, dealeruId, page, searchQuery, dispatch]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleDealerChange = (event) => {
        setSelectedDealer(event.target.value);
        setPage(1);
    };

    const handleCustomerClick = (customer) => {
        navigate(`/customer-details/${customer.id}`, { state: customer });
    };

    return (
        <Box sx={{ width: '100%', p: 3, minHeight: '100vh' }}>
            <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/add-customer')}
                        sx={{
                            bgcolor: colors.primary,
                            '&:hover': { bgcolor: colors.secondary }
                        }}
                    >
                        Create New Customer
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    {role === 'admin' && (
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Select Dealer</InputLabel>
                            <Select
                                value={selectedDealer || ''}
                                onChange={handleDealerChange}
                                label="Select Dealer"
                                disabled={isLoading}
                            >
                                {allDealers?.map((dealer) => (
                                    <MenuItem key={dealer.uid} value={dealer.uid}>
                                        {dealer.dealerName || dealer.email}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <TextField
                        label="Search Customers"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ flexGrow: 1 }}
                        InputProps={{
                            endAdornment: <Search />,
                        }}
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: colors.primary }}>
                                <TableCell sx={{ color: 'white' }}>#</TableCell>
                                <TableCell sx={{ color: 'white' }}>Customer ID</TableCell>
                                <TableCell sx={{ color: 'white' }}>Full Name</TableCell>
                                <TableCell sx={{ color: 'white' }}>Phone Number</TableCell>
                                <TableCell sx={{ color: 'white' }}>Address</TableCell>
                                <TableCell sx={{ color: 'white' }}>Package</TableCell>
                                <TableCell sx={{ color: 'white' }}>CNIC</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No customers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer, index) => (
                                    <TableRow
                                        key={customer.id}
                                        hover
                                        onClick={() => handleCustomerClick(customer)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{((page - 1) * 20) + index + 1}</TableCell>
                                        <TableCell>{customer.userName}</TableCell>
                                        <TableCell>{customer.fullName} {customer.lastName}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.address}</TableCell>
                                        <TableCell>{customer.package}</TableCell>
                                        <TableCell>{customer.CNIC}</TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Paper>
        </Box>
    );
}

export default Customers;
