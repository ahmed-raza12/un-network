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
import colors from '../colors';
import { ref, get } from 'firebase/database';
import bgImage from '../assets/bg_image.png';
import loginLogo from '../assets/login_logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const userRef = ref(db, "users/" + userId); // Reference to the user's data in Realtime Database
      const snapshot = await get(userRef); // Get the user data
      console.log(snapshot.val())
      if (snapshot.exists()) {
          const userData = snapshot.val(); // Get the user data
          const success = dispatch(login({ email: user.email, uid: user.uid, role: userData.role, dealerId: userData.dealerId, userData: userData.userData })); // Dispatch login action
          console.log("User data:", userData);
          if (success) {
            navigate('/'); // Redirect to dashboard on successful login
          }      
          // You can now store this data in your Redux store or context
      } else {
          console.log("No such user document!");
      }
    } catch (err) {
      setError(err.message);
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
                variant="outlined"
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
        <Box mt={2}>
          {/* <Typography variant="body2" align="center">
            Don't have an account? <a href="/register">Sign Up</a>
          </Typography> */}
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
