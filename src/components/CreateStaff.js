import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../colors';
import { addStaff } from '../store/actions/staffActions'; // Import your action for adding staff
// import { TextFieldStyle } from './CreateISP';
import { useLocation, useNavigate } from 'react-router-dom';


export const TextFieldStyle = {
  label: {
    // color: colors.primary
  },
  floatingLabel: {
    color: colors.primary
  },
  '& .MuiSelect-select:focus': {
    backgroundColor: 'transparent',
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: colors.primary,
  },

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
  const [address, setAddress] = useState('');
  const [designation, setDesignation] = useState('');
  const role = useSelector((state) => state.auth.user.role);
  const dealerId = useSelector((state) => state.auth.user.uid);
  const selectedDealerId = role === 'admin' ? localStorage.getItem('selectedDealerStaff') : dealerId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const staff = location.state;
  console.log(staff, 'staff');
  const handleSubmit = () => {
    console.log('Selected Dealer ID:', selectedDealerId);
    if (role === 'admin' && !selectedDealerId) {
      alert('Please select a dealer first');
      return;
    }

    const staffData = {
      name,
      phone,
      email,
      password,
      address,
      designation,
      companyCode: staff.companyCode,
      role: "staff"
    };

    dispatch(addStaff(email, password, staffData, selectedDealerId)); // Dispatch action to add staff
    // localStorage.setItem('staffData', JSON.stringify(staffData)); // Optionally save to local storage
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
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 2 }}>
            <TextField
              sx={TextFieldStyle}
              label="phone number"
              fullWidth
              variant="outlined"
              size="small"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
    </Box>
  );
}

export default CreateStaff;