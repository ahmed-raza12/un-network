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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addISP } from '../store/actions/ispActions';
import colors from '../colors';

export const TextFieldStyle = {
    backgroundColor: 'white',
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            // borderColor: 'white',
        },
        '&:hover fieldset': {
            // borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'lightgray',
            borderWidth: 1,
        },
    },
};

const CreateISP = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
            await dispatch(addISP(formData));
            navigate('/isp');
        } catch (error) {
            console.error('Error creating ISP:', error);
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
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
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
                                label="Phone"
                                name="phone"
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
                                label="Package"
                                name="package"
                                value={formData.package}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
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