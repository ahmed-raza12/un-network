import React, { useState, useRef } from 'react';
import { Box, Typography, Divider, Grid, Paper, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { green } from '@mui/material/colors';
import { useReactToPrint } from 'react-to-print';
import { createInvoice } from '../store/actions/invoiceActions';
import { useDispatch, useSelector } from 'react-redux';

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
                {/* <Typography variant="subtitle1" color="textPrimary">
                    Receipt #{receiptData.invoiceNo}
                </Typography> */}
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
                    {new Date(receiptData.month).toLocaleString('default', {month: 'long'})}
                </Typography>
            </Grid>
        </Paper>
    </div>
));

const Slips = () => {
    const [invoiceNo, setInvoiceNo] = useState('001');
    const [date, setDate] = useState(new Date().toLocaleString('default', {month: 'short', day: 'numeric', year: 'numeric'}));
    const [userName, setUserName] = useState('');
    // const [chargedBy, setChargedBy] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [ispName, setIspName] = useState('');
    const[pkg, setPkg] = useState('');
    const [amount, setAmount] = useState('');
    const [month, setMonth] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const chargedBy = useSelector((state) => state.auth.user.name);
    const dispatch = useDispatch();
    const dealerId = useSelector((state) => state.auth.user.uid);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const fetchCustomerDetails = (id) => {
        try {

            const customers = JSON.parse(localStorage.getItem(`customers_${dealerId}`)) || [];
            console.log(customers, 'customers');
            
            const customer = customers.find(c => c.userName === id);
            return customer || null;
        } catch (error) {
            console.error('Error fetching customer details:', error);
            return null;
        }
    };

    const handleCustomerName = (e) => {
        const id = e.target.value;
        setUserName(id);
        console.log(id, 'id');
        
        if (id) {
            const customerDetails = fetchCustomerDetails(id);
            console.log(customerDetails, 'customerDetails');
            
            if (customerDetails) {
                setCustomerName(customerDetails.fullName || '');
                setIspName(customerDetails.ispName || '');
                setAddress(customerDetails.address || '');
                setPhone(customerDetails.phone || '');
                setUserName(customerDetails.userName || '');
                setPkg(customerDetails.package || '');
                setCustomerId(customerDetails.id || '');
            } else {
                setCustomerName('');
                setIspName('');
                setAddress('');
                setPhone('');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const invoiceData = {
            invoiceNo: `INV-${year}${month}-${customerId.slice(-4)}`,
            date,
            chargedBy,
            userName,
            customerId,
            month,
            userName,
            customerName,
            dealerId,
            ispName,
            amount,
            address,
            phone
        };
        
        dispatch(createInvoice(invoiceData));
        handlePrint();
        
        setInvoiceNo(prev => {
            const num = parseInt(prev) + 1;
            return num.toString().padStart(3, '0');
        });
    };

    const receiptData = {
        invoiceNo,
        date,
        chargedBy,
        customerId,
        userName,
        customerName,
        ispName,
        amount,
        month,
        address,
        phone
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
                <Typography variant="h5" gutterBottom color="#6b49e4">
                    Create Receipt
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Date"
                                type="date"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Customer username"
                                value={userName}
                                onChange={handleCustomerName}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                value={customerName}
                                onChange={() => setCustomerName(userName)}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="ISP Name"
                                value={ispName}
                            
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Address"
                                value={address}
                            
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone"
                                value={phone}
                            
                                fullWidth
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
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Month</InputLabel>
                                <Select
                                    value={month}
                                    label="Month"
                                    onChange={(e) => setMonth(e.target.value)}
                                >
                                    <MenuItem value="OLD">OLD</MenuItem>
                                    <MenuItem value="CURRENT">CURRENT</MenuItem>
                                    <MenuItem value="ADV">ADV</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid> */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Package"
                                value={pkg}
                                onChange={(e) => setPkg(e.target.value)}
                                disabled
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Charged By"
                                value={chargedBy}
                                // onChange={(e) => setChargedBy(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                    </Grid>
                    
                    <Button 
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 3,
                            backgroundColor: '#6b49e4',
                            '&:hover': {
                                backgroundColor: '#5438b3'
                            }
                        }}
                    >
                        Generate & Print Receipt
                    </Button>
                </form>
            </Paper>

            <div style={{ display: 'none' }}>
                <PrintableReceipt ref={componentRef} receiptData={receiptData} />
            </div>
        </Box>
    );
};

export default Slips;