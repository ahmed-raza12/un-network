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
          const success = dispatch(login({ email: user.email, uid: user.uid, role: userData.role, dealerId: userData.dealerId })); // Dispatch login action
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
        display: 'flex', // Flexbox for centering
        alignItems: 'center', // Center vertically
        justifyContent: 'center', // Center horizontally
        background: colors.gradientBackground, // Gradient background
        padding: '20px 20px', // Add padding for mobile
        height: '100vh', // Set height to cover the full viewport height
      }}
    >
     
      <Paper 
        elevation={3} 
        style={{ 
          padding: '20px', 
          width: '100%', // Full width
          maxWidth: '400px', // Set a max width for the Paper component
          boxSizing: 'border-box', // Ensure padding is included in width
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
          <img 
            src={require("../logo1.png")}
            alt="Logo"
            style={{ width: '30%', height: 'auto', maxWidth: '200px' }} // Responsive image
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
          <Typography variant="body2" align="center">
            Don't have an account? <a href="/register">Sign Up</a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
