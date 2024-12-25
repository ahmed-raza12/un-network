import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, fetchStaffByDealerId } from '../store/actions/staffActions';
import { fetchDealers } from '../store/actions/dealerActions';

const StaffList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const staff = useSelector((state) => state.staff.staff);
    const staffError = useSelector((state) => state.staff.error);
    const dealeruId = useSelector((state) => state.dealers.uid);
    const allDealers = useSelector((state) => state.dealers.dealers);
    const role = useSelector((state) => state.auth.user.role);
    const [companyCode, setCompanyCode] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const [isLoading, setIsLoading] = useState(false);
    // State for selected dealer
    const [selectedDealer, setSelectedDealer] = useState(() => {
        const savedDealer = localStorage.getItem('selectedDealerStaff');
        return savedDealer || dealeruId;
    });
    console.log(user, 'uuuuussssssser')
    // State for loading
    useEffect(() => {
        const localDealers = localStorage.getItem('dealers');
        if (localDealers) {
            dispatch({
                type: 'FETCH_DEALERS_SUCCESS',
                payload: JSON.parse(localDealers),
            });
        } else {
            console.log('Fetching dealers from Firebase');
            dispatch(fetchDealers());
        }
    }, [dispatch]);
    // Effect to persist selected dealer
    useEffect(() => {
        if (role === 'admin') {
            if (selectedDealer) {
                setCompanyCode(allDealers.find(dealer => dealer.uid === selectedDealer).companyCode);
                console.log('Selected Dealer:', allDealers.find(dealer => dealer.uid === selectedDealer));
                localStorage.setItem('selectedDealerStaff', selectedDealer);
            }
        } else {
            setCompanyCode(user.companyCode);
            console.log('companyCode:', user.companyCode);
        }
    }, [selectedDealer, user]);

    // Effect to fetch staff data
    useEffect(() => {
        const fetchStaffData = async () => {
            setIsLoading(true);
            try {
                if (role === 'admin') {
                    await dispatch(fetchStaffByDealerId(selectedDealer));
                } else {
                    console.log('Fetching staff for current user');
                    await dispatch(fetchStaff());
                }
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
            setIsLoading(false);
        };

        fetchStaffData();
    }, [dispatch, role, selectedDealer]);

    const handleStaffClick = (staffMember) => {
        console.log(staffMember, 'staffMember');
        navigate(`/staff-profile/${staffMember.id}`, { state: { ...staffMember, dealerId: staffMember.dealerId, companyCode, length: staff.length } });
    };

    const handleDealerChange = (event) => {
        setSelectedDealer(event.target.value);
    };

    return (
        <Box sx={{ width: '100%', p: 3, minHeight: '100vh' }}>
            <Paper sx={{
                width: '100%', mb: 2, p: 2, backgroundColor: "#fff", boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
            }}>
                {role === 'admin' && (
                    <FormControl sx={{ minWidth: 200, mb: 2 }}>
                        <InputLabel>Select Dealer</InputLabel>
                        <Select
                            value={selectedDealer || ''}
                            onChange={handleDealerChange}
                            label="Select Dealer"
                            disabled={isLoading}
                        >
                            {allDealers?.map((dealer) => (
                                <MenuItem key={dealer.uid} value={dealer.uid}>
                                    {dealer.dealerName || dealer.email}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <Grid item xs={12}>
                    {staff.length < 10 && (
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={() => navigate('/create-staff', { state: { dealerId: selectedDealer, companyCode, length: staff.length } })}
                            sx={{
                                background: colors.gradientBackground,
                                '&:hover': { background: colors.gradientBackground }
                            }}
                        >
                            {'Create Staff'}
                        </Button>
                    </Box>
                    )}
                </Grid>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3} mt={2}>
                        {staff.map((staffMember) => (
                            <Grid item xs={12} sm={6} md={4} key={staffMember.id}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        display: 'flex',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: 4,
                                        mb: 2,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            transition: 'transform 0.2s ease-in-out'
                                        }
                                    }}
                                    onClick={() => handleStaffClick(staffMember)}
                                >   <Avatar
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        mb: 2,
                                        bgcolor: colors.primary,
                                        fontSize: '2.5rem'
                                    }}
                                >
                                        {staffMember.name ? staffMember.name.charAt(0).toUpperCase() : 'I'}

                                    </Avatar>
                                    <Typography variant="h5" sx={{ mb: 1 }}>
                                        {staffMember.name}
                                    </Typography>
                                    <Typography variant="body1" color="primary" sx={{ mb: 1 }}>
                                        {staffMember.phone}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {staffMember.designation}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Box>
    );
};

export default StaffList;