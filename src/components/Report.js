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
  Stack,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { FileDownload, PictureAsPdf } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoicesByDateRange, fetchInvoicesByDateRanges } from '../store/actions/reportActions';
import generateTestInvoices from '../utils/generateTestInvoices';
import { fetchStaff, fetchStaffByDealerId } from '../store/actions/staffActions';
import colors from '../colors';

function Report() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [staffItem, setStaffItem] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const dealerId = useSelector((state) => state.auth.user.uid);
  const [isLoading, setIsLoading] = useState(false);
  const dealers = useSelector((state) => state.dealers?.dealers);
  const user = useSelector((state) => state.auth.user);
  const staff = useSelector((state) => state.staff.staff);
  const isAdmin = user.role === 'admin';
  const isDealer = user.role === 'dealer';
  const { invoices = [], loading, error: invoiceError } = useSelector((state) => state.report);

  // Add summary calculation
  const summary = React.useMemo(() => {
    if (!invoices.length) return null;

    return {
      totalInvoices: invoices.length,
      totalAmount: invoices.reduce((sum, invoice) => sum + (Number(invoice?.amount) || 0), 0).toLocaleString(),
      averageAmount: (invoices.reduce((sum, invoice) => sum + (Number(invoice?.amount) || 0), 0) / invoices.length).toLocaleString(),
      uniqueCustomers: new Set(invoices.map(invoice => invoice?.customerName)).size
    };
  }, [invoices]);

  useEffect(() => {
    const fetchStaffData = async () => {
      setIsLoading(true);
      try {
        if (isDealer) {
          await dispatch(fetchStaff());
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
      const start = new Date(startDate);
      const end = new Date(endDate);
      const formattedStartDate = start.toISOString().split('T')[0];
      const formattedEndDate = end.toISOString().split('T')[0];

      await dispatch(fetchInvoicesByDateRanges(user.uid, formattedStartDate, formattedEndDate, staffItem))
      setError(null);

    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError(error.message || "Error fetching invoices.");
    }
  };
  const exportToCSV = () => {
    if (!invoices.length) return;

    const headers = [
      'Invoice No',
      'Customer ID',
      'Date',
      'Time',
      'Customer',
      'Address',
      'Package',
      'Charged By',
      'Amount'
    ];

    const data = invoices.map(invoice => [
      invoice?.invoiceNumber || 'N/A',
      invoice?.userName || 'N/A',
      invoice?.date ? new Date(invoice.date).toLocaleDateString() : 'N/A',
      invoice?.time || 'N/A',
      invoice?.customerName || 'N/A',
      invoice?.address || 'N/A',
      invoice?.package || 'N/A',
      invoice?.chargedBy || 'N/A',
      invoice?.amount || 0
    ]);

    // Add BOM for Excel to properly recognize UTF-8
    const BOM = "\uFEFF";
    const csvContent = BOM + [
      headers.join(','),
      ...data.map(row =>
        row.map(cell =>
          // Handle cells that contain commas by wrapping in quotes
          typeof cell === 'string' && cell.includes(',') ?
            `"${cell}"` : cell
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invoice_report_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    if (!invoices.length) return;

    // Create a new window for printing
    const printWindow = window.open('', '', 'height=600,width=800');

    // Generate the HTML content
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .summary { 
              margin: 20px 0;
              padding: 15px;
              background: #f5f5f5;
              border-radius: 4px;
            }
            table { 
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td { 
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th { 
              background-color: #f5f5f5;
            }
            .text-right {
              text-align: right;
            }
            @media print {
              button { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>Invoice Report</h1>
          <div class="summary">
            <p><strong>Date Range:</strong> ${startDate} to ${endDate}</p>
            <p><strong>Total Invoices:</strong> ${summary?.totalInvoices || 0}</p>
            <p><strong>Total Amount:</strong> Rs. ${summary?.totalAmount || 0}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Customer ID</th>
                <th>Customer</th>
                <th>Time</th>
                <th>Date</th>
                <th>Package</th>
                <th>Charged By</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoices.map(invoice => `
                <tr>
                    <td>${invoice.invoiceNumber || 'N/A'}</td>
                    <td>${invoice.userName || 'N/A'}</td>
                    <td>${invoice.customerName || 'N/A'}</td>
                    <td>
                        ${invoice.time
        ? invoice.time.split(':').slice(0, 2).join(':') + ' ' + invoice.time.split(' ')[1]
        : 'N/A'}
                  </td>
                    <td>${invoice.date ? new Date(invoice.date).toLocaleDateString() : 'N/A'}</td>
                    <td>${invoice.package || 'N/A'}</td>
                    <td>${invoice.chargedBy || 'N/A'}</td>
                    <td>Rs. ${invoice.amount || 0}</td>                </tr>
              `).join('')}
            </tbody>
          </table>
          <button onclick="window.print(); window.close();" 
                  style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
            Print Report
          </button>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color={colors.secondary} gutterBottom>
          Invoice Report
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            onClick={exportToCSV}
            disabled={!invoices.length || loading}
            sx={{
              backgroundColor: colors.secondary,
              '&:hover': { backgroundColor: colors.primary }
            }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            onClick={exportToPDF}
            disabled={!invoices.length || loading}
            sx={{
              backgroundColor: colors.secondary,
              '&:hover': { backgroundColor: colors.primary }
            }}
          >
            Print Report
          </Button>
        </Stack>
      </Box>
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
              InputLabelProps={{ shrink: true }}
              InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ style: { backgroundColor: "#f5f5f5" } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            {
              isDealer ? (
                <TextField
                  select
                  fullWidth
                  label="Staff"
                  value={staffItem}
                  onChange={(e) => setStaffItem(e.target.value)}
                  sx={{ height: '56px' }}
                >
                  <MenuItem value="onlydealer">Only Dealer</MenuItem>
                  <MenuItem value="all">All</MenuItem>
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    staff.map((staffMember) => (
                      <MenuItem key={staffMember.id} value={staffMember.uid}>
                        {staffMember.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              ) : (
                <TextField
                  select
                  fullWidth
                  label="Staff"
                  value={staffItem}
                  onChange={(e) => setStaffItem(e.target.value)}
                  sx={{ height: '56px' }}
                >
                  <MenuItem value={user.uid}>{user.name}</MenuItem>
                </TextField>
              )}
          </Grid>
          {/* <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Staff"
              value={staffItem}
              onChange={(e) => setStaffItem(e.target.value)}
              sx={{ height: '56px' }}
            >
              <MenuItem value="onlydealer">Only Dealer</MenuItem>
              <MenuItem value="all">All</MenuItem>
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                staff.map((staffMember) => (
                  <MenuItem key={staffMember.id} value={staffMember.uid}>
                    {staffMember.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid> */}
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading || generating}
              fullWidth
              sx={{
                height: '56px',
                backgroundColor: colors.secondary,
                '&:hover': { backgroundColor: colors.primary }
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
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  Total Invoices
                </Typography>
                <Typography variant="h6" color="primary">
                  {summary.totalInvoices}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary">
                  Rs. {summary.totalAmount}
                </Typography>
              </Box>
            </Grid>
            {/* <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  Average Amount
                </Typography>
                <Typography variant="h6" color="primary">
                  Rs. {summary.averageAmount}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  Unique Customers
                </Typography>
                <Typography variant="h6" color="primary">
                  {summary.uniqueCustomers}
                </Typography>
              </Box>
            </Grid> */}
          </Grid>
        </Paper>
      )}

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
                <TableCell>Customer ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Charged By</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(invoices) && invoices.map((invoice) => (
                <TableRow key={invoice?.id || invoice?.customerId || Math.random()}>
                  <TableCell>{invoice?.invoiceNumber || 'N/A'}</TableCell>
                  <TableCell>{invoice?.userName || 'N/A'}</TableCell>
                  <TableCell>{invoice?.date ? new Date(invoice.date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{invoice.time
                    ? invoice.time.split(':').slice(0, 2).join(':') + ' ' + invoice.time.split(' ')[1]
                    : 'N/A'}</TableCell>
                  <TableCell>{invoice?.customerName || 'N/A'}</TableCell>
                  <TableCell>{invoice?.address || 'N/A'}</TableCell>
                  <TableCell>{invoice?.package || 'N/A'}</TableCell>
                  <TableCell>{invoice?.chargedBy || 'N/A'}</TableCell>
                  <TableCell align="right">Rs. {invoice?.amount || 0}</TableCell>
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