import React, { useEffect } from 'react';
import { Box, Paper, Typography, Avatar, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, fetchStaffByDealerId } from '../store/actions/staffActions'; // Import the fetchStaff action

const StaffList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const staff = useSelector((state) => state.staff.staff); // Get staff from Redux state
    const dealeruId = useSelector((state) => state.dealers.uid); // Get staff from Redux state
    const allDealers = useSelector((state) => state.dealers.dealers);
    const role = useSelector((state) => state.auth.user.role); // Get user role from Redux state
    useEffect(() => {
        if (role === 'admin') {
            dispatch(fetchStaffByDealerId(dealeruId)); // Fetch staff by dealer uid when component mounts
        } else {
            dispatch(fetchStaff()); // Fetch staff when component mounts
        }
    }, [dispatch]);

    const handleStaffClick = (staffMember) => {
        navigate(`/staff-profile/${staffMember.id}`, { state: staffMember }); // Pass staff member data
    };

    return (
        <Box sx={{ pl: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: "flex-end", gap: 2, mt: 1 }}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/create-staff')}
                    sx={{
                        '&:hover': { bgcolor: colors.secondary },
                        borderRadius: 6,
                        backgroundColor: colors.primary
                    }}
                >
                    Create Staff
                </Button>
            </Box>
            {
                role === 'admin' && (
                <FormControl sx={{ m: 1, width: '90%' }}>
                    <InputLabel fullyWidth id="dealer-select-label">Dealer</InputLabel>
                    <Select
                        labelId="dealer-select-label"
                        id="dealer-select"
                        fullWidth
                        value={dealeruId}
                        label="Dealer"
                        onChange={(e) => dispatch(fetchStaffByDealerId(e.target.value))}
                    >
                        {allDealers.map((dealer) => (
                            <MenuItem key={dealer.uid} value={dealer.uid}>
                                {dealer.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                )
            }
            <Grid container spacing={2} mt={2}>
                {staff.map((staffMember) => (
                    <Grid item xs={12} sm={6} md={4} key={staffMember.id}>
                        <Paper 
                            elevation={3} 
                            sx={{ display: 'flex', borderRadius: 5, flexDirection: 'column', alignItems: 'center', padding: 2, cursor: 'pointer' }} 
                            onClick={() => handleStaffClick(staffMember)} // Pass the entire staff member object
                        >
                            <Avatar
                                sx={{ width: 150, height: 150, mb: 2 }}
                                alt={staffMember.name}
                                src={staffMember.lastName}
                            />
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                {staffMember.firstName} {staffMember.lastName}
                            </Typography>
                            <Typography variant="body1" color="primary" sx={{ mb: 1 }}>
                                {staffMember.phone}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {staffMember.designation}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3 }}>
                                Cash: {staffMember.cash}
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    bgcolor: 'darkblue',
                                    '&:hover': { bgcolor: colors.secondary },
                                    borderRadius: '25px',
                                    backgroundColor: colors.primary
                                }}
                            >
                                Update Staff
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default StaffList;