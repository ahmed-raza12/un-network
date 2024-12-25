import React, { useState, useRef } from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, Divider } from '@mui/material';
import { green } from '@mui/material/colors';
import { useReactToPrint } from 'react-to-print';
import colors from '../colors';

const PrintableQuickSlip = React.forwardRef(({ data }, ref) => (
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
                <Typography variant="body2" color="textPrimary">
                    {new Date(data.date).toLocaleDateString()}
                </Typography>
            </Box>
            <Box textAlign="left" mt={3}>
                <Typography variant="h6" fontWeight="bold" color="textPrimary">
                    {data.customerName || 'Customer Name'}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    Address: {data.address || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    Phone: {data.phone || 'N/A'}
                </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box textAlign="left">
                <Typography variant="body2" color="#6b49e4">
                    ISP Name: {data.ispName || 'N/A'}
                </Typography>
                <Typography variant="body2" color="#6b49e4">
                    Amount: Rs. {data.amount || '0'}
                </Typography>
                <Typography variant="body2" color="#6b49e4">
                    Month: {data.month || 'N/A'}
                </Typography>
            </Box>
        </Paper>
    </div>
));

const ManualSlip = () => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Default to today's date
        customerName: '',
        address: '',
        phone: '',
        ispName: '',
        amount: '',
        month: '',
    });

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                            label="Customer Name"
                            name="customerName"
                            value={formData.customerName}
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
                            label="ISP Name"
                            name="ispName"
                            value={formData.ispName}
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
                            name="month"
                            value={formData.month}
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
                </Grid>
                <Box textAlign="center" mt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePrint}
                        sx={{ mt: 2 }}
                    >
                        Print Slip
                    </Button>
                </Box>
            </Paper>
            <Box sx={{ display: 'none' }}>
                <PrintableQuickSlip ref={componentRef} data={formData} />
            </Box>
        </Box>
    );
};

export default ManualSlip;
