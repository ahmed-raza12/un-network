import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Grid,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPackage } from '../store/actions/packageActions';
import colors from '../colors';

const TextFieldStyle = {
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

export default function CreatePkg() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { ispId } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        pkgName: '',
        salePrice: '',
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
            await dispatch(addPackage(formData, ispId));
            setSnackbar({
                open: true,
                message: 'Package created successfully',
                severity: 'success'
            });
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error creating package: ' + error.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f4f6fd', padding: 4, minHeight: '100vh' }}>
            <Box sx={{ maxWidth: 600, margin: 'auto', backgroundColor: 'white', padding: 4, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ mb: 4, color: colors.primary }}>
                    Create New Package
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Package Name"
                                name="pkgName"
                                value={formData.pkgName}
                                onChange={handleChange}
                                required
                                sx={TextFieldStyle}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Sale Price"
                                name="salePrice"
                                type="number"
                                value={formData.salePrice}
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
                                    onClick={() => navigate(-1)}
                                    sx={{
                                        borderColor: colors.primary,
                                        color: colors.primary,
                                        '&:hover': {
                                            borderColor: colors.secondary,
                                            color: colors.secondary,
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        bgcolor: colors.primary,
                                        '&:hover': { bgcolor: colors.secondary }
                                    }}
                                >
                                    Create Package
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}