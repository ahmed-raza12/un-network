import React, { useEffect, useState } from 'react';
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
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    TextField,
    CircularProgress
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
import { useNavigate, useLocation } from 'react-router-dom';
import colors from '../colors';
import { useDispatch, useSelector } from 'react-redux';
import { deleteISP, updateISP } from '../store/actions/ispActions';
import { fetchPackages } from '../store/actions/packageActions';

// Create a styled Tab component
const StyledTab = styled(Tab)(({ theme }) => ({
    '&.Mui-selected': { 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        color: 'white', // Active tab label color
    },
}));

function ISPDetails() {
    const [tabValue, setTabValue] = React.useState(() => {
        const savedTab = localStorage.getItem('ispDetailsActiveTab');
        return savedTab ? parseInt(savedTab) : 0;
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    // const dealerId = location.state?.dealerId;
    const { state } = location;
    const isp = state;
    console.log(isp);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(isp);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const packages = useSelector((state) => state.package.packages);
    useEffect(() => {
        const loadPackages = async () => {
            setLoading(true);
            try {
                const packagesData = await dispatch(fetchPackages(isp.id));
                // Convert packages object to array and add id to each package
                // console.log(packagesData, isp.id, 'fetched packages');
                const packagesArray = Object.entries(packagesData).map(([id, pkg]) => ({
                    ...pkg,
                    id
                }));
                setPackages(packagesArray);
            } catch (error) {
                console.error('Error loading packages:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadPackages();
    }, [isp.id, dispatch]);

    const handleStaffClick = (pkg) => {
        navigate(`/pkg-details/${pkg.id}`, {
            state: {
                pkg: {
                    id: pkg.id,
                    ispId: isp.id, 
                    pkgName: pkg.pkgName,
                    salePrice: pkg.salePrice,
                    status: pkg.status || 'Active'
                }
            }
        });
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
        navigate('/create-pkg', {
            state: {
                ispId: isp.id
            }
        });
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteISP(isp.id, isp.dealerId));
            setSnackbar({
                open: true,
                message: 'ISP deleted successfully',
                severity: 'success'
            });
            setTimeout(() => {
                navigate('/isp');
            }, 1500);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error deleting ISP: ' + error.message,
                severity: 'error'
            });
        }
        setDeleteDialogOpen(false);
    };

    const handleEdit = () => {
        if (isEditing) {
            // Save changes
            dispatch(updateISP(isp.id, editedData, isp.dealerId));
            navigate(-1);
            setSnackbar({
                open: true,
                message: 'ISP updated successfully',
                severity: 'success'
            });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field) => (event) => {
        setEditedData({
            ...editedData,
            [field]: event.target.value
        });
    };

    return (
        <Box sx={{
            backgroundColor: '#f4f6fd',
            minHeight: '100vh',
            // display: 'flex',
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
                    flexDirection: 'column',
                    gap: 2,
                    p: { xs: 1, sm: 2, md: 4 }
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mb: 2
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEdit}
                            sx={{
                                bgcolor: colors.primary,
                                '&:hover': { bgcolor: colors.secondary }
                            }}
                        >
                            {isEditing ? 'Save Changes' : 'Edit ISP'}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Delete ISP
                        </Button>
                    </Box>
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
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                label="Name"
                                                value={editedData.name}
                                                onChange={handleInputChange('name')}
                                                variant="outlined"
                                                size="small"
                                            />
                                        ) : (
                                            <ListItemText
                                                primary={"Name"}
                                                secondary={isp.name}
                                                secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                            />
                                        )}
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <AddIcCallOutlined sx={{ color: 'darkblue' }} />
                                        </ListItemIcon>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                value={editedData.email}
                                                onChange={handleInputChange('email')}
                                                variant="outlined"
                                                size="small"
                                            />
                                        ) : (
                                            <ListItemText
                                                primary="Email"
                                                secondary={isp.email}
                                                secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                            />
                                        )}
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Badge sx={{ color: 'darkblue' }} />
                                        </ListItemIcon>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                label="Country"
                                                value={editedData.country}
                                                onChange={handleInputChange('country')}
                                                variant="outlined"
                                                size="small"
                                            />
                                        ) : (
                                            <ListItemText
                                                primary="Country"
                                                secondary={isp.city}
                                                secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                            />
                                        )}
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Badge sx={{ color: 'darkblue' }} />
                                        </ListItemIcon>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                label="City"
                                                value={editedData.city}
                                                onChange={handleInputChange('city')}
                                                variant="outlined"
                                                size="small"
                                            />
                                        ) : (
                                            <ListItemText
                                                primary="City"
                                                secondary={isp.city}
                                                secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                            />
                                        )}
                                    </ListItem>

                                </List>
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            )
            }
            {/* Invoice Item */}
            {
                tabValue === 1 && (
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
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
                                {error}
                            </Box>
                        ) : packages.length === 0 ? (
                            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                                No packages found. Create your first package!
                            </Box>
                        ) : (
                            <Grid container spacing={2} mt={2}>
                                {packages.map((pkg) => (
                                    <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                display: 'flex',
                                                borderRadius: 5,
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                padding: 4,
                                                mb: 2,
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    bgcolor: '#f5f5f5'
                                                }
                                            }}
                                            onClick={() => handleStaffClick(pkg)}
                                        >
                                            <Box sx={{ width: '100%', textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ color: colors.primary, mb: 1 }}>
                                                    {pkg.pkgName}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                                    ${pkg.salePrice}
                                                </Typography>
                                                {/* <Chip
                                                    label={pkg.status || 'Active'}
                                                    size="small"
                                                    sx={{
                                                        mt: 1,
                                                        bgcolor: pkg.status === 'Active' ? 'success.light' : 'warning.light',
                                                        color: pkg.status === 'Active' ? 'success.dark' : 'warning.dark'
                                                    }}
                                                /> */}
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                )
            }

            {/* Pagination */}
            {
                tabValue === 2 && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        {/* <Pagination
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
                        /> */}
                    </Box>
                )
            }

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete ISP</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this ISP? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ISPDetails;
