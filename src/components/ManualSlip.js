import React, { useState, useRef } from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, Divider } from '@mui/material';
import { green } from '@mui/material/colors';
import { useReactToPrint } from 'react-to-print';
import colors from '../colors';
import { useSelector } from 'react-redux';

const PrintUserSlip = React.forwardRef(({ data }, ref) => (
    <div ref={ref}>
        <Paper
            elevation={0}
            sx={{
                padding: 2,
                width: '58mm',
                margin: 'auto',
                backgroundColor: 'white',
                '@media print': {
                    width: '58mm',
                },
            }}
        >
            <Box textAlign="center" mb={2}>
                <Typography variant="h6" fontWeight="bold" color="#6b49e4">
                    User Slip
                </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box bgcolor="#e0ebff" padding={1} borderRadius={1} my={2}>
                <Typography variant="body2" color="textPrimary">
                    User Details
                </Typography>
            </Box>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    User Name
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    {data.newUserName}
                </Typography>
            </Grid>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Password
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    {data.password}
                </Typography>
            </Grid>
        </Paper>
    </div>
));

const PrintableQuickSlip = React.forwardRef(({ data }, ref) => (
    console.log(data),
    <div ref={ref}>
        <Paper
            elevation={0}
            sx={{
                padding: 2,
                width: '58mm',
                margin: 'auto',
                backgroundColor: 'white',
                '@media print': {
                    width: '58mm',
                },
            }}
        >
            <Box textAlign="center" mb={2}>
                <Typography variant="h6" fontWeight="bold" color="#6b49e4">
                    Payment Slip
                </Typography>

                <Box sx={{
                    backgroundColor: green[100],
                    padding: '4px 12px',
                    borderRadius: 8,
                    display: 'inline-block',
                    color: green[700],
                    mt: 1,
                }}>

                    <Typography variant="body2" color="textPrimary">
                        {new Date(data.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                        &nbsp;
                        {data.time
                            ? data.time.split(':').slice(0, 2).join(':') + ' ' + data.time.split(' ')[1]
                            : 'N/A'}
                    </Typography>                </Box>
            </Box>
            <Box textAlign="left" mt={3}>
                <Typography mb={0.5} variant="h6" fontWeight="bold" color="textPrimary">
                    {data.fullName || 'Customer User Name'}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    Customer ID: {data.customerUserName || 'Customer User Name'}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    Address: {data.address || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    Phone: {data.phone || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    Charged By: {data.chargedBy || 'N/A'}
                </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
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
                    Rs. {data.amount}
                </Typography>
            </Grid>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Month
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    {new Date(data.month).toLocaleString('default', { month: 'long' })}
                </Typography>
            </Grid>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Phone
                </Typography>
                <Typography variant="body2" display="inline-block" color="textPrimary">
                    {data.dealerPhone && ` ${data.dealerPhone}`}
                </Typography>
                </Grid>
            <Grid container justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="#6b49e4">
                    Phone 2
                </Typography>
                <Typography variant="body2" display="inline-block" color="textPrimary">
                    {data.dealerPhone2 && ` ${data.dealerPhone2}`}    
                </Typography>
            </Grid>
        </Paper>
    </div>
));




const ManualSlip = () => {
    const chargedBy = useSelector((state) => state.auth.user.name);
    const dealerPhone = useSelector((state) => state.auth.user.dealerPhone);
    const dealerPhone2 = useSelector((state) => state.auth.user.dealerPhone2);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Default to today's date
        customerUserName: '',
        fullName: '',
        address: '',
        phone: '',
        package: '',
        amount: '',
        chargedBy,
        dealerPhone,
        dealerPhone2,
        time: new Date().toLocaleTimeString(),
        month: new Date().toISOString().slice(0, 7) // Default to current month in YYYY-MM format
    });

    const [userSlips, setUserSlips] = useState({
        newUserName: '',
        password: '',
    });

    const componentRef = useRef();
    const userComponentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handlePrintUserSlip = useReactToPrint({
        content: () => userComponentRef.current,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserSlips({ ...userSlips, [name]: value });
    };


    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
                <Typography variant="h5" gutterBottom color={colors.secondary}>
                    Manual Slip
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Customer User Name"
                            name="customerUserName"
                            value={formData.customerUserName}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Package"
                            name="package"
                            value={formData.package}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Amount (Rs.)"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Month"
                            type="month"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Box textAlign="center" mt={3}>
                    <Button
                        variant="contained"
                        // color={colors.primary}
                        onClick={handlePrint}
                        sx={{ mt: 2, bgcolor: colors.secondary }}
                    >
                        Print Slip
                    </Button>
                </Box>
            </Paper>
            <Box sx={{ display: 'none' }}>
                <PrintableQuickSlip ref={componentRef} data={formData} />
            </Box>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto', mt: 5 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="New User Name"
                            name="newUserName"
                            value={userSlips.newUserName}
                            onChange={handleUserChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Password"
                            name="password"
                            type="text"
                            value={userSlips.password}
                            onChange={handleUserChange}
                            fullWidth
                        />
                    </Grid>
                </Grid>

                <Box textAlign="center" mt={3}>
                    <Button
                        variant="contained"
                        onClick={handlePrintUserSlip}
                        sx={{ mt: 2, bgcolor: colors.secondary }}
                    >
                        Print
                    </Button>
                </Box>
            </Paper>
            <Box sx={{ display: 'none' }}>
                <PrintUserSlip ref={userComponentRef} data={userSlips} />
            </Box>
        </Box>
    );
};

export default ManualSlip;
