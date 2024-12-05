import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchISPs } from '../store/actions/ispActions';
import colors from '../colors';

const ISP = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const isps = useSelector(state => state.isp.isps);
    const error = useSelector(state => state.isp.error);
    const role = useSelector(state => state.auth.user.role);
    const [selectedDealer, setSelectedDealer] = useState(() => {
        const savedDealer = localStorage.getItem('selectedIsp');
        return savedDealer || '';
    });
    const allDealers = useSelector(state => state.dealers.dealers);
    const isLoading = useSelector((state) => state.dealers.isLoading);


    // Effect to persist selected dealer
    useEffect(() => {
        if (selectedDealer) {
            localStorage.setItem('selectedIsp', selectedDealer);
        }
    }, [selectedDealer]);

    const handleDealerChange = (event) => {
        setSelectedDealer(event.target.value);
    };
    useEffect(() => {
        const loadISPs = async () => {
            try {
                // If admin and dealer selected, fetch that dealer's ISPs
                if (role === 'admin' && selectedDealer) {
                    await dispatch(fetchISPs(selectedDealer));
                } else {
                    // Otherwise fetch ISPs for current user
                    await dispatch(fetchISPs());
                }
            } catch (error) {
                console.error('Error loading ISPs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadISPs();
    }, [dispatch, selectedDealer, role]);

    const handleCreateISP = () => {
        if (role === 'admin' && !selectedDealer) {
            // Show error message if admin hasn't selected a dealer
            alert('Please select a dealer first');
            return;
        }
        navigate('/create-isp', { 
            state: { 
                selectedDealer: role === 'admin' ? selectedDealer : null 
            } 
        });
    };

    const handleISPClick = (isp) => {
        navigate(`/isp-details/${isp.id}`, { state: isp });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ pl: 2, minHeight: '100vh' }}>
            <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: "flex-end", gap: 2, mt: 1, }}>
                <Button
                    variant="contained"
                    onClick={handleCreateISP}
                    sx={{
                        background: colors.gradientBackground,
                        '&:hover': { background: colors.gradientBackground }
                    }}
                >
                    Create ISP
                </Button>
            </Box> 
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
            <Grid container spacing={2} mt={2}>
                {isps.map((isp) => (
                    <Grid item xs={12} sm={6} md={4} key={isp.id}>
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
                            onClick={() => handleISPClick(isp)}
                        >
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mb: 2,
                                    bgcolor: colors.primary,
                                    fontSize: '2.5rem'
                                }}
                            >
                                {isp.name ? isp.name.charAt(0).toUpperCase() : 'I'}
                            </Avatar>
                            <Typography variant="h5" color={colors.primary} sx={{ mb: 1 }}>
                                {isp.name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                {isp.email}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {isp.city}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
                {isps.length === 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" color="textSecondary">
                            No ISPs found
                        </Typography>
                    </Grid>
                )}
            </Grid>
            </Paper>
        </Box>
    );
};

export default ISP;