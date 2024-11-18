import React, { useEffect } from 'react';
import { Box, Table, TableBody, TableCell, Grid, MenuItem, Select, FormControl, InputLabel, TextField, IconButton, Button, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Link, Public } from '@mui/icons-material';
import { fetchCustomers, fetchCustomersByDealerId } from '../store/actions/customerActions';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';
import { useTheme } from '@mui/material/styles';


function Customers() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const customers = useSelector((state) => state.customers.customers);
    const dealeruId = useSelector((state) => state.dealers.uid); // Get staff from Redux state
    const allDealers = useSelector((state) => state.dealers.dealers);
    const role = useSelector((state) => state.auth.user.role); // Get user role from Redux state
    const error = useSelector((state) => state.customers.error);
    const navigate = useNavigate()

    useEffect(() => {
        // Check local storage first
        const localCustomers = localStorage.getItem('customers');
        if (localCustomers && JSON.parse(localCustomers).length > 0) {
            dispatch({
                type: 'FETCH_CUSTOMERS_SUCCESS',
                payload: JSON.parse(localCustomers),
            });
        } else {
            if (role === 'admin') {
                console.log('Fetching customers by dealer ID');
                dispatch(fetchCustomersByDealerId(dealeruId));
            } else {
                console.log('Fetching customers without dealer ID');
                dispatch(fetchCustomers());
            }
        }
    }, [dispatch, role, dealeruId]); // Added missing dependencies]);

    return (
        <Box sx={{ pl: 2, pt: 5, }}>
            <Box display="flex" alignItems="center" mb={2}>
                <TextField
                    placeholder="Name / Username / Phone Number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <IconButton>
                                <Search />
                            </IconButton>
                        )
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/add-customer')}
                    sx={{
                        mt: 0,
                        width: '100%',
                        fontSize: '0.9rem',
                        // padding: '6px 12px',
                        maxWidth: '200px',
                        [theme.breakpoints.down('sm')]: {  // Changed from 'xs' to 'sm' since 'xs' is deprecated
                            fontSize: '0.6rem',
                            padding: '4px 8px',
                        },
                    }}
                    style={{ marginLeft: '10px', backgroundColor: colors.primary }}
                >
                    Create Customer
                </Button>
            </Box>
            {
                role === 'admin' && (
                    <FormControl sx={{ m: 1, width: '90%' }}>
                        <InputLabel fullyWidth id="dealer-select-label">Dealer</InputLabel>
                        <Select
                            labelId="dealer-select-label"
                            id="dealer-select"
                            fullWidth
                            value={dealeruId}
                            label="Dealer"
                            onChange={(e) => dispatch(fetchCustomersByDealerId(e.target.value))}
                        >
                            {allDealers.map((dealer) => (
                                <MenuItem key={dealer.uid} value={dealer.uid}>
                                    {dealer.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            }
            {error && <Typography color="error">{error}</Typography>}

            <Grid item xs={12} md={12} sx={{
                '@media (max-width: 600px)': {
                    '& .MuiTableCell-root': {
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                    }
                }
            }} >
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Expiry Date</TableCell>
                                <TableCell>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id} onClick={() => navigate(`/customer-details/${customer.id}`)}>
                                    <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                                    <TableCell>{customer.username}</TableCell>
                                    <TableCell>{customer.phoneNumber}</TableCell>
                                    <TableCell>{customer.address}</TableCell>
                                    <TableCell>{customer.expiryDate}</TableCell>
                                    <TableCell>{customer.type}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Box>
    );
}

export default Customers;
