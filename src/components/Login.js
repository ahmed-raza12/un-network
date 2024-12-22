import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/actions/authActions';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ref, get } from 'firebase/database';
import bgImage from '../assets/bg_image.png';
import loginLogo from '../assets/login_logo.png';
import { TextFieldStyle } from '../stylings';
import colors from '../colors';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect to dashboard if authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setLoading(true); // Start loading
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      // Validate company code
      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);

      if (!userSnapshot.exists() || userSnapshot.val().companyCode !== companyCode) {
        setError('Invalid company code');
        setLoading(false);
        return;
      }

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const success = dispatch(login(userData));
        if (success) {
          navigate('/');
        }
      } else {
        setError('User data not found');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    } finally {
      setLoading(false); // Stop loading
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
            style={{ height: 'auto', maxWidth: '300px' }}
          />
        </Box>
        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={error === 'Invalid email or password'}
                variant="outlined"
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                type="email"
                required
                sx={TextFieldStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={error === 'Invalid email or password'}
                variant="outlined"
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
                sx={TextFieldStyle}
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
                onChange={(e) => {
                  setCompanyCode(Number(e.target.value));
                  setError('');
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: colors.gradientBackground,
                  '&:hover': { background: colors.gradientBackground },
                  color: 'white',
                  marginTop: 2,
                  mb: 2,

                }}
                fullWidth
                disabled={loading} // Disable button while loading
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && (
          <Alert style={{ marginTop: 20, marginBottom: 20 }} severity="error">
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
