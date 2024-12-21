import React, { useState, useEffect } from 'react';
import {
  Box, CssBaseline, Drawer, Menu, MenuItem,
  Avatar, List, ListItem, Button, ListItemIcon,
  ListItemText, Typography, IconButton, Paper,
  Tooltip, Fade, Divider
} from '@mui/material';
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PeopleIcon from '@mui/icons-material/People';
import CellTower from '@mui/icons-material/CellTower';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../store/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../colors';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import BusinessIcon from '@mui/icons-material/Business';
import Groups2 from '@mui/icons-material/Groups2';
import Receipt from '@mui/icons-material/Receipt';
import TableChart from '@mui/icons-material/TableChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircle from '@mui/icons-material/AddCircle';
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
  const userData = useSelector((state) => state.auth.user); // Get user data from state
  const name = userData.name;
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen); // Toggle drawer state
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    // Optionally, you can also sign out from Firebase
    // const auth = getAuth();
    // auth.signOut();
  };

  const handleProfile = () => {
    navigate('/profile'); // Navigate to profile page
    handleMenuClose();
  };

  const items = [
    { text: 'Dashboard', icon: <DashboardIcon fontSize="medium" />, path: '/', roles: ['admin', 'dealer', 'staff'] },
    { text: 'Customers', icon: <PeopleIcon fontSize="medium" />, path: '/customers', roles: ['admin', 'dealer', 'staff'] },
    { text: 'Dealers', icon: <BusinessIcon fontSize="medium" />, path: '/dealers', roles: ['admin'] },
    { text: 'Staff', icon: <Groups2 fontSize="medium" />, path: '/staff', roles: ['admin', 'dealer'] },
    { text: 'ISP', icon: <CellTower fontSize="medium" />, path: '/isp', roles: ['admin', 'dealer'] },
    { text: 'Reports', icon: <TableChart fontSize="medium" />, path: '/reports', roles: ['admin', 'dealer', 'staff'] },
    { text: 'Slips', icon: <AddCircle fontSize="medium" />, path: '/slips', roles: ['admin', 'dealer', 'staff'] },
    { text: 'Quick Slip', icon: <Receipt fontSize="medium" />, path: '/manual-slip', roles: ['admin', 'dealer'] },

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
      (item.path === '/isp' && (currentPath === '/create-isp' || currentPath === '/update-staff' || currentPath.startsWith('/isp') || currentPath.startsWith('/create-pkg'))) || // Check for staff routes
      (item.path === '/dealers' && (currentPath === '/create-dealer' || currentPath.startsWith('/dealers')))
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
    <Box sx={{ display: 'flex' }}>
      {/* Vertical Icon Bar */}
      <Paper
        elevation={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: "center",
          background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          width: 60,
        }}
      >
        <IconButton
          onClick={toggleDrawer}
          sx={{
            display: { xs: 'block', md: 'none' },
            mt: 2,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
        <List sx={{ padding: '4px 1px' }}>
          {filteredItems.map((item, index) => (
            <Tooltip
              title={item.text}
              placement="right"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
            >
              <ListItem
                key={index}
                component={Link}
                to={item.path}
                onClick={() => setSelectedIndex(index)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 1,
                  pt: 2,
                  backgroundColor: selectedIndex === index ? 'white' : 'transparent',
                  color: selectedIndex === index ? colors.primary : 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: selectedIndex === index ? 'white' : 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: 'auto',
                    justifyContent: 'center'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Paper>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            color: '#fff',
            height: "100vh",
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
          }
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={2}
          mb={2}
          sx={{
            transform: 'scale(1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          <img
            src={loginLogo}
            alt="Logo"
            style={{
              height: 'auto',
              maxWidth: '140px',
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
            }}
          />
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />
        <List sx={{ height: "100vh" }}>
          {/* ... (keep your existing list items with enhanced styling) */}
          {filteredItems.map((item, index) => (
            <ListItem
              key={index}
              component={Link}
              to={item.path}
              onClick={() => {
                setSelectedIndex(index);
                toggleDrawer();
              }}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                mx: 1,
                backgroundColor: selectedIndex === index ? 'white' : 'transparent',
                color: selectedIndex === index ? colors.primary : 'inherit',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: selectedIndex === index
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: selectedIndex === index ? 600 : 400
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Desktop Drawer */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' }, // Show only on web
          width: drawerWidth - 72,
          flexShrink: 0,
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              color: '#fff',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
              borderRight: 'none'
            }
          }}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
            mb={2}
            sx={{
              transform: 'scale(1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <img
              src={loginLogo}
              alt="Logo"
              style={{
                height: 'auto',
                maxWidth: '160px',
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
              }}
            />
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />
          <List sx={{ padding: '4px 8px' }}>
            {filteredItems.map((item, index) => (
              <ListItem
                key={index}
                component={Link}
                to={item.path}
                onClick={() => setSelectedIndex(index)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  mb: 0.5,
                  backgroundColor: selectedIndex === index ? 'white' : 'transparent',
                  color: selectedIndex === index ? colors.primary : 'inherit',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: selectedIndex === index
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(5px)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: selectedIndex === index ? 600 : 400
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 2,
            height: { xs: 90, sm: 130 },
            borderRadius: 0,
            bgcolor: 'white'
          }}
        >
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={() => window.history.back()}
              sx={{
                color: colors.secondary,
                mr: { xs: 0, md: 3 },
                ml: { xs: 0, md: 5 },
                '&:hover': {
                  backgroundColor: `${colors.secondary}15`
                }
              }}
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.9rem' } }} />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: colors.primary,
                fontSize: { xs: 14, sm: 24 },
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {window.location.pathname === '/not-authorized'
                ? 'Not Authorised'
                : filteredItems[selectedIndex]?.text || 'Home'}
            </Typography>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            sx={{
              flexWrap: 'wrap',
              '& > *': { m: { xs: 0, md: 1 }, p: { xs: 0.2, md: 0.8 } }
            }}
          >
            <Button
              variant="outlined"
              sx={{
                padding: "5px 10px",
                textTransform: "none",
                color: colors.primary,
                borderColor: colors.primary,
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                "&:hover": {
                  borderColor: colors.secondary,
                  backgroundColor: `${colors.primary}08`,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
                transition: 'all 0.3s ease'
              }}
              endIcon={<ArrowDropDownIcon />}
              onClick={handleMenuOpen}
            >
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: "0.8rem",
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                  mr: 1,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                {name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.6rem', sm: '0.9rem' },
                  fontWeight: 500
                }}
              >
                {window.innerWidth < 700
                  ? (name.length > 10 ? `${name.slice(0, 8)}...` : name)
                  : name}
              </Typography>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  width: { xs: 100, sm: 180 },
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  '& .MuiMenuItem-root': {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: `${colors.primary}15`,
                      transform: 'translateX(5px)'
                    }
                  }
                }
              }}
            >
              <MenuItem
                onClick={handleProfile}
                sx={{
                  color: colors.primary,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: colors.primary,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                }}
              >
                Logout
              </MenuItem>
            </Menu>

            <Tooltip title="Notifications" arrow>
              <IconButton
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: `${colors.primary}15`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <NotificationsIcon
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.6rem' },
                    color: colors.primary
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        <Box
          sx={{
            backgroundColor: "#f3f6ff",
            padding: 2,
            // minHeight: 'calc(100vh - 130px)',
            // transition: 'all 0.3s ease',
            // '& > *': {
            //     animation: 'fadeIn 0.5s ease-in-out'
            // },
            // '@keyframes fadeIn': {
            //     '0%': {
            //         opacity: 0,
            //         transform: 'translateY(10px)'
            //     },
            //     '100%': {
            //         opacity: 1,
            //         transform: 'translateY(0)'
            //     }
            // }
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              backgroundColor: 'white',
              p: 3,
              minHeight: '100%',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default SidebarLayout;
