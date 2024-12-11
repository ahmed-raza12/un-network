import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase'; // Import Firestore
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/actions/authActions'; // Import login action
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Box,
  Alert,
} from '@mui/material';
import { ref, get } from 'firebase/database';
import bgImage from '../assets/bg_image.png';
import loginLogo from '../assets/login_logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyCode, setCompanyCode] = useState(''); // New state for company code
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn); // Get auth state from Redux

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      navigate('/'); // Redirect to dashboard if already authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const user = userCredential.user;
      const userId = user.uid; // Get the user's UID

      // Validate company code
      const userRef = ref(db, `users/${userId}`); // Reference to the user's data in Realtime Database
      const userSnapshot = await get(userRef); // Get the user data
      console.log(userSnapshot.val(), userSnapshot.val().companyCode !== companyCode, companyCode, 'userSnapshot'); // Log the entire snapshot value
      if (!userSnapshot.exists() || userSnapshot.val().companyCode !== companyCode) {
        setError('Invalid company code');
        return;
      }

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val(); // Get the user data
        const success = dispatch(login(userData)); // Dispatch login action
        if (success) {
          navigate('/'); // Redirect to dashboard on successful login
        }
      } else {
        setError('User data not found');
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth={false}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '20px 60px',
        height: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
     
      <Paper 
        elevation={3} 
        style={{ 
          padding: '20px', 
          width: '100%',
          maxWidth: '400px',
          boxSizing: 'border-box',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" mb={0}>
          <img 
            src={loginLogo}
            alt="Logo"
            style={{ height: 'auto', maxWidth: '300px' }} // Responsive image
          />
        </Box>
        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={error === 'Invalid email or password'}
                // helperText={error === 'Invalid email or password' ? error : ''}
                variant="outlined"
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={error === 'Invalid email or password'}
                // helperText={error === 'Invalid email or password' ? error : ''}
                variant="outlined"
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={error === 'Invalid company code'}
                helperText={error === 'Invalid company code' ? error : ''}
                variant="outlined"
                fullWidth
                type="number"
                label="Company Code"
                value={companyCode}
                onChange={(e) => { setCompanyCode(Number(e.target.value)); setError(''); }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && <Alert style={{ marginTop: 20, marginBottom: 20 }} severity="error">{error}</Alert>}
      </Paper>
    </Container>
  );
};

export default Login;
