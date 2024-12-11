import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Switch,
    Tabs,
    Tab,
    Paper,
    Link,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import {
    Phone,
    Person,
    Badge,
    Edit,
    Save,
    Cancel,
    Delete
} from '@mui/icons-material';
import colors from '../colors';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateDealer, deleteDealer } from '../store/actions/dealerActions';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";

const DealerProfile = () => {
    const [value, setValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStaff, setEditedStaff] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const role = useSelector((state) => state.auth.user.role);
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { dealer } = location.state;
    console.log(dealer, 'dealer');

    useEffect(() => {
        if (dealer) {
            setEditedStaff(dealer);
        }
    }, [dealer]);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedStaff({ ...dealer });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedStaff(dealer);
        setNewPassword("");
        setPasswordError("");
    };

    const handleSaveEdit = async () => {
        await dispatch(updateDealer(dealer.id, editedStaff));
        setIsEditing(false);
        // navigate(-1); 
    };

    const handleInputChange = (field) => (event) => {
        setEditedStaff({ ...editedStaff, [field]: event.target.value });
    };

    const handlePasswordChange = async () => {
        if (!newPassword) {
            setPasswordError("New password is required");
            return;
        }

        try {
            // Here we would call the backend endpoint to update the password
            // For now, we'll just update the dealer's data
            const updatedDealer = {
                ...editedStaff,
                password: newPassword // Note: In production, never store plain text passwords
            };

            await dispatch(updateDealer(dealer.id, updatedDealer));
            alert("Password updated successfully!");
            setPasswordError("");
            setNewPassword("");
        } catch (error) {
            console.error("Error updating password:", error);
            setPasswordError(error.message);
        }
    };

    const handleDeleteClick = () => {
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            // Wait for deletion and list update to complete
            await dispatch(deleteDealer(dealer.id, dealer.uid, dealer.dealerId));
            setOpenDeleteDialog(false);
            // Only navigate back after successful deletion
            navigate(-1);
        } catch (error) {
            console.error('Error deleting staff:', error);
            setOpenDeleteDialog(false);
        }
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', gap: 20, p: 4 }}>
                {/* Left Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                    <Avatar
                        sx={{ width: 150, height: 150, mb: 2 }}
                        alt="Staff Photo"
                        src={dealer.name}
                    />
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        {dealer.name}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ mb: 1 }}>
                        {dealer.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {dealer.phone}
                    </Typography>
                    {!isEditing ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={handleEditClick}
                                sx={{
                                    bgcolor: colors.primary,
                                    '&:hover': { bgcolor: colors.secondary },
                                    borderRadius: '25px'
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Delete />}
                                onClick={handleDeleteClick}
                                sx={{
                                    borderRadius: '25px'
                                }}
                            >
                                Delete
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSaveEdit}
                                sx={{
                                    bgcolor: colors.primary,
                                    '&:hover': { bgcolor: colors.secondary },
                                    borderRadius: '25px'
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Cancel />}
                                onClick={handleCancelEdit}
                                sx={{
                                    borderRadius: '25px'
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Right Section */}
                <Box sx={{ width: '70%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs
                            value={value}
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTab-root': {
                                    color: 'primary',
                                    '&.Mui-selected': { color: colors.primary }
                                },
                                '& .MuiTabs-indicator': { backgroundColor: colors.primary }
                            }}
                        >
                            <Tab label="Profile" />
                        </Tabs>
                    </Box>

                    <Paper elevation={5} sx={{ p: 3, borderRadius: 10, bgcolor: 'background.default' }}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <Person sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        value={editedStaff.name}
                                        onChange={handleInputChange('name')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Name"
                                        secondary={dealer.name}
                                        secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                    />
                                )}
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Phone sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={editedStaff.phone}
                                        onChange={handleInputChange('phone')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Phone"
                                        secondary={dealer.phone}
                                        secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                    />
                                )}
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Person sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={editedStaff.email}
                                        onChange={handleInputChange('email')}
                                        variant="outlined"
                                        disabled
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Email"
                                        secondary={dealer.email}
                                        secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                    />
                                )}
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Badge sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Company Code"
                                        disabled={role === 'admin' ? false : true}
                                        value={editedStaff.companyCode}
                                        onChange={handleInputChange('companyCode')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Company Code"
                                        secondary={dealer.companyCode}
                                        secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                    />
                                )}
                            </ListItem>

                        </List>
                    </Paper>
                </Box>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Delete Staff Member"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this staff member? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DealerProfile;