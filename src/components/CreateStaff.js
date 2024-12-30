import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Paper, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../colors';
import { addStaff } from '../store/actions/staffActions';
import { useLocation } from 'react-router-dom';

export const TextFieldStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: colors.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary,
    },
  },
  backgroundColor: 'white'
};

function CreateStaff() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [designation, setDesignation] = useState('');
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const dealerPhone = useSelector((state) => state.auth.user.dealerPhone);
  const dealerPhone2 = useSelector((state) => state.auth.user.dealerPhone2);
  const role = useSelector((state) => state.auth.user.role);
  const dealerId = useSelector((state) => state.auth.user.uid);
  const selectedDealerId = role === 'admin' ? localStorage.getItem('selectedDealerStaff') : dealerId;
  const dispatch = useDispatch();
  const location = useLocation();
  const staff = location.state;

  const validate = () => {
    let tempErrors = {};
    if (!name) tempErrors.name = 'Name is required';
    if (!phone) tempErrors.phone = 'Phone number is required';
    if (!email) tempErrors.email = 'Email is required';
    if (!password) tempErrors.password = 'Password is required';
    if (!confirmPassword) tempErrors.confirmPassword = 'Confirm Password is required';
    if (password && confirmPassword && password !== confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    if (!address) tempErrors.address = 'Address is required';
    if (!designation) tempErrors.designation = 'Designation is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    if (role === 'admin' && !selectedDealerId) {
      setSnackbar({ open: true, message: 'Please select a dealer first', severity: 'error' });
      return;
    }

    const staffData = {
      name,
      phone,
      email,
      password,
      address,
      designation,
      dealerId,
      dealerPhone,
      dealerPhone2,
      companyCode: staff?.companyCode,
      role: 'staff',
    };

    dispatch(addStaff(email, password, staffData))
      .then(() => {
        setSnackbar({ open: true, message: 'Staff created successfully!', severity: 'success' });
        setName('');
        setPhone('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAddress('');
        setDesignation('');
      })
      .catch((error) => {
        setSnackbar({ open: true, message: 'Error creating staff: ' + error.message, severity: 'error' });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box mt={80} sx={{ minHeight: "100vh", backgroundColor: '#f4f6fd', padding: 4, borderRadius: 2, maxWidth: "auto", margin: 'auto' }}>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="h5" sx={{ mb: 3, color: colors.primary }}>
          Create New Staff
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ mt: 2 }}>
            <TextField
              sx={TextFieldStyle}
              label="Name"
              fullWidth
              variant="outlined"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 2 }}>
            <TextField
              sx={TextFieldStyle}
              label="Phone Number"
              fullWidth
              variant="outlined"
              size="small"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 2 }}>
            <TextField
              sx={TextFieldStyle}
              label="Email"
              fullWidth
              variant="outlined"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 2 }}>
            <TextField
              sx={TextFieldStyle}
              type="password"
              label="Password"
              fullWidth
              variant="outlined"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 2 }}>
            <TextField
              sx={TextFieldStyle}
              type="password"
              label="Confirm Password"
              fullWidth
              variant="outlined"
              size="small"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 2 }}>
            <TextField
              sx={TextFieldStyle}
              label="Address"
              fullWidth
              variant="outlined"
              size="small"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 2 }}>
            <TextField
              sx={TextFieldStyle}
              label="Designation"
              fullWidth
              variant="outlined"
              size="small"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              error={!!errors.designation}
              helperText={errors.designation}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  background: colors.gradientBackground,
                  '&:hover': { background: colors.gradientBackground }
                }}
              >
                Create Staff
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CreateStaff;
