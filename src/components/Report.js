import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function Report() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Dummy data for the table
  const reportData = [
    {
      id: 1,
      customerId: "C001",
      date: "2024-11-15",
      fullName: "John Doe",
      address: "123 Main St",
      chargedBy: "Admin",
      lastActivationDate: "2024-11-01",
      package: "Premium",
      units: 150,
      resellerId: "R001",
      contractorId: "CON001",
      subContractorId: "SUB001",
      packageAmount: 100,
      unusedAmount: 20,
      totalAmount: 120,
    },
    {
      id: 2,
      customerId: "C001",
      date: "2024-11-15",
      fullName: "John Doe",
      address: "123 Main St",
      chargedBy: "Admin",
      lastActivationDate: "2024-11-01",
      package: "Premium",
      units: 150,
      resellerId: "R001",
      contractorId: "CON001",
      subContractorId: "SUB001",
      packageAmount: 100,
      unusedAmount: 20,
      totalAmount: 120,
    },
    {
      id: 3,
      customerId: "C001",
      date: "2024-11-15",
      fullName: "John Doe",
      address: "123 Main St",
      chargedBy: "Admin",
      lastActivationDate: "2024-11-01",
      package: "Premium",
      units: 150,
      resellerId: "R001",
      contractorId: "CON001",
      subContractorId: "SUB001",
      packageAmount: 100,
      unusedAmount: 20,
      totalAmount: 120,
    },
    // Add more rows as needed
  ];

  const handleSearch = () => {
    console.log("Searching for reports...");
    // Logic for searching reports based on date range
  };

  const handleDownload = () => {
      console.log("Downloading CSV...");
      
      // Convert data to CSV format
      const headers = [
          'Customer ID',
          'Date',
          'Full Name',
          'Address',
          'Charged By',
          'Last Activation Date',
          'Package',
          'Units',
          'Reseller ID',
          'Contractor ID',
          'Sub Contractor ID',
          'Package Amount',
          'Unused Amount',
          'Total Amount'
      ];
      
      const csvRows = [
          headers.join(','), // Header row
          ...reportData.map(row => [
              row.customerId,
              row.date,
              `"${row.fullName}"`, // Wrap in quotes to handle commas in names
              `"${row.address}"`,
              row.chargedBy,
              row.lastActivationDate,
              `"${row.package}"`,
              row.units,
              row.resellerId,
              row.contractorId,
              row.subContractorId,
              row.packageAmount,
              row.unusedAmount,
              row.totalAmount
          ].join(','))
      ];
      
      const csvString = csvRows.join('\n');
      
      // Create a Blob and download
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `report_${new Date().toISOString().split('T')[0]}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  };
  return (
    <Box sx={{ padding: 4, maxWidth: "100%", margin: "auto" }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
        Report
      </Typography>

      {/* Form */}
      <Paper sx={{ padding: 3, marginBottom: 3 }} elevation={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Report Type"
              value="Daily Units Consumption"
              disabled
              InputProps={{
                style: { backgroundColor: "#f5f5f5" },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={2} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid item xs={12} md={12} textAlign="right" sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownload}
        >
          Download CSV
        </Button>
      </Grid>
      {/* Table */}
      <Grid item xs={12} md={12} sx={{
        '@media (max-width: 600px)': {
          '& .MuiTableCell-root': {
            padding: '4px 8px',
            fontSize: '0.75rem',
          }
        }
      }} >

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                {[
                  "#",
                  "Customer ID",
                  "Date",
                  "Full Name",
                  "Address",
                  "Charged by",
                  "Last Activation Date",
                  "Package",
                  "Units",
                  "Reseller ID",
                  "Contractor ID",
                  "Sub-Contractor ID",
                  "Package/Addon Amount",
                  "Previous Package/Addon Unused Amount",
                  "Total Amount",
                ].map((header, index) => (
                  <TableCell key={index} align="center">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{row.customerId}</TableCell>
                  <TableCell align="center">{row.date}</TableCell>
                  <TableCell align="center">{row.fullName}</TableCell>
                  <TableCell align="center">{row.address}</TableCell>
                  <TableCell align="center">{row.chargedBy}</TableCell>
                  <TableCell align="center">{row.lastActivationDate}</TableCell>
                  <TableCell align="center">{row.package}</TableCell>
                  <TableCell align="center">{row.units}</TableCell>
                  <TableCell align="center">{row.resellerId}</TableCell>
                  <TableCell align="center">{row.contractorId}</TableCell>
                  <TableCell align="center">{row.subContractorId}</TableCell>
                  <TableCell align="center">{row.packageAmount}</TableCell>
                  <TableCell align="center">{row.unusedAmount}</TableCell>
                  <TableCell align="center">{row.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Box>
  );
}

export default Report;
