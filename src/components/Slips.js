import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Divider, Grid, Alert, Paper, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import { useReactToPrint } from 'react-to-print';
import { createInvoice } from '../store/actions/invoiceActions';
import { useDispatch, useSelector } from 'react-redux';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from '../firebase';
// import { debounce } from 'lodash';
import colors from '../colors';
const PrintableReceipt = React.forwardRef(({ receiptData }, ref) => (
    <div ref={ref}>
        <Paper elevation={0} sx={{
            padding: 2,
            width: '58mm',
            margin: 'auto',
            backgroundColor: 'white',
            '@media print': {
                width: '58mm',
            },
        }}>
            {/* Header */}
            <Box textAlign="center" mb={2}>
                <Typography variant="h6" fontWeight="bold" color="#6b49e4">
                    Payment Bill
                </Typography>
                <Typography variant="subtitle1" color="textPrimary">
                    Invoice #{receiptData.invoiceNumber}
                </Typography>

                <Box sx={{
                    backgroundColor: green[100],
                    padding: '4px 12px',
                    borderRadius: 8,
                    display: 'inline-block',
                    color: green[700],
                    mt: 1,
                }}>
                    <Typography variant="body2" color="textPrimary"> {new Date(receiptData.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</Typography>
                </Box>
            </Box>

            {/* User Details */}
            <Box textAlign="left" mt={3}>
                <Typography variant="h6" fontWeight="bold" color="textPrimary">
                    {receiptData.customerName}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    Customer ID: {receiptData.userName}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    Address: {receiptData.address}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    Phone: {receiptData.phone}
                </Typography>
            </Box>

            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Charged By
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    {receiptData.chargedBy}
                </Typography>
            </Grid>
            <Divider sx={{ my: 2 }} />

            {/* ISP Details */}
            <Box bgcolor="#e0ebff" padding={1} borderRadius={1} mb={1}>
                <Typography variant="body2" color="textPrimary">
                    ISP Details
                </Typography>
            </Box>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    ISP Name
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    {receiptData.ispName}
                </Typography>
            </Grid>

            {/* Payment Details */}
            <Box bgcolor="#e0ebff" padding={1} borderRadius={1} my={2}>
                <Typography variant="body2" color="textPrimary">
                    Payment Details
                </Typography>
            </Box>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Amount
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    Rs. {receiptData.amount}
                </Typography>
            </Grid>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Month
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    {new Date(receiptData.month).toLocaleString('default', { month: 'long' })}
                </Typography>
            </Grid>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Time
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    {receiptData.time
                        ? receiptData.time.split(':').slice(0, 2).join(':') + ' ' + receiptData.time.split(' ')[1]
                        : 'N/A'}
                </Typography>
            </Grid>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Phone
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    {receiptData.phone1}
                    {receiptData.userPhone && `, ${receiptData.userPhone}`}
                </Typography>
            </Grid>
        </Paper>
    </div>
));

const Slips = () => {
    const [date, setDate] = useState(new Date().toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' }));
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [ispName, setIspName] = useState('');
    const [pkg, setPkg] = useState('');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month in YYYY-MM format
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const chargedBy = useSelector((state) => state.auth.user.name);
    const userPhone = useSelector((state) => state.auth.user.phone);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const dispatch = useDispatch();
    const dealerId = useSelector((state) => state.auth.user.uid);
    const userId = useSelector((state) => state.auth.user.uid);
    const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState(null);
    const staffDealerId = useSelector((state) => state.auth.user.dealerId);
    const role = useSelector((state) => state.auth.user.role);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    console.log(month, 'month');
    const fetchLatestInvoiceNumber = async () => {
        const targetDealerId = role === 'staff' ? userId : staffDealerId;
        const year = new Date().getFullYear();

        console.log('Fetching invoice number for year:', userId, year);
        try {
            const countRef = ref(db, `userInvoiceCounts/${userId}/${year}`);
            const snapshot = await get(countRef);
            console.log('Invoice number snapshot:', snapshot.val());
            if (snapshot.exists()) {
                setCurrentInvoiceNumber((snapshot.val() + 1).toString().padStart(4, '0'));
            } else {
                setCurrentInvoiceNumber('0001');
            }
        } catch (error) {
            console.error('Error fetching invoice number:', error);
            setCurrentInvoiceNumber('0001');
        }
    };

    useEffect(() => {
        fetchLatestInvoiceNumber();
    }, [userId, dealerId, staffDealerId, role, currentInvoiceNumber]);

    const clearCustomerDetails = () => {
        setCustomerName('');
        setIspName('');
        setAddress('');
        setPhone('');
        setPkg('');
        setCustomerId('');
    };

    const fetchCustomerDetails = async (username) => {
        try {
            const targetDealerId = role === 'staff' ? staffDealerId : dealerId;
            const customerRef = ref(db, `customers/${targetDealerId}`);
            const customerQuery = query(customerRef, orderByChild('userName'), equalTo(username));
            const snapshot = await get(customerQuery);

            if (snapshot.exists()) {
                const customerData = Object.values(snapshot.val())[0];
                return customerData;
            }
            return null;
        } catch (error) {
            console.error('Error fetching customer details:', error);
            return null;
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent form submission
        setError('');
        setFieldErrors({});

        if (!userName.trim()) {
            setError('Customer username is required');
            return;
        }

        setIsLoading(true);
        try {
            const customerDetails = await fetchCustomerDetails(userName);
            if (customerDetails) {
                setCustomerName(customerDetails.fullName || '');
                setIspName(customerDetails.ispName || '');
                setAddress(customerDetails.address || '');
                setPhone(customerDetails.phone || '');
                setPkg(customerDetails.package || '');
                setCustomerId(customerDetails.id || '');
                setError('');
            } else {
                setError('No customer found');
                clearCustomerDetails();
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching customer details');
            clearCustomerDetails();
        } finally {
            setIsLoading(false);
        }
    };

    const validateFields = () => {
        const errors = {};
        const fields = {
            customerName: 'Customer Name',
            userName: 'User Name',
            ispName: 'ISP Name',
            amount: 'Amount',
            address: 'Address',
            phone: 'Phone',
            pkg: 'Package'
        };

        Object.entries(fields).forEach(([key, label]) => {
            if (!eval(key)?.trim()) {
                errors[key] = `${label} is required`;
            }
        });

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        const date = new Date();
        const year = date.getFullYear();

        const monthNumber = new Date(month).getMonth() + 1;
        const monthString = monthNumber.toString().padStart(2, '0');
        console.log(monthString, 'monthString');
        const invoiceData = {
            invoiceNumber: currentInvoiceNumber,
            date,
            time,
            chargedBy,
            userName,
            customerId,
            package: pkg,
            month: Number(monthString),
            userName,
            customerName,
            dealerId: role === 'staff' ? staffDealerId : dealerId,
            ispName,
            amount,
            address,
            phone
        };

        // dispatch(createInvoice(invoiceData, userId))
        //     .then(() => fetchLatestInvoiceNumber(), clearCustomerDetails())
        handlePrint();
    };

    const receiptData = {
        invoiceNumber: currentInvoiceNumber,
        date,
        chargedBy,
        customerId,
        userName,
        customerName,
        ispName,
        amount,
        month,
        address,
        userPhone,
        time,
        phone
    };

    const handleSearchFormSubmit = (e) => {
        e.preventDefault();
        handleSearch(e);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, maxWidth: 800, margin: 'auto' }}>
                <Typography variant="h5" gutterBottom color={colors.secondary}>
                    Create Receipt
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSearchFormSubmit}>
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                label="Customer Username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                fullWidth
                                error={!!fieldErrors.userName}
                                helperText={fieldErrors.userName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                disabled={isLoading}
                                fullWidth
                                sx={{ height: '56px' }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Search'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Invoice Number"
                                value={currentInvoiceNumber ? `#${currentInvoiceNumber}` : 'Loading...'}
                                disabled
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Month"
                                type="month"
                                value={month}
                                onChange={(e) => {
                                    console.log(e.target.value); // Log the value to debug
                                    setMonth(e.target.value);
                                }}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={6}>
                            <TextField
                                label="Customer username"
                                value={userName}
                                onChange={handleCustomerName}
                                fullWidth
                                                error={!!fieldErrors.customerName}
                helperText={fieldErrors.customerName}

                                sx={{ mb: 2 }}
                            />
                        </Grid> */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                value={customerName}
                                disabled
                                onChange={() => setCustomerName(userName)}
                                fullWidth
                                error={!!fieldErrors.customerName}
                                helperText={fieldErrors.customerName}

                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="ISP Name"
                                value={ispName}
                                disabled
                                fullWidth
                                error={!!fieldErrors.ispName}
                                helperText={fieldErrors.ispName}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Address"
                                value={address}
                                disabled
                                fullWidth
                                error={!!fieldErrors.address}
                                helperText={fieldErrors.address}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone"
                                value={phone}
                                disabled
                                fullWidth
                                error={!!fieldErrors.phone}
                                helperText={fieldErrors.phone}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                fullWidth
                                error={!!fieldErrors.amount}
                                helperText={fieldErrors.amount}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Package"
                                value={pkg}
                                onChange={(e) => setPkg(e.target.value)}
                                disabled
                                fullWidth
                                error={!!fieldErrors.pkg}
                                helperText={fieldErrors.pkg}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Charged By"
                                value={chargedBy}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="phone"
                            value={userPhone}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    {/* </Grid> */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 2, bgcolor: colors.secondary }}
                        // disabled={isLoading || Object.keys(fieldErrors).length > 0}
                        >
                            Generate Receipt
                        </Button>
                    </Grid>
                </form>
            </Paper>

            <div style={{ display: 'none' }}>
                <PrintableReceipt ref={componentRef} receiptData={receiptData} />
            </div>
        </Box>
    );
};

export default Slips;