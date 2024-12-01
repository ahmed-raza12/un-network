import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoicesByDateRange } from '../store/actions/reportActions';
import generateTestInvoices from '../utils/generateTestInvoices';

function Report() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const { invoices = [], loading, summary } = useSelector((state) => state.report);

  const handleDateRangeChange = () => {
    if (startDate && endDate) {
      // Create dates in local timezone
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T23:59:59.999');

      console.log('Local dates:', {
        startInput: startDate,
        endInput: endDate,
        startDate: start.toISOString(),
        endDate: end.toISOString()
      });

      dispatch(fetchInvoicesByDateRange(start, end, paymentStatus));
    }
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    try {
      // Create dates in local timezone
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T23:59:59.999');

      console.log('Local dates:', {
        startInput: startDate,
        endInput: endDate,
        startDate: start.toISOString(),
        endDate: end.toISOString()
      });

      await dispatch(fetchInvoicesByDateRange(start, end, paymentStatus));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGenerateTestData = async () => {
    setGenerating(true);
    try {
      await generateTestInvoices();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Report
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ padding: 3, marginBottom: 3 }} elevation={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                style: { backgroundColor: "#f5f5f5" },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                style: { backgroundColor: "#f5f5f5" },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Payment Status"
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
              }}
              sx={{ height: '56px' }}
            >
              <MenuItem value="paid">Paid Customers</MenuItem>
              <MenuItem value="due">Due Customers</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading || generating}
              fullWidth
              sx={{
                height: '56px',
                backgroundColor: '#4CAF50',
                '&:hover': {
                  backgroundColor: '#45a049',
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Search"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {summary && (
        <Paper sx={{ padding: 3, marginBottom: 3 }} elevation={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" color="textSecondary">Total Amount</Typography>
              <Typography variant="h6">Rs. {summary.totalAmount}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" color="textSecondary">Total Invoices</Typography>
              <Typography variant="h6">{summary.totalInvoices}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" color="textSecondary">Paid Customers</Typography>
              <Typography variant="h6">{summary.paidCount}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" color="textSecondary">Due Customers</Typography>
              <Typography variant="h6">{summary.dueCount}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Grid container spacing={2} mb={3} justifyContent="flex-end">
        <Grid item>
          <Button
            variant="contained"
            onClick={handleGenerateTestData}
            disabled={generating || loading}
            sx={{
              backgroundColor: '#6b49e4',
              '&:hover': {
                backgroundColor: '#5438b3',
              }
            }}
          >
            {generating ? <CircularProgress size={24} /> : "Generate Test Data"}
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ '& .MuiTableCell-root': { borderRight: '1px solid rgba(224, 224, 224, 1)' } }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Invoice No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Package</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(invoices) && invoices.map((invoice) => (
              <TableRow key={invoice?.id || invoice?.customerId || Math.random()}>
                <TableCell>{invoice?.invoiceNo || 'N/A'}</TableCell>
                <TableCell>{invoice?.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{invoice?.customerName || 'N/A'}</TableCell>
                <TableCell>{invoice?.ispName || 'N/A'}</TableCell>
                <TableCell align="right">Rs. {invoice?.amount || 0}</TableCell>
                <TableCell>
                  <Typography
                    component="span"
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: invoice?.status === 'paid' ? '#e8f5e9' : '#ffebee',
                      color: invoice?.status === 'paid' ? '#2e7d32' : '#c62828'
                    }}
                  >
                    {invoice?.status === 'paid' ? 'Paid' : 'Due'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Report;
