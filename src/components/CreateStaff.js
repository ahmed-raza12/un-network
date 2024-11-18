import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../colors';
import { addStaff } from '../store/actions/staffActions'; // Import your action for adding staff

function CreateStaff() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [designation, setDesignation] = useState('');
  const dealerId = useSelector((state) => state.auth.user.uid)
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const staffData = {
      firstName,
      lastName,
      phone,
      email,
      password,
      address,
      designation,
      role: "staff"
    };

    dispatch(addStaff(email, password, staffData, dealerId)); // Dispatch action to add staff
    // localStorage.setItem('staffData', JSON.stringify(staffData)); // Optionally save to local storage
  };

  return (
    <Box mt={80} sx={{ backgroundColor: '#f4f6fd', padding: 4, borderRadius: 2, maxWidth: "auto", margin: 'auto' }}>
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>First Name</Typography>
          <TextField
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
            placeholder="03001234567"
            fullWidth
            variant="outlined"
            size="small"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>Username</Typography>
          <TextField
            placeholder="Email"
            fullWidth
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>Password</Typography>
          <TextField
            type="password"
            placeholder="Password"
            fullWidth
            variant="outlined"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>Address</Typography>
          <TextField
            placeholder="House No."
            fullWidth
            variant="outlined"
            size="small"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography sx={{ color: colors.primary }}>Designation</Typography>
          <TextField
            placeholder="Designation"
            fullWidth
            variant="outlined"
            size="small"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </Grid>
      </Grid>
      <Box display="flex" alignItems="center" mb={2}>
        <Button
          variant="contained"
          //   color="primary"
          onClick={handleSubmit}
          style={{ marginLeft: '10px', marginTop: 30, backgroundColor: colors.primary }}
        >
          Create Profile
        </Button>
      </Box>
    </Box>
  );
}

export default CreateStaff; 