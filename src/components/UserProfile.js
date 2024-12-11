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
    TextField,
    Paper,
    useMediaQuery,
    Grid,
    Divider
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    Badge,
    Edit,
    Save,
    Cancel,
    Business
} from '@mui/icons-material';
import { useTheme } from '@mui/system';
import colors from '../colors';
import { updatePassword, getAuth, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/actions/authActions';

const UserProfile = () => {
    const user = useSelector((state) => state.auth.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedUser({ ...user });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedUser(null);
    };

    const handleSaveEdit = () => {
        if (currentPassword || newPassword) {
            handlePasswordChange();
        } else {
            dispatch(updateProfile(editedUser));
            setIsEditing(false);
        }
    };

    const handleInputChange = (field) => (event) => {
        setEditedUser({ ...editedUser, [field]: event.target.value });
    };

    const handlePasswordChange = async () => {
        const auth = getAuth();
        const user = auth.currentUser; // Get Firebase user

        if (!user) {
            console.error("User is not authenticated.");
            return;
        }

        try {
            // Reauthenticate the user
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            updatePassword(user, newPassword);
            alert("Password updated successfully!");
            setIsEditing(false);
            dispatch(updateProfile(editedUser));
            setPasswordError("");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.error("Error updating password:", error);
            setPasswordError(error.message);
        }
    };

    console.log(user.role === 'admin' ? user.name : user.name)
    return (
        <Container maxWidth="md" sx={{ px: isMobile ? 2 : 4, py: 4 }}>
            <Box>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Grid container spacing={isMobile ? 2 : 4} alignItems="center">
                        <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                            <Avatar
                                sx={{
                                    width: isMobile ? 80 : 100,
                                    height: isMobile ? 80 : 100,
                                    bgcolor: colors.primary,
                                    fontSize: isMobile ? '2rem' : '2.5rem',
                                }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant={isMobile ? "h5" : "h4"} sx={{ mb: 1 }}>
                                {user.name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3} textAlign={isMobile ? "center" : "right"}>
                            {!isEditing ? (
                                <Button
                                    variant="contained"
                                    startIcon={<Edit />}
                                    onClick={handleEditClick}
                                    sx={{
                                        bgcolor: colors.primary,
                                        '&:hover': { bgcolor: colors.secondary }
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Box sx={{ display: 'flex', justifyContent: isMobile ? "center" : "flex-end", gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<Save />}
                                        onClick={handleSaveEdit}
                                        sx={{
                                            bgcolor: colors.primary,
                                            '&:hover': { bgcolor: colors.secondary }
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Cancel />}
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Profile Information */}
                    <List>
                        <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                            <ListItem>
                                <ListItemIcon>
                                    <Person sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                {isEditing ? (
                                    <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            value={editedUser.name}
                                            onChange={handleInputChange('name')}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Box>
                                ) : (
                                    <ListItemText
                                        primary="Name"
                                        secondary={user.name}
                                        secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                    />
                                )}
                            </ListItem>
                        </Grid>

                        <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                            <ListItem>

                                <ListItemIcon>
                                    <Email sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={editedUser.email}
                                        disabled
                                        onChange={handleInputChange('email')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Email"
                                        secondary={user.email}
                                        secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                    />
                                )}
                            </ListItem>
                        </Grid>
                        <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                            <ListItem>

                                <ListItemIcon>
                                    <Phone sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={editedUser.phone}
                                        onChange={handleInputChange('phone')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Phone"
                                        secondary={user.phone}
                                        secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                    />
                                )}
                            </ListItem>
                        </Grid>
                        <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                            <ListItem>

                                <ListItemIcon>
                                    <Phone sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        value={editedUser.address}
                                        onChange={handleInputChange('address')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Address"
                                        secondary={user.address}
                                        secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                    />
                                )}
                            </ListItem>
                        </Grid>
                        <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                            <ListItem>

                                <ListItemIcon>
                                    <Phone sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                {isEditing && (
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            </ListItem>
                        </Grid>
                        <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                            <ListItem>

                                <ListItemIcon>
                                    <Phone sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                {isEditing && (
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            </ListItem>
                        </Grid>
                        {user.role === 'staff' && (
                            <>
                                <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                                    <ListItem>

                                        <ListItemIcon>
                                            <Badge sx={{ color: colors.primary }} />
                                        </ListItemIcon>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                label="Designation"
                                                value={editedUser.designation}
                                                onChange={handleInputChange('designation')}
                                                variant="outlined"
                                                size="small"
                                            />
                                        ) : (
                                            <ListItemText
                                                primary="Designation"
                                                secondary={user.designation}
                                                secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                            />
                                        )}
                                    </ListItem>
                                </Grid>
                            </>
                        )}

                        {user.role === 'dealer' && (
                            <>
                                <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                                    <ListItem>
                                        <ListItemIcon>
                                            <Business sx={{ color: colors.primary }} />
                                        </ListItemIcon>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                label="Company Code"
                                                value={editedUser.companyCode}
                                                onChange={handleInputChange('companyCode')}
                                                variant="outlined"
                                                size="small"
                                            />
                                        ) : (
                                            <ListItemText
                                                primary="Company Code"
                                                secondary={user.companyCode}
                                                secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                            />
                                        )}
                                    </ListItem>
                                </Grid>
                            </>
                        )}
                    </List>
                    {passwordError && (
                        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                            {"Your password is incorrect. Please try again."}
                        </Typography>
                    )}
                </Paper>
            </Box>
        </Container >
    );
};

export default UserProfile;
