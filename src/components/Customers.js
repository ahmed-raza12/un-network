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
    Checkbox,
    Toolbar,
    Button,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Pagination,
    IconButton,
    CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, deleteCustomers, searchCustomers } from '../store/actions/customerActions';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';
import { Search as SearchIcon, Visibility as VisibilityIcon, Delete as DeleteIcon, PersonAdd } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function Customers() {
    const dispatch = useDispatch();
    const { customers, currentPage, totalPages, totalCustomers } = useSelector((state) => state.customers);
    const role = useSelector((state) => state.auth.user.role);
    const dealeruId = useSelector((state) => state.auth.user.uid);
    const navigate = useNavigate();

    // States for search and pagination
    const [inputValue, setInputValue] = useState(''); // For text input value
    const [searchQuery, setSearchQuery] = useState(''); // Actual query to trigger search
    const [page, setPage] = useState(1);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

    // Fetch customers on page load or when searchQuery/page changes
    useEffect(() => {
        if (!isSearchMode) {
            fetchCustomersData();
        }
    }, [page, isSearchMode]);

    const fetchCustomersData = async () => {
        setIsLoading(true);
        try {
            const targetDealerId = role === 'dealer' ? dealeruId : null;
            await dispatch(fetchCustomers(page, '', targetDealerId));
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setIsLoading(false);
        }
    };
    // Handle search input change
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        if (event.target.value === '') {
            setIsSearchMode(false);
            fetchCustomersData();
        }
    };

    // Handle search button click
    const handleSearchClick = async () => {
        if (!inputValue.trim()) return;

        setIsLoading(true);
        setIsSearchMode(true);
        try {
            await dispatch(searchCustomers(inputValue.trim(), dealeruId));
        } catch (error) {
            console.error('Error searching customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle search on Enter key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    // Handle pagination change (only available in normal mode)
    const handlePageChange = (event, newPage) => {
        if (!isSearchMode) {
            setPage(newPage);
        }
    };

    const handleResetSearch = () => {
        setInputValue('');
        setIsSearchMode(false);
        setPage(1);
        fetchCustomersData();
    };

    const handleCustomerClick = (customer) => {
        navigate(`/customer-details/${customer.id}`, { state: customer });
    };

    const handleSelectCustomer = (id) => {
        setSelectedCustomerIds((prev) =>
            prev.includes(id) ? prev.filter((customerId) => customerId !== id) : [...prev, id]
        );
    };

    // Select/Deselect all customers
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allCustomerIds = customers.map((customer) => customer.id);
            setSelectedCustomerIds(allCustomerIds);
        } else {
            setSelectedCustomerIds([]);
        }
    };

    // Delete multiple customers
    const handleDeleteSelected = () => {
        if (selectedCustomerIds.length === 0) return;
        dispatch(deleteCustomers(selectedCustomerIds, dealeruId)).then(() => {
            setSelectedCustomerIds([]);
            dispatch(fetchCustomers(page, searchQuery)); // Refresh list after deletion
        });
    };

    // Delete individual customer
    const handleDeleteCustomer = (id) => {
        dispatch(deleteCustomers([id], dealeruId)).then(() => {
            dispatch(fetchCustomers(page, searchQuery)); // Refresh list after deletion
        });
    };

    return (
        <Box sx={{ width: '100%', p: 3, minHeight: '100vh' }}>
            <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                {/* Search Field and Button */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <TextField
                        label="Search Customers"
                        variant="outlined"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        sx={{ flexGrow: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearchClick}
                        disabled={!inputValue.trim()}
                        sx={{
                            bgcolor: colors.primary,
                            '&:hover': { bgcolor: colors.secondary }
                        }}
                    >
                        Search
                    </Button>
                    {isSearchMode && (
                        <Button
                            variant="outlined"
                            onClick={handleResetSearch}
                        >
                            Clear Search
                        </Button>
                    )}
                </Box>                <Toolbar sx={{ justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                        {searchQuery !== '' ? 'Search Results' : 'All Customers'}: {totalCustomers}
                    </Typography>
                    {selectedCustomerIds.length > 0 && (
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteSelected}
                        >
                            Delete Selected ({selectedCustomerIds.length})
                        </Button>
                    )}
                </Toolbar>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PersonAddIcon />}
                            onClick={() => navigate('/add-customer')}
                        >
                            Create Customer
                        </Button>
                    </Box>

                {/* Customer Table */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: colors.primary }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            Array.isArray(customers) &&
                                            selectedCustomerIds.length > 0 &&
                                            selectedCustomerIds.length < customers.length
                                        }
                                        checked={
                                            Array.isArray(customers) &&
                                            customers.length > 0 &&
                                            selectedCustomerIds.length === customers.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                        
                                <TableCell sx={{ color: "white" }}>#</TableCell>
                                <TableCell sx={{ color: "white" }}>Customer ID</TableCell>
                                <TableCell sx={{ color: "white" }}>Full Name</TableCell>
                                <TableCell sx={{ color: "white" }}>Phone</TableCell>
                                <TableCell sx={{ color: "white" }}>CNIC</TableCell>
                                <TableCell sx={{ color: "white" }}>Address</TableCell>
                                <TableCell sx={{ color: "white" }}>View</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(customers) && customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No customers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer, index) => (
                                    <TableRow
                                        key={customer.id}
                                        hover
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedCustomerIds.includes(customer.id)}
                                                onChange={() => handleSelectCustomer(customer.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{customer.userName}</TableCell>
                                        <TableCell>{customer.fullName}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.cnic}</TableCell>
                                        <TableCell>{customer.address}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleCustomerClick(customer)}
                                                sx={{ color: colors.primary }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                        {/* <TableCell>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteCustomer(customer.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell> */}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>


                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Paper>
        </Box>
    );
}

export default Customers;
