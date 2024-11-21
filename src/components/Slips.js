import React, { useState, useRef } from 'react';
import { Box, Typography, Divider, Grid, Paper, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { green } from '@mui/material/colors';
import { useReactToPrint } from 'react-to-print';

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
                    Payment Receipt
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Receipt #{receiptData.invoiceNo}
                </Typography>
                <Box sx={{
                    backgroundColor: green[100],
                    padding: '4px 12px',
                    borderRadius: 8,
                    display: 'inline-block',
                    color: green[700],
                    mt: 1,
                }}>
                    
                    <Typography variant="body2">{new Date(receiptData.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</Typography>
                </Box>
            </Box>

            {/* User Details */}
            <Box textAlign="left" mt={3}>
                <Typography variant="h6" fontWeight="bold" color="#6b49e4">
                    {receiptData.userName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    User ID: {receiptData.userId}
                </Typography>
            </Box>

            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Charged By
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {receiptData.chargedBy}
                </Typography>
            </Grid>
            <Divider sx={{ my: 2 }} />

            {/* ISP Details */}
            <Box bgcolor="#e0ebff" padding={1} borderRadius={1} mb={1}>
                <Typography variant="body2" color="textSecondary">
                    ISP Details
                </Typography>
            </Box>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    ISP Name
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {receiptData.ispName}
                </Typography>
            </Grid>

            {/* Payment Details */}
            <Box bgcolor="#e0ebff" padding={1} borderRadius={1} my={2}>
                <Typography variant="body2" color="textSecondary">
                    Payment Details
                </Typography>
            </Box>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Amount
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Rs. {receiptData.amount}
                </Typography>
            </Grid>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Month
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {receiptData.month}
                </Typography>
            </Grid>
        </Paper>
    </div>
));

const Slips = () => {
    const [invoiceNo, setInvoiceNo] = useState('001');
    const [date, setDate] = useState(new Date().toLocaleString('default', {month: 'short', day: 'numeric', year: 'numeric'}));
    // const [date, setDate] = useState(new Date().toDateString().split('T')[0]);
    const [chargedBy, setChargedBy] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [ispName, setIspName] = useState('');
    const [amount, setAmount] = useState('');
    const [month, setMonth] = useState('');

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // Mock function to fetch user details - replace with actual API call
    const fetchUserDetails = (id) => {
        // This should be replaced with actual API call
        return {
            name: 'John Doe',
            isp: 'Sample ISP'
        };
    };

    const handleUserIdChange = (e) => {
        const id = e.target.value;
        setUserId(id);
        
        if (id) {
            const userDetails = fetchUserDetails(id);
            setUserName(userDetails.name);
            setIspName(userDetails.isp);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
        userId,
        userName,
        ispName,
        amount,
        month
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
                                label="Invoice No"
                                value={invoiceNo}
                                disabled
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="User ID"
                                value={userId}
                                onChange={handleUserIdChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                value={userName}
                                disabled
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="ISP Name"
                                value={ispName}
                                disabled
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
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Charged By"
                                value={chargedBy}
                                onChange={(e) => setChargedBy(e.target.value)}
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