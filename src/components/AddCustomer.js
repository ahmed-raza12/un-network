import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
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
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>First Name</Typography>
          <TextField
            sx={TextFieldStyle}
            placeholder="John"
            fullWidth
            variant="outlined"
            size="small"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>Last Name</Typography>
          <TextField
            sx={TextFieldStyle}
            placeholder="Doe"
            fullWidth
            variant="outlined"
            size="small"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>Phone Number</Typography>
          <TextField
            sx={TextFieldStyle}
            placeholder="03001234567"
            fullWidth
            variant="outlined"
            size="small"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>Address</Typography>
          <TextField
            sx={TextFieldStyle}
            placeholder="House No."
            fullWidth
            variant="outlined"
            size="small"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>Area</Typography>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Area</InputLabel>
            <Select
              sx={TextFieldStyle}
              label="Area"
              labelId="area-select-label"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <MenuItem value="area1">Area 1</MenuItem>
              <MenuItem value="area2">Area 2</MenuItem>
              <MenuItem value="area3">Area 3</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>Sub Area</Typography>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Sub Area</InputLabel>
            <Select
              sx={TextFieldStyle}
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
          <Typography sx={{ color: colors.primary }}>ISP</Typography>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>ISP</InputLabel>
            <Select
              sx={TextFieldStyle}
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
          <Typography sx={{ color: colors.primary }}>Package</Typography>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Package</InputLabel>
            <Select
              sx={TextFieldStyle}
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
          <Typography sx={{ color: colors.primary }}>Amount Paid</Typography>
          <TextField
            sx={TextFieldStyle}
            placeholder="Amount"
            fullWidth
            variant="outlined"
            size="small"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>User Name</Typography>
          <TextField
            sx={TextFieldStyle}
            placeholder="UM100"
            fullWidth
            variant="outlined"
            size="small"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>Voucher Number</Typography>
          <TextField
            sx={TextFieldStyle}
            placeholder="Voucher Number"
            fullWidth
            variant="outlined"
            size="small"
            value={voucherNumber}
            onChange={(e) => setVoucherNumber(e.target.value)}
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
    </Box>
  );
}

export default AddCustomer;
