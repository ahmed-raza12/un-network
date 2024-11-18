import React, { useRef } from 'react';
import { Box, Typography, Divider, Grid, Paper, Button } from '@mui/material';
import { green } from '@mui/material/colors';
import { useReactToPrint } from 'react-to-print';

// Use forwardRef to forward the ref properly
const PrintableInvoice = React.forwardRef(({ invoiceDetails }, ref) => (
  <div ref={ref}>
    <Paper
      elevation={0} // Remove unnecessary borders/shadows for receipts
      sx={{
        padding: 2,
        width: '58mm', // For 58mm thermal printers (or adjust for your printer's width)
        margin: 'auto',
        backgroundColor: 'white',
        '@media print': {
          width: '58mm',
        },
      }}
    >

      {/* Header */}
      <Box textAlign="center" mb={2}>
        <Typography variant="h5" fontWeight="bold" color="#6b49e4">
          Package Invoice
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Invoice # {invoiceDetails.invoiceNumber}
        </Typography>
        <Box
          sx={{
            backgroundColor: green[100],
            padding: '4px 12px',
            borderRadius: 8,
            display: 'inline-block',
            color: green[700],
            mt: 1,
          }}
        >
          <Typography variant="body2">{invoiceDetails.date}</Typography>
        </Box>
      </Box>

      {/* User Details */}
      <Box textAlign="left" mt={3}>
        <Typography variant="h6" fontWeight="bold" color="#6b49e4">
          {invoiceDetails.userName}
        </Typography>
        <Typography variant="body1" color="#6b49e4">
          {invoiceDetails.userPhone}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {invoiceDetails.userAddress}
        </Typography>
      </Box>

      {/* Section Divider */}
      <Divider sx={{ my: 2 }} />

      {/* User Detail Section */}
      <Box bgcolor="#e0ebff" padding={1} borderRadius={1} mb={1}>
        <Typography variant="body2" color="textSecondary">
          User Detail
        </Typography>
      </Box>
      <Typography variant="body2" color="#6b49e4">
        UserName
      </Typography>
      <Typography variant="body2" color="textSecondary">
        -
      </Typography>

      {/* Package Detail Section */}
      <Box bgcolor="#e0ebff" padding={1} borderRadius={1} my={2}>
        <Typography variant="body2" color="textSecondary">
          Package Detail
        </Typography>
      </Box>
      <Typography variant="body2" color="#6b49e4">
        Package
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {invoiceDetails.packageName}
      </Typography>

      {/* Payment Details Section */}
      <Box bgcolor="#e0ebff" padding={1} borderRadius={1} my={2}>
        <Typography variant="body2" color="textSecondary">
          Payment Details
        </Typography>
      </Box>
      <Grid container justifyContent="space-between" mb={1}>
        <Typography variant="body2" color="#6b49e4">
          Package Price
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {invoiceDetails.packagePrice}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between" mb={1}>
        <Typography variant="body2" color="#6b49e4">
          Discount
        </Typography>
        <Typography variant="body2" color="red">
          -{invoiceDetails.discount}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between" mb={1}>
        <Typography variant="body2" color="#6b49e4" fontWeight="bold">
          Total Amount
        </Typography>
        <Typography variant="body2" color="textSecondary" fontWeight="bold">
          {invoiceDetails.totalAmount}
        </Typography>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container justifyContent="space-between" mb={1}>
        <Typography variant="body2" color="#6b49e4">
          Paid Amount
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {invoiceDetails.paidAmount}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between" mb={1}>
        <Typography variant="body2" color="#6b49e4">
          Balance
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {invoiceDetails.balance}
        </Typography>
      </Grid>
    </Paper>
  </div>
));

function Invoice() {
  const invoiceDetails = {
    invoiceNumber: '828',
    date: '13-November-2024 02:14 PM',
    userName: 'hgh jhj',
    userPhone: '03030669886',
    userAddress: 'hghnb 1234',
    packageName: 'CATV',
    packagePrice: 500,
    discount: 0,
    totalAmount: 500,
    paidAmount: 300,
    balance: 200,
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice-${invoiceDetails.invoiceNumber}`,
    removeAfterPrint: true,
  });

  return (
    <Box>
      <PrintableInvoice ref={componentRef} invoiceDetails={invoiceDetails} />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          onClick={handlePrint}
          sx={{
            backgroundColor: '#6b49e4',
            '&:hover': {
              backgroundColor: '#5438b3',
            },
            '@media print': {
              display: 'none',
            },
          }}
        >
          Print Invoice
        </Button>
      </Box>
    </Box>
  );
}

export default Invoice;
