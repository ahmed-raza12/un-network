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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { addISP } from '../store/actions/ispActions';
import colors from '../colors';
import { registerDealer } from '../store/actions/dealerActions';

export const TextFieldStyle = {
    label: {
        // color: colors.primary
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

const CreateDealer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const dealerId = useSelector((state) => state.auth.user.uid);
    // const dealerId = location.state?.dealerId;
    const [loading, setLoading] = useState(false);
    const { state } = location;
    // const selectedDealer = state;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        area: '',
        cnic: '',
        companyCode: '',
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
            console.log(formData);
            await dispatch(registerDealer(formData.email, formData.password, formData, dealerId));
            setSnackbar({
                open: true,
                message: 'Dealer created successfully',
                severity: 'success'
            });
            setTimeout(() => {
                // navigate('/dealer');
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
                    Create New Dealer
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="CNIC"
                                name="cnic"
                                value={formData.cnic}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                                InputLabelProps={{
                                    // style: { color: colors.primary },
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
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Company Code"
                                name="companyCode"
                                value={formData.companyCode}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                type="number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
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
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Area"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/dealers')}
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
                                    {loading ? <CircularProgress size={24} /> : 'Create Dealer'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default CreateDealer;