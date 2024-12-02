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
import colors from '../colors';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/actions/authActions';

const UserProfile = () => {
    const user = useSelector((state) => state.auth.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const dispatch = useDispatch();

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedUser({ ...user });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedUser(null);
    };

    const handleSaveEdit = () => {
        dispatch(updateProfile(editedUser));
        setIsEditing(false);
    };

    const handleInputChange = (field) => (event) => {
        setEditedUser({ ...editedUser, [field]: event.target.value });
    };
console.log(user.role === 'admin' ? user.name : user.name)
    return (
        <Container maxWidth="md">
            <Box sx={{ p: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    {/* Profile Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: colors.primary,
                                fontSize: '2.5rem',
                                mr: 3
                            }}
                        >
                            {user.role !== 'staff' ? user.userData.name.charAt(0).toUpperCase() : user.userData.firstName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ mb: 1 }}>
                                {user.role !== 'staff' ? user.userData.name : `${user.userData.firstName} ${user.userData.lastName}`}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Typography>
                        </Box>
                        {!isEditing ? (
                            <Box></Box>
                            // <Button
                            //     variant="contained"
                            //     startIcon={<Edit />}
                            //     onClick={handleEditClick}
                            //     sx={{
                            //         ml: 'auto',
                            //         bgcolor: colors.primary,
                            //         '&:hover': { bgcolor: colors.secondary }
                            //     }}
                            // >
                            //     Edit Profile
                            // </Button>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
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
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Profile Information */}
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Person sx={{ color: colors.primary }} />
                            </ListItemIcon>
                            {isEditing ? (
                                <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        value={editedUser.firstName}
                                        onChange={handleInputChange('firstName')}
                                        variant="outlined"
                                        size="small"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        value={editedUser.lastName}
                                        onChange={handleInputChange('lastName')}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                            ) : (
                                <ListItemText
                                    primary="Name"
                                    secondary={user.role !== 'staff' ? user.userData.name : `${user.userData.firstName} ${user.userData.lastName}`}
                                    secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                />
                            )}
                        </ListItem>

                        <ListItem>
                            <ListItemIcon>
                                <Email sx={{ color: colors.primary }} />
                            </ListItemIcon>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={editedUser.email}
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

                        {user.role === 'staff' && (
                            <>
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
                            </>
                        )}

                        {user.role === 'dealer' && (
                            <>
                                <ListItem>
                                    <ListItemIcon>
                                        <Business sx={{ color: colors.primary }} />
                                    </ListItemIcon>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Company Name"
                                            value={editedUser.companyName}
                                            onChange={handleInputChange('companyName')}
                                            variant="outlined"
                                            size="small"
                                        />
                                    ) : (
                                        <ListItemText
                                            primary="Company Name"
                                            secondary={user.companyName}
                                            secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                        />
                                    )}
                                </ListItem>
                            </>
                        )}
                    </List>
                </Paper>
            </Box>
        </Container>
    );
};

export default UserProfile;
