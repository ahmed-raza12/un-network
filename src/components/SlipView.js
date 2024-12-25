import React from 'react';
import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom'; // Assuming you are using React Router

const ReceiptScreen = () => {
  const location = useLocation();
  const { receiptData } = location.state || {}; // Receipt data passed via navigation state

  if (!receiptData) {
    return <Typography variant="h6">No receipt data available</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          padding: 2,
          width: '58mm',
          margin: 'auto',
          backgroundColor: 'white',
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={2}>
          <Typography variant="h6" fontWeight="bold" color="#6b49e4">
            Payment Bill
          </Typography>
          <Typography variant="subtitle1" color="textPrimary">
            Invoice #{receiptData.invoiceNumber}
          </Typography>
          <Box
            sx={{
              backgroundColor: '#e0ebff',
              padding: '4px 12px',
              borderRadius: 8,
              display: 'inline-block',
              color: '#6b49e4',
              mt: 1,
            }}
          >
            <Typography variant="body2" color="textPrimary">
              {new Date(receiptData.date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
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
        <Divider sx={{ my: 2 }} />

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
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][receiptData.month - 1]}
          </Typography>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ReceiptScreen;
