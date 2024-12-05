import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Paper, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomer } from '../store/actions/customerActions';
import colors from '../colors';
import { TextFieldStyle } from './CreateISP';

function AddCustomer() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [subArea, setSubArea] = useState('');
  const [isp, setIsp] = useState('');
  const [packageType, setPackageType] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [userName, setUserName] = useState('');
  const [voucherNumber, setVoucherNumber] = useState('');

  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user.role);
  const dealerId = useSelector((state) => state.auth.user.uid);
  const selectedDealerId = role === 'admin' ? localStorage.getItem('selectedDealer') : dealerId;

  const handleSubmit = () => {
    if (role === 'admin' && !selectedDealerId) {
      alert('Please select a dealer first');
      return;
    }

    const customerData = {
      firstName,
      lastName,
      phoneNumber,
      address,
      area,
      subArea,
      isp,
      packageType,
      amountPaid,
      userName,
      voucherNumber,
    };

    dispatch(addCustomer(customerData, selectedDealerId));
    localStorage.setItem('customerData', JSON.stringify(customerData));
  };

  return (
    <Box sx={{ backgroundColor: '#f4f6fd', padding: 4, borderRadius: 2, maxWidth: "auto" }}>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="h5" sx={{ mb: 3, color: colors.primary }}>
          Create New Customer
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
                InputLabelProps={{
                  style: { color: colors.primary },
                }}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
                InputLabelProps={{
                  style: { color: colors.primary },
                }}
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
                InputLabelProps={{
                  style: { color: colors.primary },
                }}
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
                InputLabelProps={{
                  style: { color: colors.primary },
                }}
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <FormControl fullWidth variant="outlined" sx={TextFieldStyle} size="small">
                <InputLabel color={colors.primary}>Area</InputLabel>
                <Select
                  label="Area"
                  labelId="area-select-label"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  size="small"
                >
                  <MenuItem value="area1">Area 1</MenuItem>
                  <MenuItem value="area2">Area 2</MenuItem>
                  <MenuItem value="area3">Area 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <FormControl fullWidth variant="outlined" sx={TextFieldStyle} size="small">
                <InputLabel>Sub Area</InputLabel>
                <Select
                  label="Sub Area"
                  value={subArea}
                  onChange={(e) => setSubArea(e.target.value)}
                >
                  <MenuItem value="subarea1">Sub Area 1</MenuItem>
                  <MenuItem value="subarea2">Sub Area 2</MenuItem>
                  <MenuItem value="subarea3">Sub Area 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <FormControl fullWidth variant="outlined" sx={TextFieldStyle} size="small">
                <InputLabel>ISP</InputLabel>
                <Select
                  label="ISP"
                  value={isp}
                  onChange={(e) => setIsp(e.target.value)}
                >
                  <MenuItem value="isp1">ISP 1</MenuItem>
                  <MenuItem value="isp2">ISP 2</MenuItem>
                  <MenuItem value="isp3">ISP 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <FormControl fullWidth variant="outlined" sx={TextFieldStyle} size="small">
                <InputLabel>Package</InputLabel>
                <Select
                  label="Package"
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                >
                  <MenuItem value="package1">Package 1</MenuItem>
                  <MenuItem value="package2">Package 2</MenuItem>
                  <MenuItem value="package3">Package 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Amount Paid"
                name="amountPaid"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
                InputLabelProps={{
                  style: { color: colors.primary },
                }}
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="User Name"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
                InputLabelProps={{
                  style: { color: colors.primary },
                }}
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Voucher Number"
                name="voucherNumber"
                value={voucherNumber}
                onChange={(e) => setVoucherNumber(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
                InputLabelProps={{
                  style: { color: colors.primary },
                }}
              />
            </Grid>
          </Grid>
          <Box display="flex" alignItems="center" justifyContent={"center"} mb={2}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              style={{ marginLeft: '10px', marginTop: 30, backgroundColor: colors.primary }}
            >
              Create Customer
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default AddCustomer;
