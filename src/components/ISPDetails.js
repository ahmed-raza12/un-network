import React from 'react';
import {
    Box,
    Container,
    Grid,
    Chip,
    IconButton,
    Pagination,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import { styled } from "@mui/material/styles";
import {
    Phone,
    Person,
    Badge,
    Wallet,
    // ReceiptIcon,
    CalendarToday
} from '@mui/icons-material';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';

// Create a styled Tab component
const StyledTab = styled(Tab)(({ theme }) => ({
    '&.Mui-selected': {
        background: 'linear-gradient(90deg, #00A36C 0%, #2AAA8A 100%)',
        color: 'white', // Active tab label color
    },
}));

function ISPDetails() {
    const [tabValue, setTabValue] = React.useState(0);
    const navigate = useNavigate()
    const handleTabChange = (event, newValue) => {
        console.log(newValue);

        setTabValue(newValue);
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
                <Paper
                    elevation={1}
                    sx={{
                        padding: { xs: 1, sm: 2 },
                        borderRadius: { xs: 2, md: 3 },
                        marginY: { xs: 2, md: 4 },
                        maxWidth: "100%",
                    }}
                >
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Invoice Type
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                New Connection
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={1}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Status
                            </Typography>
                            <Typography variant="body2" color="primary">
                                OPEN
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Total Amount
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                500
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={1}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Paid
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'green' }}>
                                +300
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={1}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Discount
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'red' }}>
                                -0
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={1}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Remaining
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                200
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Invoice Date
                            </Typography>
                            <Chip
                                label="13-November-2024 02:14 PM"
                                sx={{
                                    backgroundColor: '#e8f5e9',
                                    color: '#43a047',
                                    maxWidth: '100%',
                                    height: 'auto',
                                    '& .MuiChip-label': {
                                        whiteSpace: 'normal',
                                        padding: '8px'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={1} container justifyContent="flex-end">
                            <IconButton onClick={() => navigate('/invoice')}>
                                <ReceiptIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Pagination */}
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
        </Box>
    );
}

export default ISPDetails;
