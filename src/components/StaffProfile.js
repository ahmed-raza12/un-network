import React, { useState } from 'react';
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
import { updateStaff, deleteStaff } from '../store/actions/staffActions';

const StaffProfile = () => {
    const [value, setValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStaff, setEditedStaff] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const role = useSelector((state) => state.auth.user.role);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const staffMember = location.state;

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedStaff({ ...staffMember });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedStaff(null);
        setNewPassword("");
        setPasswordError("");
    };

    const handleSaveEdit = async () => {
        if (newPassword) {
            await handlePasswordChange();
        }
        await dispatch(updateStaff(editedStaff));
        setIsEditing(false);
        navigate(-1); // Navigate back after saving
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
            // For now, we'll just update the staff member's data
            const updatedStaff = {
                ...editedStaff,
                password: newPassword // Note: In production, never store plain text passwords
            };

            await dispatch(updateStaff(updatedStaff));
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
            await dispatch(deleteStaff(staffMember.id, staffMember.uid, staffMember.dealerId));
            setOpenDeleteDialog(false);
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
        <Container maxWidth="md" sx={{ minHeight: '100vh', }}>
            <Box sx={{ display: 'flex', gap: 20, p: 4 }}>
                {/* Left Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                    <Avatar
                        sx={{ width: 150, height: 150, mb: 2 }}
                        alt="Staff Photo"
                        src={staffMember.name}
                    />
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        {staffMember.name}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ mb: 1 }}>
                        {staffMember.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {staffMember.designation}
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
                                        secondary={staffMember.name}
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
                                        secondary={staffMember.phone}
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
                                        label="Designation"
                                        value={editedStaff.designation}
                                        onChange={handleInputChange('designation')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Designation"
                                        secondary={staffMember.designation}
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
                                        label="Address"
                                        value={editedStaff.address}
                                        onChange={handleInputChange('address')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Address"
                                        secondary={staffMember.address}
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
                                        label="Email"
                                        disabled
                                        value={editedStaff.email}
                                        onChange={handleInputChange('email')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Email"
                                        secondary={staffMember.email}
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
                                        label="Company Code"
                                        type="number"
                                        disabled={role === 'admin' ? false : true}
                                        value={editedStaff.companyCode}
                                        onChange={handleInputChange('companyCode')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Company Code"
                                        secondary={staffMember.companyCode}
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

export default StaffProfile;