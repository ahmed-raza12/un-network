import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';

const NotAuthorized = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <Container 
            component="main" 
            maxWidth="xs" 
            style={{
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexDirection: 'column',
                background: colors.gradientBackground, // Gradient background
                color: '#fff', // White text color
                textAlign: 'center',
                padding: '20px',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Access Denied
            </Typography>
            <Typography variant="h6" gutterBottom>
                You do not have permission to view this page.
            </Typography>
            <Typography variant="body1" gutterBottom>
                Please contact your administrator if you believe this is an error.
            </Typography>
        </Container>
    );
};

export default NotAuthorized;
