import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Avatar,
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

    useEffect(() => {
        const loadISPs = async () => {
            try {
                await dispatch(fetchISPs());
            } catch (error) {
                console.error('Error loading ISPs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadISPs();
    }, [dispatch]);

    const handleCreateISP = () => {
        navigate('/create-isp');
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
        <Box sx={{ pl: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: "flex-end", gap: 2, mt: 1 }}>
                <Button
                    variant="contained"
                    onClick={handleCreateISP}
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
        </Box>
    );
};

export default ISP;