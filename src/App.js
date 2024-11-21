import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase'; // Import your firebase config
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { logout } from './store/actions/authActions';
import SidebarLayout from './components/Sidebar';
import Customers from './components/Customers';
import AddCustomer from './components/AddCustomer';
import Dealers from './components/Dealers';
import StaffProfile from './components/StaffProfile';
import Staff from './components/Staff';
import CreateStaff from './components/CreateStaff';
import UpdateStaff from './components/UpdateSatff';
import CustomerDetails from './components/CustomerDetails';
import Invoice from './components/Invoice';
import ProtectedRoute from './ProtectedRoute';
import NotAuthorized from './components/NotAuthorized';
import Report from './components/Report';
import Slips from './components/Slips';
import DueCustomers from './components/DueCustomers';
import ISP from './components/ISP';
import CreateISP from './components/CreateISP';
import ISPDetails from './components/ISPDetails';

// Initialize Firebase
initializeApp(firebaseConfig);

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // Get login status from Redux state

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    // Optionally, you can also sign out from Firebase
    // const auth = getAuth();
    // auth.signOut();
  };

  return (
    <Router>
      {/* Uncomment the AppBar if you want to use it */}
      {/* {isLoggedIn && (
        <AppBar position="static" sx={{ boxShadow: 3 }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="info"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Business Dashboard
            </Typography>
            <Box>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
              <Button color="inherit" component={Link} to="/customers">
                Customers
              </Button>
              <Button color="inherit" component={Link} to="/products">
                Products
              </Button>
              <Button color="inherit" component={Link} to="/orders">
                Orders
              </Button>
              <Button color="inherit" component={Link} to="/suppliers">
                Suppliers
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      )} */}
      <Routes>
        {isLoggedIn ? ( // Check if user is logged in
          <>
              <Route path="/" element={<SidebarLayout />}>
                <Route index element={<Dashboard />} />
                <Route path='/customers' element={<ProtectedRoute element={<Customers />} allowedRoles={['admin', 'dealer', 'staff']} />} />
                <Route path='/add-customer' element={<ProtectedRoute element={<AddCustomer />} allowedRoles={['admin', 'dealer', 'staff']} />} />
                <Route path='/invoice' element={<ProtectedRoute element={<Invoice />} allowedRoles={['admin', 'dealer', 'staff']} />} />
                <Route path='/dealers' element={<ProtectedRoute element={<Dealers />} allowedRoles={['admin']} />} />
                <Route path="/customer-details/:id" element={<CustomerDetails />} allowedRoles={['admin', 'dealer', 'staff']} /> {/* Route for customer details with ID */}
                <Route path='/staff' element={<ProtectedRoute element={<Staff />} allowedRoles={['admin', 'dealer']} />} />
                <Route path="/staff-profile/:id" element={<ProtectedRoute element={<StaffProfile />} allowedRoles={['admin', 'dealer']} />} />
                <Route path="/create-staff" element={<ProtectedRoute element={<CreateStaff />} allowedRoles={['admin', 'dealer']} />} />
                <Route path="/update-staff" element={<ProtectedRoute element={<UpdateStaff />} allowedRoles={['admin', 'dealer']} />} />
                <Route path="/reports" element={<ProtectedRoute element={<Report />} allowedRoles={['admin', 'dealer', 'staff']} />} />
                <Route path="/slips" element={<ProtectedRoute element={<Slips />} allowedRoles={['admin', 'dealer', 'staff']} />} />
                <Route path="/due-customers" element={<ProtectedRoute element={<DueCustomers />} allowedRoles={['admin', 'dealer', 'staff']} />} />
                <Route path="/isp" element={<ProtectedRoute element={<ISP />} allowedRoles={['admin', 'dealer', 'staff']} />} />
                <Route path="/create-isp" element={<ProtectedRoute element={<CreateISP />} allowedRoles={['admin', 'dealer', 'staff']} />} />
                <Route path="/isp-details/:id" element={<ProtectedRoute element={<ISPDetails />} allowedRoles={['admin', 'dealer', 'staff']} />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/not-authorized" element={<NotAuthorized />} /> {/* Create a NotAuthorized component */}
              </Route>
            </>
            ) : (
            <Route path="/login" element={<Login />} /> // Show login screen if not logged in
        )}
            <Route path="*" element={<Login />} /> {/* Redirect all other routes to Login */}
          </Routes>
    </Router>
  );
};

export default App;
