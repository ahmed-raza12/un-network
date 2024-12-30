import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import Groups2 from '@mui/icons-material/Groups2';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TableChart from '@mui/icons-material/TableChart';
import Receipt from '@mui/icons-material/Receipt';
import AddCircle from '@mui/icons-material/AddCircle';
import CellTower from '@mui/icons-material/CellTower';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import colors from '../colors';

function Dashboard() {
    const [selectedIndex, setSelectedIndex] = useState(0); // State for selected tab
    const role = useSelector((state) => state.auth.user.role); // Get user role from Redux state

    // Define the cards with visibility rules based on the role
    const cards = [
        { label: 'Customers', icon: <PeopleIcon fontSize="large" />, route: '/customers' },
        { label: 'Staff', icon: <Groups2 fontSize="large" />, route: '/staff', hideFor: ['staff'] },
        { label: 'Add Customer', icon: <PersonAddIcon fontSize="large" />, route: '/add-customer' },
        { label: 'Reports', icon: <TableChart fontSize="large" />, route: '/reports' },
        { label: 'Slips', icon: <AddCircle fontSize="large" />, route: '/slips' },
        { label: 'Manual Slip', icon: <Receipt fontSize="large" />, route: '/manual-slip' },
        { label: 'ISP', icon: <CellTower fontSize="large" />, route: '/isp' },
    ];

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Grid container spacing={2} mt={2}>
                {cards
                    .filter((card) => !card.hideFor || !card.hideFor.includes(role)) // Filter out items hidden for the role
                    .map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Link to={card.route} style={{ textDecoration: 'none' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#fff',
                                        height: { xs: 120, sm: 150 }, // Adjust height for mobile
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                        color: colors.secondary,
                                        padding: 2, // Add padding for better spacing
                                        transition: 'transform 0.2s', // Add a hover effect
                                        '&:hover': {
                                            transform: 'scale(1.05)', // Scale up on hover
                                        },
                                    }}
                                >
                                    {card.icon}
                                    <Typography variant="body1" mt={1}>
                                        {card.label}
                                    </Typography>
                                </Box>
                            </Link>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
}

export default Dashboard;
