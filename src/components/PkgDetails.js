import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Card,
    CardContent,
    Snackbar,
    Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { updatePackage, deletePackage } from '../store/actions/packageActions';
import colors from '../colors';
import { useLocation, useNavigate } from 'react-router-dom';

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
    backgroundColor: 'white',
    marginBottom: 2
};

const PkgDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pkg } = location.state || {};
    const dispatch = useDispatch();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editedPkg, setEditedPkg] = useState(pkg);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        setEditedPkg(pkg);
    }, [pkg]);

    const validate = () => {
        const newErrors = {};

        if (!editedPkg.pkgName || !editedPkg.pkgName.trim()) {
            newErrors.pkgName = 'Package name is required.';
        }

        if (!editedPkg.salePrice || editedPkg.salePrice <= 0) {
            newErrors.salePrice = 'Sale price must be a positive number.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEditClick = () => {
        setEditDialogOpen(true);
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setEditedPkg(pkg);
        setErrors({});
    };

    const handleDeleteClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleEditSave = async () => {
        if (!validate()) {
            setSnackbar({
                open: true,
                message: 'Please correct the errors in the form.',
                severity: 'error'
            });
            return;
        }

        setLoading(true);
        try {
            await dispatch(updatePackage(pkg.id, pkg.ispId, editedPkg));
            setSnackbar({
                open: true,
                message: 'Package updated successfully',
                severity: 'success'
            });
            setEditDialogOpen(false);
            navigate(-1);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error updating package: ' + error.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await dispatch(deletePackage(pkg.id, pkg.ispId));
            setSnackbar({
                open: true,
                message: 'Package deleted successfully',
                severity: 'success'
            });
            setDeleteDialogOpen(false);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error deleting package: ' + error.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setEditedPkg({
            ...editedPkg,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <Card sx={{ mb: 2, backgroundColor: 'white' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" color={colors.primary}>
                                {pkg.pkgName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sale Price: ${pkg.salePrice}
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={handleEditClick} sx={{ color: colors.primary }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={handleDeleteClick} sx={{ color: colors.error }}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditClose}>
                <DialogTitle sx={{ color: colors.primary }}>Edit Package</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Package Name"
                            name="pkgName"
                            value={editedPkg.pkgName}
                            onChange={handleChange}
                            error={!!errors.pkgName}
                            helperText={errors.pkgName}
                            sx={TextFieldStyle}
                        />
                        <TextField
                            fullWidth
                            label="Sale Price"
                            name="salePrice"
                            type="number"
                            value={editedPkg.salePrice}
                            onChange={handleChange}
                            error={!!errors.salePrice}
                            helperText={errors.salePrice}
                            sx={TextFieldStyle}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} sx={{ color: colors.primary }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditSave}
                        variant="contained"
                        disabled={loading}
                        sx={{
                            bgcolor: colors.primary,
                            '&:hover': { bgcolor: colors.secondary }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
                <DialogTitle>Delete Package</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the package "{pkg.pkgName}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} sx={{ color: colors.primary }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
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
        </>
    );
};

export default PkgDetails;
