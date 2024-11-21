import React, { useEffect } from 'react';
import { Box, Paper, Typography, Avatar, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, fetchStaffByDealerId } from '../store/actions/staffActions'; // Import the fetchStaff action



const ISP = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const staff = useSelector((state) => state.staff.staff); // Get staff from Redux state
    const dealeruId = useSelector((state) => state.dealers.uid); // Get staff from Redux state
    const allDealers = useSelector((state) => state.dealers.dealers);
    const role = useSelector((state) => state.auth.user.role); // Get user role from Redux state
    const ispNames = [
        'Airtel',
        'Jio',
        'Bsnl',
        'Idea',
        'Vodafone',
        'Tikona',
        'Excitel',
        'ACT',
        'Hathway',
        'Spectra',
        'Atria'
    ];
    
    useEffect(() => {
        if (role === 'admin') {
            dispatch(fetchStaffByDealerId(dealeruId)); // Fetch staff by dealer uid when component mounts
        } else {
            dispatch(fetchStaff()); // Fetch staff when component mounts
        }
    }, [dispatch]);

    const handleStaffClick = (staffMember, id) => {
        navigate(`/isp-details/${staffMember}`, { state: staffMember }); // Pass staff member data
    };

    return (
        <Box sx={{ pl: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: "flex-end", gap: 2, mt: 1 }}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/create-isp')}
                    sx={{
                        '&:hover': { bgcolor: colors.secondary },
                        borderRadius: 6,
                        backgroundColor: colors.primary
                    }}
                >
                    Create ISP
                </Button>
            </Box>
            <Grid container spacing={2} mt={2}>
                {ispNames.map((staffMember, id) => (
                    <Grid item xs={12} sm={6} md={4} key={id}>
                        <Paper 
                            elevation={3} 
                            sx={{ display: 'flex', borderRadius: 5, flexDirection: 'column', alignItems: 'center', padding: 4, mb: 2, cursor: 'pointer' }} 
                            onClick={() => handleStaffClick(staffMember, id)} // Pass the entire staff member object
                        >
                            <Avatar
                                sx={{ width: 120, height: 120, mb: 2 }}
                                alt={staffMember}
                                src={staffMember}
                            />
                            <Typography variant="h5" color={colors.primary} sx={{ mb: 1 }}>
                                {staffMember}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ISP;