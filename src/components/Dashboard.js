// Dashboard.js
import React, { useState } from 'react'; // Import useState
import { Box, CssBaseline, Drawer, List, ListItem, Button, ListItemIcon, ListItemText, Typography, Grid, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import CloudIcon from '@mui/icons-material/Cloud';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import QueueIcon from '@mui/icons-material/Queue';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Receipt from '@mui/icons-material/Receipt';
import TableChart from '@mui/icons-material/TableChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircle from '@mui/icons-material/AddCircle';
import CellTower from '@mui/icons-material/CellTower';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/actions/authActions';
import colors from '../colors';
import BusinessIcon from '@mui/icons-material/Business'; // For Dealers
import GroupIcon from '@mui/icons-material/Group'; // For Staff
import Groups2 from '@mui/icons-material/Groups2';
import ReportIcon from '@mui/icons-material/Report';
import DeleteAllUsers from './DeleteAllUsers'; // Import DeleteAllUsers component
import PersonAddIcon from '@mui/icons-material/PersonAdd';
const drawerWidth = 240;

function Dashboard() {
    const dispatch = useDispatch();
    const [selectedIndex, setSelectedIndex] = useState(0); // State for selected tab
    const role = useSelector(state => state.auth.user.role); // Get user role from Redux state
    //   const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // Get login status from Redux state
    const handleLogout = () => {
        dispatch(logout()); // Dispatch logout action
        // Optionally, you can also sign out from Firebase
        // const auth = getAuth();
        // auth.signOut();
    };
    return (
        <Box component="main" sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Grid container spacing={2} mt={2}>
                {[
                    
                    { label: 'Customers', icon: <PeopleIcon fontSize="large" />, route: '/customers' },
                    { label: 'Staff', icon: <Groups2 fontSize="large" />, route: '/staff' },
                    { label: 'Add Customer', icon: <PersonAddIcon fontSize="large" />, path: '/add-customer'},
                    { label: 'Reports', icon: <TableChart fontSize="large" />, route: '/reports' },
                    { label: 'Slips', icon: <AddCircle fontSize="large" />, route: '/slips' },
                    { label: 'Manual Slip', icon: <Receipt fontSize="large" />, route: '/manual-slip' },
                    { label: 'ISP', icon: <CellTower fontSize="large" />, route: '/isp' },
                ].map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Link to={card.route} style={{ textDecoration: 'none' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: "#fff",
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
                                <Typography variant="body1" mt={1}>{card.label}</Typography>
                            </Box>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Dashboard;
