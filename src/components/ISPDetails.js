import React from 'react';
import {
    Box,
    Container,
    Grid,
    Chip,
    IconButton,
    Pagination,
    Button,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tabs,
    Avatar,
    Tab,
    Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from "@mui/material/styles";
import {
    Phone,
    Person,
    Badge,
    Wallet,
    // ReceiptIcon,
    CalendarToday,
    AddIcCallOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';
import { tab } from '@testing-library/user-event/dist/tab';

// Create a styled Tab component
const StyledTab = styled(Tab)(({ theme }) => ({
    '&.Mui-selected': {
        background: 'linear-gradient(90deg, #00A36C 0%, #2AAA8A 100%)',
        color: 'white', // Active tab label color
    },
}));

function ISPDetails() {
    const [tabValue, setTabValue] = React.useState(() => {
        // Get the saved tab value from localStorage or default to 0
        const savedTab = localStorage.getItem('ispDetailsActiveTab');
        return savedTab ? parseInt(savedTab) : 0;
    });
    const navigate = useNavigate()

    const pkgData = [
        { name: 'DT-1MB', amount: 1200 },
        { name: 'DT-2MB', amount: 2400 },
        { name: 'DT-5MB', amount: 6000 },
        { name: 'DT-10MB', amount: 12000 },
        { name: 'DT-20MB', amount: 24000 },
        { name: 'DT-50MB', amount: 60000 },
        { name: 'DT-100MB', amount: 120000 },
    ];

    const handleStaffClick = (staffMember, id) => {
        navigate(`/isp-details/${staffMember}`, { state: staffMember }); // Pass staff member data
    };
    const handleTabChange = (event, newValue) => {
        console.log(newValue);

        setTabValue(newValue);
        // Save the active tab to localStorage
        localStorage.setItem('ispDetailsActiveTab', newValue.toString());
    };

    const handleCreatePackage = () => {
        // Save current tab before navigation
        localStorage.setItem('ispDetailsActiveTab', '1'); // 1 is the index of the Packages tab
        navigate('/create-pkg');
    };

    return (
        <Box sx={{
            backgroundColor: '#f4f6fd',
            padding: { xs: 1, sm: 2, md: 4 } // Responsive padding
        }}>
            {/* Tabs for Profile and Invoices */}
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                    maxWidth: "100%",
                    margin: 'auto',
                    borderRadius: { xs: 2, md: 4 },
                    backgroundColor: '#e0e7ff',
                }}
                TabIndicatorProps={{
                    style: {
                        background: colors.gradientBackground,
                    },
                }}
            >
                <StyledTab label="Profile" />
                <StyledTab label="Packages" />
                <StyledTab label="Import Users" />
            </Tabs>

            {tabValue === 0 && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    p: { xs: 1, sm: 2, md: 4 }
                }}>
                    <Box sx={{
                        width: { xs: '100%', md: '50%' }
                    }}>
                        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', width: '100%' }}>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <Phone sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Connection Details"
                                        secondary="03030668886"
                                        secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Person sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Address"
                                        secondary="hghnb,1234"
                                        secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarToday sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Last Recharge"
                                        secondary="13-11-24"
                                        secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Box>
                    <Box sx={{
                        width: { xs: '100%', md: '50%' }
                    }}>
                        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', width: '100%' }}>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <Badge sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Total Package Price"
                                        secondary="500"
                                        secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Wallet sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Abatement (Discount)"
                                        secondary="None"
                                        secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Wallet sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="ReceiveAble Amount"
                                        secondary="500/-"
                                        secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Box>
                </Box>
            )}
            {/* Invoice Item */}
            {tabValue === 1 && (
                <Grid container spacing={2} mt={2}>
                    <Box textAlign="right" sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleCreatePackage}
                            sx={{
                                background: colors.gradientBackground,
                                '&:hover': { background: colors.gradientBackground },
                            }}
                        >
                            Create Package
                        </Button>
                    </Box>
                    <Grid container spacing={2} mt={2}>
                        {pkgData.map((pkg, id) => (
                            <Grid item xs={12} sm={6} md={4} key={id}>
                                <Paper
                                    elevation={3}
                                    sx={{ display: 'flex', borderRadius: 5, flexDirection: 'column', alignItems: 'center', padding: 4, mb: 2, cursor: 'pointer' }}
                                    onClick={() => handleStaffClick(pkg, id)} // Pass the entire staff member object
                                >
                                    <Typography variant="h5" color={colors.primary} sx={{ mb: 1 }}>
                                        {pkg.name}
                                    </Typography>
                                    <Typography variant="secondary" color={colors.secondary} sx={{ mb: 1 }}>
                                        {pkg.amount}
                                    </Typography>

                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            )}

            {/* Pagination */}
            {
                tabValue === 2 && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={1}
                            variant="outlined"
                            shape="rounded"
                            size="small"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    minWidth: { xs: 30, sm: 40 },
                                    height: { xs: 30, sm: 40 },
                                }
                            }}
                        />
                    </Box>
                )
            }
        </Box>
    );
}

export default ISPDetails;
