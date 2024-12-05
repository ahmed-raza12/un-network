import React, { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Grid,
    CircularProgress
} from '@mui/material';
import { green } from '@mui/material/colors';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { addISP } from '../store/actions/ispActions';
import colors from '../colors';


export const TextFieldStyle = {
    label: {
        color: colors.primary
    },
    floatingLabel: {
        color: colors.primary
    },
    '& .MuiSelect-select:focus': {
        backgroundColor: 'transparent',
    },
    '& .MuiFormLabel-root.Mui-focused': {
        color: colors.primary,
    },

    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#E0E3E7',
        },
        '&:hover fieldset': {
            borderColor: colors.primary,
        },
        '&.Mui-focused fieldset': {
            borderColor: colors.primary,
        },
    },
    backgroundColor: 'white'
};

const CreateISP = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const dealerId = location.state?.dealerId;
    const [loading, setLoading] = useState(false);
    const { state } = location;
    const selectedDealer = state;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        package: '',
        status: 'Active'
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dealerId = state?.selectedDealer;
            await dispatch(addISP(formData, dealerId));
            setSnackbar({
                open: true,
                message: 'ISP created successfully',
                severity: 'success'
            });
            setTimeout(() => {
                navigate('/isp');
            }, 1500);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error creating ISP: ' + error.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
                <Typography variant="h5" sx={{ mb: 3, color: colors.primary }}>
                    Create New ISP
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="ISP Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                                InputLabelProps={{
                                    style: { color: colors.primary },
                                  }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Package"
                                name="package"
                                value={formData.package}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                                InputLabelProps={{
                                    style: { color: colors.primary },
                                  }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                                InputLabelProps={{
                                    style: { color: colors.primary },
                                  }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                                InputLabelProps={{
                                    style: { color: colors.primary },
                                  }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                                InputLabelProps={{
                                    style: { color: colors.primary },
                                  }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                                InputLabelProps={{
                                    style: { color: colors.primary },
                                  }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                                InputLabelProps={{
                                    style: { color: colors.primary },
                                  }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/isp')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        background: colors.gradientBackground,
                                        '&:hover': { background: colors.gradientBackground }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Create ISP'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default CreateISP;