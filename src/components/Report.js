import React, { useState, useEffect } from 'react';
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
import { fetchInvoicesByDateRange, fetchInvoicesByDateRanges } from '../store/actions/reportActions';
import generateTestInvoices from '../utils/generateTestInvoices';
import { fetchStaff, fetchStaffByDealerId } from '../store/actions/staffActions';

function Report() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [staffItem, setStaffItem] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  // const [dealerId, setDealerId] = useState('');
  const dealerId = useSelector((state) => state.auth.user.uid);
  const [isLoading, setIsLoading] = useState(false);
  const dealers = useSelector((state) => state.dealers?.dealers);
  const user = useSelector((state) => state.auth.user);
  const staff = useSelector((state) => state.staff.staff);
  const isAdmin = user.role === 'admin';
  const isDealer = user.role === 'dealer';
  const { invoices = [], loading, error: invoiceError } = useSelector((state) => state.report);
  console.log(staffItem, 'staff');


  useEffect(() => {
    const fetchStaffData = async () => {
      setIsLoading(true);
      try {
        if (isDealer) {
          console.log(dealerId, 'dealerId');
          await dispatch(fetchStaffByDealerId(dealerId));
        } else {
          await dispatch(fetchStaff());
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
      setIsLoading(false);
    };

    fetchStaffData();
  }, [dispatch, isAdmin, dealerId, invoices]);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    try {
      // Format the start and end dates
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Format the start and end dates as 'YYYY-MM-DD'
      const formattedStartDate = start.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const formattedEndDate = end.toISOString().split('T')[0]; // 'YYYY-MM-DD'


      // Fetch invoices from Firebase
      console.log(user, 'user');
      console.log(dealerId, 'dealerId');
      console.log(formattedStartDate, formattedEndDate, 'date');
      // Wait for the invoices to be fetched before proceeding
      await dispatch(fetchInvoicesByDateRanges(user.uid, formattedStartDate, formattedEndDate, staffItem));

      // If invoices are fetched successfully
      // console.log('Invoices fetched successfully');
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error('Error fetching invoices:', error);
      setError(error.message || "Error fetching invoices.");
    }
  };


  const handleGenerateTestData = async () => {
    setGenerating(true);
    try {
      await generateTestInvoices(dispatch);
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
          <Grid item xs={12} md={2}>
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
          <Grid item xs={12} md={2}>
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
          {/* <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Dealer"
              value={isAdmin ? dealerId : user.uid}
              onChange={(e) => {
                setDealerId(e.target.value);
              }}
              sx={{ height: '56px' }}
            >
              {isAdmin ? (
                <MenuItem value="none">None</MenuItem>
              ) : (
                <MenuItem value={user.uid}>{user.name}</MenuItem>
              )}
              {dealers.map((dealer) => (
                <MenuItem key={dealer.id} value={dealer.uid}>
                  {dealer.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Staff"
              value={staffItem}
              onChange={(e) => {
                setStaffItem(e.target.value);
              }}
              sx={{ height: '56px' }}
            >
              <MenuItem value="onlydealer">only dealer</MenuItem>
              <MenuItem value="all">All</MenuItem>
              {isLoading ? <CircularProgress size={24} /> : staff.map((staffMember) => (
                <MenuItem key={staffMember.id} value={staffMember.uid}>
                  {staffMember.name}
                </MenuItem>
              ))}
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

      {/* {summary && (
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
      )} */}

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
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : invoices.length === 0 ? (
        <Typography variant="body1" align="center" p={3}>
          No invoices found for the selected date range.
        </Typography>
      ) : (
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
      )}
    </Box>
  );
}

export default Report;
