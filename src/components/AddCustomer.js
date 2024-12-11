import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Paper, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomer } from '../store/actions/customerActions';
import colors from '../colors';
import { TextFieldStyle } from './CreateISP';
import { fetchISPs } from '../store/actions/ispActions';
import { fetchPackages } from '../store/actions/packageActions';

function AddCustomer() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [userPackage, setUserPackage] = useState('');
  const [subArea, setSubArea] = useState('');
  const [isp, setIsp] = useState('');
  const [packageType, setPackageType] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [userName, setUserName] = useState('');
  const [cnic, setCnic] = useState('');

  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user.role);
  const dealerId = useSelector((state) => state.auth.user.uid);
  const selectedDealerId = role === 'admin' ? localStorage.getItem('selectedDealer') : dealerId;
  const allIsps = useSelector((state) => state.isp.isps);
  
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPackages = async () => {
      setLoading(true);
      try {
        const packagesData = isp !== '' && await dispatch(fetchPackages(isp));
        console.log(packagesData, isp, 'fetched packages');
        // Convert packages object to array and add id to each package
        const packagesArray = Object.entries(packagesData).map(([id, pkg]) => ({ ...pkg, id }));
        setPackages(packagesArray);
        console.log(packagesArray);
      } catch (error) {
        console.error('Error loading packages:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, [isp, dispatch]);

  const isLoading = useSelector((state) => state.isp.loading);


  useEffect(() => {
    const localIsps = localStorage.getItem(`isps_${selectedDealerId}`);
    if (localIsps) {
      dispatch({
        type: 'FETCH_ISPS_SUCCESS',
        payload: JSON.parse(localIsps),
      });
    } else {
      dispatch(fetchISPs(selectedDealerId));
    }
  }, [dispatch]);
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
      userPackage,
      subArea,
      isp,
      packageType,
      amountPaid,
      userName,
      cnic,
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
                label="First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" sx={TextFieldStyle} size="small">
                <InputLabel>ISP</InputLabel>
                <Select
                  label="ISP"
                  value={isp}
                  onChange={(e) => setIsp(e.target.value)}
                >
                  {
                    allIsps.map((isp) => (
                      <MenuItem key={isp.id} value={isp.id}>
                        {isp.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" sx={TextFieldStyle} size="small">
                <InputLabel color={colors.primary}>Package</InputLabel>
                <Select
                  label="Package"
                  labelId="area-select-label"
                  value={userPackage}
                  onChange={(e) => setUserPackage(e.target.value)}
                  size="small"
                >
                  {
                    packages.length > 0 && packages.map((pkg) => (
                      <MenuItem key={pkg.id} value={pkg.pkgName}>
                        {pkg.pkgName}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="User Name"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CNIC"
                name="cnic"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                required
                sx={TextFieldStyle}
                size="small"
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
