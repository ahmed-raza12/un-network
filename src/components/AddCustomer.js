import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Paper, Typography, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomer } from '../store/actions/customerActions';
import colors from '../colors';
import { TextFieldStyle } from './CreateISP';
import { fetchISPs } from '../store/actions/ispActions';
import { fetchPackages } from '../store/actions/packageActions';

function AddCustomer() {
  // Existing state declarations
  const [fullName, setFullName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [userPackage, setUserPackage] = useState('');
  const [ispName, setIspName] = useState('');
  const [ispId, setIspId] = useState('');
  const [packageType, setPackageType] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [userName, setUserName] = useState('');
  const [CNIC, setCnic] = useState('');

  // Add validation states
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Existing Redux hooks and state
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
        const packagesData = ispId !== '' && await dispatch(fetchPackages(ispId));
        console.log(packagesData, ispName, 'fetched packages');
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
  }, [ispId, dispatch]);

  const isLoading = useSelector((state) => state.isp.loading);


  useEffect(() => {
    const localIsps = localStorage.getItem('ispsData');
    if (localIsps) {
      dispatch({
        type: 'FETCH_ISPS_SUCCESS',
        payload: JSON.parse(localIsps),
      });
    } else {
      dispatch(fetchISPs(selectedDealerId));
    }
  }, [dispatch]);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
      case 'lastName':
        return value.trim() ? '' : 'This field is required';
      case 'phone':
        const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
        if (!value.trim()) return 'Phone number is required';
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          return 'Invalid phone number format';
        }
        return '';
      case 'address':
        return value.trim().length >= 5 ? '' : 'Address must be at least 5 characters';
      case 'userName':
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        if (!value.trim()) return 'Username is required';
        if (!usernameRegex.test(value)) {
          return 'Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens';
        }
        return '';
      case 'CNIC':
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
        if (!value.trim()) return 'CNIC is required';
        if (!cnicRegex.test(value)) {
          return 'CNIC must be in format: 12345-1234567-1';
        }
        return '';
      case 'isp':
        return value ? '' : 'Please select an ISP';
      case 'userPackage':
        return value ? '' : 'Please select a package';
      default:
        return '';
    }
  };

  // Handle field changes with validation
  const handleFieldChange = (name, value) => {
    const fieldSetters = {
      fullName: setFullName,
      phone: setPhoneNumber,
      address: setAddress,
      userName: setUserName,
      CNIC: setCnic,
      ispName: setIspName,
      ispId: setIspId,
      userPackage: setUserPackage,
    };

    fieldSetters[name](value);
    console.log(value, name);
    // Validate field and update errors
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  // Format CNIC as user types
  const handleCnicChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 13) {
      // Format: 12345-1234567-1
      if (value.length > 5 && value.length <= 12) {
        value = `${value.slice(0, 5)}-${value.slice(5)}`;
      } else if (value.length > 12) {
        value = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12)}`;
      }
      handleFieldChange('CNIC', value);
    }
  };

  // Validate all fields before submission
  const validateForm = () => {
    const fields = {
      fullName,
      phone,
      address,
      userName,
      CNIC,
      ispName,
      userPackage,
    };

    const newErrors = {};
    Object.keys(fields).forEach(field => {
      const error = validateField(field, fields[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    if (!validateForm()) {
      setSubmitError('Please fix the errors before submitting.');
      setIsSubmitting(false);
      return;
    }

    if (role === 'admin' && !selectedDealerId) {
      setSubmitError('Please select a dealer first.');
      setIsSubmitting(false);
      return;
    }

    try {
      const customerData = {
        fullName,
        lastName,
        phone,
        address,
        package: userPackage,
        ispName,
        userName,
        CNIC,
      };

      await dispatch(addCustomer(customerData, selectedDealerId));

      // Clear form after successful submission
      setFullName('');
      setPhoneNumber('');
      setAddress('');
      setUserPackage('');
      setIspName('');
      setIspId('');
      setUserName('');
      setCnic('');
      setErrors({});
    } catch (error) {
      setSubmitError(error.message || 'Failed to create customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keep existing useEffect hooks...

  return (
    <Box sx={{ backgroundColor: '#f4f6fd', padding: 4, borderRadius: 2, maxWidth: "auto" }}>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="h5" sx={{ mb: 3, color: colors.primary }}>
          Create New Customer
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
                sx={TextFieldStyle}
                size="small"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
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
                onChange={(e) => handleFieldChange('address', e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                required
                sx={TextFieldStyle}
                size="small"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CNIC"
                name="CNIC"
                value={CNIC}
                onChange={handleCnicChange}
                error={!!errors.CNIC}
                helperText={errors.CNIC || 'Format: 12345-1234567-1'}
                required
                sx={TextFieldStyle}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={TextFieldStyle}
                size="small"
                error={!!errors.isp}
              >
                <InputLabel>ISP</InputLabel>
                <Select
                  label="ISP Name"
                  value={allIsps.find((isp) => isp.name === ispName) || ''} // Set the value based on the selected object
                  onChange={(e) => {
                    const selectedIsp = e.target.value;
                    handleFieldChange('ispName', selectedIsp.name);
                    handleFieldChange('ispId', selectedIsp.id);
                  }}
                  renderValue={(selected) => (selected ? selected.name : '')} // Display only the name in the field
                >
                  {allIsps.map((isp) => (
                    <MenuItem key={isp.id} value={isp}>
                      {isp.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.isp && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.isp}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={TextFieldStyle}
                size="small"
                error={!!errors.userPackage}
              >
                <InputLabel>Package</InputLabel>
                <Select
                  label="Package"
                  value={userPackage}
                  onChange={(e) => handleFieldChange('userPackage', e.target.value)}
                >
                  {packages.map((pkg) => (
                    <MenuItem key={pkg.id} value={pkg.pkgName}>
                      {pkg.pkgName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.userPackage && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.userPackage}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="User Name"
                name="userName"
                value={userName}
                onChange={(e) => handleFieldChange('userName', e.target.value)}
                error={!!errors.userName}
                helperText={errors.userName}
                required
                sx={TextFieldStyle}
                size="small"
              />
            </Grid>
          </Grid>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <Button
              variant="contained"
              type="submit"
              style={{
                marginLeft: '10px',
                marginTop: 30,
                backgroundColor: colors.primary,
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Customer'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box >
  );
}

export default AddCustomer;