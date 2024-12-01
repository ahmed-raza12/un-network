import React, { useState, useEffect } from 'react'; // Import useEffect
import {
    Box, CssBaseline, Drawer, Menu,
    MenuItem,
    Avatar, List, ListItem, Button, ListItemIcon, ListItemText, Typography, IconButton
} from '@mui/material';
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PeopleIcon from '@mui/icons-material/People';
import { Outlet, Link, useLocation } from 'react-router-dom'; // Import useLocation
import { logout } from '../store/actions/authActions';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import colors from '../colors'; // Import colors
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import BusinessIcon from '@mui/icons-material/Business';
import Groups2 from '@mui/icons-material/Groups2';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Report';
import MenuIcon from '@mui/icons-material/Menu';
import loginLogo from '../assets/panel_logo.png';

const drawerWidth = 240;

function SidebarLayout() {
    const location = useLocation(); // Get the current location
    const [selectedIndex, setSelectedIndex] = useState(0); // State for selected tab
    const dispatch = useDispatch();
    const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer open/close
    const [anchorEl, setAnchorEl] = useState(null);
    const userRole = useSelector((state) => state.auth.user?.role); // Get user role from state
    const userData = useSelector((state) => state.auth.user?.userData); // Get user data from state
    const name = userRole === 'staff' ? userData.firstName : userData.name;

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen); // Toggle drawer state
    };

    const handleLogout = () => {
        dispatch(logout()); // Dispatch logout action
        // Optionally, you can also sign out from Firebase
        // const auth = getAuth();
        // auth.signOut();
    };

    const items = [
        { text: 'Dashboard', icon: <DashboardIcon fontSize="medium" />, path: '/', roles: ['admin', 'dealer', 'staff'] },
        { text: 'Connections', icon: <PeopleIcon fontSize="medium" />, path: '/customers', roles: ['admin', 'dealer', 'staff'] },
        { text: 'Dealers', icon: <BusinessIcon fontSize="medium" />, path: '/dealers', roles: ['admin'] },
        { text: 'Staff', icon: <Groups2 fontSize="medium" />, path: '/staff', roles: ['admin', 'dealer'] },
        { text: 'ISP', icon: <Groups2 fontSize="medium" />, path: '/isp', roles: ['admin', 'dealer'] },
        { text: 'Reports', icon: <ReportIcon fontSize="medium" />, path: '/reports', roles: ['admin', 'dealer', 'staff'] },
        { text: 'Slips', icon: <ReportIcon fontSize="medium" />, path: '/slips', roles: ['admin', 'dealer', 'staff'] },
        // { text: 'Due Customers', icon: <ReportIcon fontSize="medium" />, path: '/due-customers', roles: ['admin', 'dealer', 'staff'] },

    ];

    // Filter items based on user role
    const filteredItems = items.filter(item => item.roles.includes(userRole));

    useEffect(() => {
        // Set the selected index based on the current path
        const currentPath = location.pathname;
        const activeIndex = filteredItems.findIndex(item =>
            item.path === currentPath ||
            (item.path === '/customers' && (currentPath === '/add-customer' || currentPath === '/customer-details' || currentPath === '/invoice' || currentPath.startsWith('/customer'))) ||
            (item.path === '/staff' && (currentPath === '/create-staff' || currentPath === '/update-staff' || currentPath.startsWith('/staff'))) || // Check for staff routes
            (item.path === '/isp' && (currentPath === '/create-isp' || currentPath === '/update-staff' || currentPath.startsWith('/isp') || currentPath.startsWith('/create-pkg'))) // Check for staff routes

        );
        setSelectedIndex(activeIndex !== -1 ? activeIndex : 0); // Default to 0 if not found
    }, [location.pathname]); // Run effect when the pathname changes
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ display: 'flex', }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignContent: "center",
                background: colors.gradientBackground,
                width: 60,
            }}>
                <IconButton onClick={toggleDrawer} sx={{ display: { xs: 'block', md: 'none', }, mt: 2, color: 'white' }}> {/* Change color to green */}
                    <MenuIcon />
                </IconButton>
                <List sx={{ padding: '4px 1px', }}>
                    {filteredItems.map((item, index) => (
                        <ListItem
                            key={index}
                            component={Link}
                            to={item.path}
                            onClick={() => {
                                setSelectedIndex(index);
                            }}
                            sx={{
                                cursor: "pointer",
                                borderRadius: 1,
                                pt: 2,
                                backgroundColor: selectedIndex === index ? 'white' : 'transparent',
                                color: selectedIndex === index ? colors.primary : 'white'
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Drawer
                variant="temporary" // Change to temporary for mobile view
                open={drawerOpen} // Control drawer open state
                onClose={toggleDrawer} // Close drawer on backdrop click
                sx={{
                    display: { xs: 'block', md: 'none' }, // Show only on mobile
                    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', background: colors.gradientBackground, color: '#fff', height: "100vh" },
                }}
            >
                <Box display="flex" justifyContent="center" alignItems="center" mt={2} mb={2}>
                        <img
                            src={loginLogo}
                            alt="Logo"
                            style={{ height: 'auto', maxWidth: '140px' }} // Responsive image
                        />
                    </Box>
                <List sx={{ height: "100vh" }}>
                    {location.pathname === '/not-authorized' && (
                        <ListItem sx={{ cursor: "not-allowed", backgroundColor: 'transparent', color: 'inherit' }}>
                            <ListItemText primary="Access Denied" />
                        </ListItem>
                    )}
                    {filteredItems.map((item, index) => (
                        <ListItem
                            key={index}
                            component={Link}
                            to={item.path}
                            onClick={() => {
                                setSelectedIndex(index);
                                toggleDrawer(); // Close drawer on item click
                            }}
                            sx={{
                                cursor: "pointer",
                                borderRadius: 2,
                                backgroundColor: location.pathname !== '/not-authorized' && selectedIndex === index ? 'white' : 'transparent',
                                color: location.pathname !== '/not-authorized' && selectedIndex === index ? colors.primary : 'inherit',
                                transition: 'background-color 0.3s ease, transform 0.2s ease', // Add transition for background color and transform
                                '&:hover': {
                                    backgroundColor: location.pathname !== '/not-authorized' && selectedIndex === index ? 'none' : 'rgba(255, 255, 255, 0.1)', // Optional: Change background color on hover
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                sx={{
                    display: { xs: 'none', md: 'block' }, // Show only on web
                    width: drawerWidth - 72,
                    flexShrink: 0,
                }}
            >
                <Drawer
                    variant="permanent" // Permanent drawer for web view
                    sx={{
                        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', background: colors.gradientBackground, color: '#fff' },
                    }}
                >
                    <Box display="flex" justifyContent="center" alignItems="center" mt={2} mb={2}>
                        <img
                            src={loginLogo}
                            alt="Logo"
                            style={{ height: 'auto', maxWidth: '160px' }} // Responsive image
                        />
                    </Box>
                    <List sx={{ padding: '4px 1px', }}>
                        {filteredItems.map((item, index) => (
                            <ListItem
                                key={index}
                                component={Link}
                                to={item.path}
                                onClick={() => setSelectedIndex(index)} // No need to toggle drawer
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: 2,
                                    backgroundColor: location.pathname !== '/not-authorized' && selectedIndex === index ? 'white' : 'transparent',
                                    color: location.pathname !== '/not-authorized' && selectedIndex === index ? colors.primary : 'inherit',
                                    transition: 'background-color 0.3s ease, transform 0.2s ease', // Add transition for background color and transform
                                    '&:hover': {
                                        // transform: 'scale(1)', // Slightly scale up on hover
                                        backgroundColor: location.pathname !== '/not-authorized' && selectedIndex === index ? 'none' : 'rgba(255, 255, 255, 0.1)', // Optional: Change background color on hover
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Box display="flex" justifyContent="space-between" sx={{ p: 2, flexGrow: 1, height: { xs: 90, sm: 130 } }} alignItems="center">
                    <Box display="flex" alignItems="center">
                        <IconButton onClick={() => window.history.back()} sx={{ color: colors.secondary, mr: { xs: 0, md: 3 }, ml: { xs: 0, md: 5 } }}>
                            <ArrowBackIosNewRoundedIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.9rem' } }} />
                        </IconButton>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary, fontSize: { xs: 14, sm: 24 } }}>
                            {window.location.pathname === '/not-authorized' ? 'Not Authorised' : filteredItems[selectedIndex]?.text || 'Home'}
                        </Typography>
                    </Box>

                    {/* User Info */}
                    <Box display="flex" alignItems="center" sx={{ flexWrap: 'wrap', '& > *': { m: { xs: 0, md: 1 }, p: { xs: 0.2, md: 0.8 } } }}>
                        <Button
                            variant="outlined"
                            sx={{
                                padding: "5px 10px",
                                textTransform: "none",
                                color: colors.primary,
                                borderColor: colors.primary,
                                "&:hover": {
                                    borderColor: "#5438b3",
                                },
                            }}
                            endIcon={<ArrowDropDownIcon />}
                            onClick={handleMenuOpen}
                        >
                            <Avatar
                                sx={{
                                    width: 24,
                                    height: 24,
                                    fontSize: "0.8rem",
                                    backgroundColor: "#e0e7ff",
                                    color: colors.primary,
                                    mr: 1
                                }}
                            >
                                {name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontSize: { xs: 8, sm: 14 } }} color={colors.primary}>
                                {window.innerWidth < 700 ? (name.length > 10 ? `${name.slice(0, 8)}...` : name) : name}
                            </Typography>
                        </Button>

                        {/* Dropdown Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                sx: {
                                    mt: 1,
                                    width: { xs: 100, sm: 180 },
                                },
                            }}
                        >
                            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                        {/* Icons */}
                        <IconButton sx={{ ml: 0.3 }}>
                            <SettingsIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.6rem' }, color: colors.primary }} />
                        </IconButton>
                        <IconButton>
                            <SearchIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.6rem' }, color: colors.primary }} />
                        </IconButton>
                        <IconButton>
                            <NotificationsIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.6rem' }, color: colors.primary }} />
                        </IconButton>

                    </Box>
                </Box>
                <Box sx={{ backgroundColor: "#f3f6ff", padding: 2, }}>
                    <Outlet />
                </Box>
            </Box>
        </div >
    );
}

export default SidebarLayout;
