import React from 'react';
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
    Link
} from '@mui/material';
import {
    Phone,
    Person,
    Badge,
    Wallet,
    CalendarToday,
    Lock,
    PowerSettingsNew
} from '@mui/icons-material';
import colors from '../colors';
import { useNavigate, useLocation } from 'react-router-dom';

const StaffProfile = () => {
    const [value, setValue] = React.useState(0);
    const [isActive, setIsActive] = React.useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const staffMember = location.state;

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
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
                    {/* <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate('/update-staff', { state: staffMember })}
                        sx={{
                            bgcolor: colors.primary,
                            '&:hover': { bgcolor: colors.secondary },
                            borderRadius: '25px'
                        }}
                    >
                        Update Staff
                    </Button> */}
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
                            {/* <Tab label="Transactions" /> */}
                        </Tabs>
                    </Box>

                    <Paper elevation={5} sx={{ p: 3, borderRadius: 10, bgcolor: 'background.default' }}>
                        <List>
                        <ListItem>
                                <ListItemIcon>
                                    <Person sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Firts Name"
                                    secondary={staffMember.firstName}
                                    secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Person sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Last Name"
                                    secondary={staffMember.lastName}
                                    secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Phone sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="User Phone"
                                    secondary={staffMember.phone}
                                    secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <Person sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Email"
                                    secondary={staffMember.email}
                                    secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <Badge sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Designation"
                                    secondary={staffMember.designation}
                                    secondaryTypographyProps={{ color: colors.primary, fontWeight: 'bold' }}
                                />
                            </ListItem>

                            {/* <ListItem>
                                <ListItemIcon>
                                    <PowerSettingsNew sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="User Status"
                                    secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Switch
                                                checked={isActive}
                                                onChange={(e) => setIsActive(e.target.checked)}
                                                sx={{ color: colors.primary }}
                                            />
                                            <Typography
                                                variant="body2"
                                                sx={{ color: colors.primary, fontWeight: 'bold' }}
                                            >
                                                Active
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem> */}
                        </List>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default StaffProfile;