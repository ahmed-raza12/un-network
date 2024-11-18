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
    Paper,
    TextField
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
import { useLocation } from 'react-router-dom';

const UpdateStaff = () => {
    const location = useLocation(); // Get the location object
    const staffMember = location.state; // Access the passed staff member data

    // Initialize state with staff member data
    const [phone, setPhone] = useState(staffMember.phone);
    const [username, setUsername] = useState(staffMember.username);
    const [designation, setDesignation] = useState(staffMember.designation);
    const [walletLimit, setWalletLimit] = useState(staffMember.walletLimit);
    const [walletDays, setWalletDays] = useState(staffMember.walletDays);
    const [password, setPassword] = useState(''); // Password should be handled securely
    const [isActive, setIsActive] = useState(staffMember.isActive);

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', gap: 20, p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                    <Avatar
                        sx={{ width: 150, height: 150, mb: 2 }}
                        alt="Staff Photo"
                        src={staffMember.photo} // Use the photo from the staff member data
                    />
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        {staffMember.firstName} {staffMember.lastName} {/* Display staff member's name */}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ mb: 1 }}>
                        {staffMember.phone} {/* Display staff member's phone */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {staffMember.designation} {/* Display staff member's designation */}
                    </Typography>
                </Box>

                <Box sx={{ width: '70%' }}>
                    <Paper elevation={5} sx={{ p: 3, borderRadius: 10, bgcolor: 'background.default' }}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <Phone sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="User Phone"
                                    secondary={
                                        <TextField
                                            variant="outlined"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            fullWidth
                                        />
                                    }
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <Person sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Username"
                                    secondary={
                                        <TextField
                                            variant="outlined"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            fullWidth
                                        />
                                    }
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <Badge sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Designation"
                                    secondary={
                                        <TextField
                                            variant="outlined"
                                            value={designation}
                                            onChange={(e) => setDesignation(e.target.value)}
                                            fullWidth
                                        />
                                    }
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <Wallet sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Wallet Limit"
                                    secondary={
                                        <TextField
                                            variant="outlined"
                                            value={walletLimit}
                                            onChange={(e) => setWalletLimit(e.target.value)}
                                            fullWidth
                                        />
                                    }
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <CalendarToday sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Wallet Days"
                                    secondary={
                                        <TextField
                                            variant="outlined"
                                            value={walletDays}
                                            onChange={(e) => setWalletDays(e.target.value)}
                                            fullWidth
                                        />
                                    }
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <Lock sx={{ color: colors.primary }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Password"
                                    secondary={
                                        <TextField
                                            variant="outlined"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            fullWidth
                                        />
                                    }
                                />
                            </ListItem>

                            <ListItem>
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
                            </ListItem>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    bgcolor: colors.primary,
                                    '&:hover': { bgcolor: colors.secondary },
                                    borderRadius: '25px'
                                }}
                            >
                                Update Staff
                            </Button>
                        </List>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default UpdateStaff;
