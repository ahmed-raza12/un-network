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
    TextField
} from '@mui/material';
import {
    Phone,
    Person,
    Badge,
    Edit,
    Save,
    Cancel
} from '@mui/icons-material';
import colors from '../colors';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateStaff } from '../store/actions/staffActions';

const StaffProfile = () => {
    const [value, setValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStaff, setEditedStaff] = useState(null);
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
    };

    const handleSaveEdit = () => {

        dispatch(updateStaff(editedStaff));
        setIsEditing(false);
    };

    const handleInputChange = (field) => (event) => {
        setEditedStaff({ ...editedStaff, [field]: event.target.value });
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', gap: 20, p: 4 }}>
                {/* Left Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                    <Avatar
                        sx={{ width: 150, height: 150, mb: 2 }}
                        alt="Staff Photo"
                        src={staffMember.photo}
                    />
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        {staffMember.firstName} {staffMember.lastName}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ mb: 1 }}>
                        {staffMember.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {staffMember.designation}
                    </Typography>
                    {!isEditing ? (
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
                            Edit Profile
                        </Button>
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
                                        label="First Name"
                                        value={editedStaff.firstName}
                                        onChange={handleInputChange('firstName')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="First Name"
                                        secondary={staffMember.firstName}
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
                                        label="Last Name"
                                        value={editedStaff.lastName}
                                        onChange={handleInputChange('lastName')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Last Name"
                                        secondary={staffMember.lastName}
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
                                    <Person sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label="Email"
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
                                        label="Password"
                                        value={editedStaff.password}
                                        onChange={handleInputChange('password')}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary="Password"
                                        secondary={staffMember.password}
                                        secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                    />
                                )}
                            </ListItem>
                        </List>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default StaffProfile;