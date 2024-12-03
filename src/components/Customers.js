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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Tooltip,
    CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { Search, Link, Public, Edit, Delete, AddIcCallOutlined } from '@mui/icons-material';
import { fetchCustomers, fetchCustomersByDealerId, updateCustomer, deleteCustomer } from '../store/actions/customerActions';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { fetchDealers } from '../store/actions/dealerActions';

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

    // State for edit dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editFormData, setEditFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        package: '',
        status: ''  
    });

    // State for delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

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
                    // Check if we have cached data
                    const cachedData = localStorage.getItem(`customers_data_${selectedDealer}`);
                    if (cachedData) {
                        const { timestamp, data } = JSON.parse(cachedData);
                        // Use cached data if it's less than 5 minutes old
                        if (Date.now() - timestamp < 5 * 60 * 1000) {
                            dispatch({
                                type: 'FETCH_CUSTOMERS_SUCCESS',
                                payload: data
                            });
                            setIsLoading(false);
                            return;
                        }
                    }
                    await dispatch(fetchCustomersByDealerId(selectedDealer, page, searchQuery));
                } else if (role === 'dealer') {
                    await dispatch(fetchCustomers());
                } else {
                    await dispatch(fetchCustomers(page, searchQuery));
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
            setIsLoading(false);
        };

        fetchCustomersData();
    }, [searchQuery, page, selectedDealer, role, dealeruId, dispatch]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        if (role === 'admin' && selectedDealer) {
            dispatch(fetchCustomersByDealerId(selectedDealer, newPage, searchQuery));
        } else if (role === 'dealer') {
            dispatch(fetchCustomersByDealerId(dealeruId, newPage, searchQuery));
        } else {
            dispatch(fetchCustomers(newPage, searchQuery));
        }
    };

    const handleDealerChange = (event) => {
        setSelectedDealer(event.target.value);
        setPage(1);
    };

    const handleEditClick = (customer) => {
        setSelectedCustomer(customer);
        setEditFormData({
            fullName: customer.fullName || '',
            CNIC: customer.CNIC || '',
            phone: customer.phone || '',
            address: customer.address || '',
            package: customer.package || '',
            status: customer.status || ''
        });
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (customer) => {
        setCustomerToDelete(customer);
        setDeleteDialogOpen(true);
    };

    const handleEditSubmit = () => {
        const updatedCustomerData = {
            ...selectedCustomer,
            ...editFormData
        };
        dispatch(updateCustomer(selectedCustomer.id, updatedCustomerData));
        setEditDialogOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (customerToDelete) {
            dispatch(deleteCustomer(customerToDelete.id));
            setDeleteDialogOpen(false);
        }
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcCallOutlined />}
                        onClick={() => navigate('/add-customer')}
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
                                {/* <MenuItem value="">All Dealers</MenuItem> */}
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
                        disabled={isLoading}
                    />
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Results Summary */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2">
                                Showing {((page - 1) * 20) + 1} - {Math.min(page * 20, totalCustomers)} of {totalCustomers} customers
                            </Typography>
                            {/* Pagination */}
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        </Box>

                        {/* Customers Table */}
                        <TableContainer component={Paper} sx={{ mb: 3 }}>
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
                                        <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customers.map((customer, index) => (
                                        <TableRow 
                                            key={customer.id} 
                                            hover
                                            onClick={(event) => {
                                                // Only navigate if not clicking on action buttons
                                                if (!event.target.closest('.action-buttons')) {
                                                    navigate(`/customer-details/${customer.id}`, { state: customer });
                                                }
                                            }} 
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                }
                                            }}
                                        >
                                            <TableCell>{((page - 1) * 20) + index + 1}</TableCell>
                                            <TableCell>{customer.userName}</TableCell>
                                            <TableCell>{customer.fullName} {customer.lastName}</TableCell>
                                            <TableCell>{customer.phone}</TableCell>
                                            <TableCell>{customer.address}</TableCell>
                                            <TableCell>{customer.package}</TableCell>
                                            <TableCell>{customer.CNIC}</TableCell>
                                            <TableCell className="action-buttons">
                                                {role === 'admin' || role === 'dealer' ? (
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Tooltip title="Edit Customer">
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditClick(customer);
                                                                }}
                                                                sx={{ color: colors.primary }}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete Customer">
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteClick(customer);
                                                                }}
                                                                sx={{ color: 'error.main' }}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                ) : null}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Edit Customer Dialog */}
                        <Dialog 
                            open={editDialogOpen} 
                            onClose={() => setEditDialogOpen(false)}
                            fullWidth
                            maxWidth="sm"
                        >
                            <DialogTitle>
                                Edit Customer
                                <IconButton
                                    aria-label="close"
                                    onClick={() => setEditDialogOpen(false)}
                                    sx={{ position: 'absolute', right: 8, top: 8 }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            value={editFormData.fullName}
                                            onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="CNIC"
                                            value={editFormData.CNIC}
                                            onChange={(e) => setEditFormData({...editFormData, CNIC: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            value={editFormData.phone}
                                            onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Package"
                                            value={editFormData.package}
                                            onChange={(e) => setEditFormData({...editFormData, package: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            value={editFormData.address}
                                            onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={editFormData.status}
                                                label="Status"
                                                onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                                            >
                                                <MenuItem value="Active">Active</MenuItem>
                                                <MenuItem value="Inactive">Inactive</MenuItem>
                                                <MenuItem value="Pending">Pending</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                                <Button 
                                    onClick={handleEditSubmit}
                                    variant="contained"
                                    sx={{ bgcolor: colors.primary }}
                                >
                                    Save Changes
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Delete Confirmation Dialog */}
                        <Dialog
                            open={deleteDialogOpen}
                            onClose={() => setDeleteDialogOpen(false)}
                        >
                            <DialogTitle>Confirm Delete</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete {customerToDelete?.name}? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                                <Button 
                                    onClick={handleDeleteConfirm}
                                    color="error"
                                    variant="contained"
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </Paper>
        </Box>
    );
}

export default Customers;
