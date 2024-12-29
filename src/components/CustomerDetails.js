import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Container,
    Grid,
    Chip,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    styled,
    Pagination,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

import {
    Phone,
    Person,
    Badge,
    Wallet,
    CalendarToday,
    Print as PrintIcon,
    Visibility as VisibilityIcon,
    Edit,
    Delete,
    Close as CloseIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Fingerprint,
    Home,
    CellTower,
    Save,
    Cancel
} from '@mui/icons-material';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import colors from '../colors';
import { fetchInvoicesByCustomerUid } from '../store/actions/invoiceActions';
import { updateCustomer, deleteCustomer } from '../store/actions/customerActions';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { fetchPackages } from '../store/actions/packageActions';
import { fetchISPs } from '../store/actions/ispActions';

// Create a styled Tab component
const StyledTab = styled(Tab)(({ theme }) => ({
    '&.Mui-selected': {
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        color: 'white',
    },
}));

function CustomerDetails() {
    const [tabValue, setTabValue] = useState(0);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [hasLoadedInvoices, setHasLoadedInvoices] = useState(false);

    const [editedCustomer, setEditedCustomer] = useState(null);
    const allIsps = useSelector((state) => state.isp.isps);
    console.log(allIsps, 'allIsps');
    const selectedDealerId = useSelector((state) => state.auth.user.uid); // Or get from localStorage, etc.
    const [packages, setPackages] = useState([]);
    const [ispId, setIspId] = useState('');
    const [ispName, setIspName] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { invoices, loading } = useSelector((state) => state.invoices);
    const location = useLocation();
    const { state } = location;
    const customer = state;
    const uid = useSelector((state) => state.auth.user.uid);
    const role = useSelector((state) => state.auth.user.role);
    const dealerDid = useSelector((state) => state.auth.user.dealerId);
    const dealerId = role === 'dealer' ? uid : dealerDid;
    console.log(customer, 'customer');
    const printRef = useRef();

    useEffect(() => {
        const localIsps = localStorage.getItem('ispsData');
        if (localIsps) {
            dispatch({
                type: 'FETCH_ISPS_SUCCESS',
                payload: JSON.parse(localIsps),
            });
        } else {
            dispatch(fetchISPs(selectedDealerId));
        }
    }, [dispatch]);

    useEffect(() => {
        const loadPackages = async () => {
            try {
                const packagesData = ispId !== '' && await dispatch(fetchPackages(ispId));
                console.log(packagesData, ispName, 'fetched packages');
                // Convert packages object to array and add id to each package
                const packagesArray = Object.entries(packagesData).map(([id, pkg]) => ({ ...pkg, id }));
                setPackages(packagesArray);
                console.log(packagesArray);
            } catch (error) {
                console.error('Error loading packages:', error);
            } finally {
            }
        };
        loadPackages();
    }, [ispId, dispatch]);

    useEffect(() => {
        if (customer) {
            setEditedCustomer({ ...customer });
        }
    }, [customer]);

    useEffect(() => {
        if (tabValue === 1 && !hasLoadedInvoices && customer?.id) {
            dispatch(fetchInvoicesByCustomerUid(customer.id));
            setHasLoadedInvoices(true);
        }
    }, [tabValue, hasLoadedInvoices, customer?.id, dispatch]);
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Invoice-${selectedInvoice?.invoiceNo || ''}`,
        removeAfterPrint: true,
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedCustomer({ ...customer });
    };

    const handleSaveEdit = async () => {
        try {
            console.log('editedCustomer:', editedCustomer);

            await dispatch(updateCustomer(customer.id, editedCustomer, dealerId))

            setIsEditing(false);
            // navigate('/customers', { replace: true });
            navigate(-1)
        } catch (error) {
            console.error('Error updating customer:', error);
            // TODO: Show error message to user
        }
    };

    const handleDeleteClick = () => {
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            console.log('Deleting customer:', customer);
            await dispatch(deleteCustomer(customer.id, dealerId));
            setOpenDeleteDialog(false);
            navigate('/customers', { replace: true });
        } catch (error) {
            console.error('Error deleting customer:', error);
            // TODO: Show error message to user
        }
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
    };

    const handleInputChange = (field) => (event) => {
        console.log(field, 'field');
        setEditedCustomer({ ...editedCustomer, [field]: event.target.value });
    };

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        console.log(invoice, 'invoice');
        navigate('/receipt', { state: { receiptData: invoice } });
        // navigate(`/invoice/${invoice.id}`);
    };

    const handlePrintInvoice = (invoice) => {
        window.open(`/invoice/${invoice.id}?print=true`, '_blank');
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{
            backgroundColor: '#f4f6fd',
            padding: { xs: 1, sm: 2, md: 4 }
        }}>
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
                <StyledTab sx={{
                    flex: 1, // Equal width for all tabs
                    textAlign: 'center', // Center text
                }}
                    label="Profile" />
                <StyledTab sx={{
                    flex: 1, // Equal width for all tabs
                    textAlign: 'center', // Center text
                }} label="Invoices" />
            </Tabs>

            {tabValue === 0 && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'column' },
                    gap: 2,
                    p: { xs: 1, sm: 2, md: 4 }
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', mb: 2 }}>
                        {!isEditing ? (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Edit />}
                                    onClick={handleEditClick}
                                    sx={{ mr: 1 }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={handleDeleteClick}
                                >
                                    Delete
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={handleSaveEdit}
                                    sx={{ mr: 1 }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Cancel />}
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        )}
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        width: '100%'
                    }}>
                        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', width: '100%' }}>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <Person sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            value={editedCustomer?.fullName || ''}
                                            onChange={handleInputChange('fullName')}
                                        />
                                    ) : (
                                        <ListItemText
                                            primary="Full Name"
                                            secondary={customer?.fullName}
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
                                            label="Customer ID"
                                            disabled
                                            value={editedCustomer?.userName || ''}
                                            onChange={handleInputChange('userName')}
                                        />
                                    ) : (
                                        <ListItemText
                                            primary="Customer ID"
                                            secondary={customer?.userName}
                                            secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                        />
                                    )}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Phone sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            value={editedCustomer?.phone || ''}
                                            onChange={handleInputChange('phone')}
                                        />
                                    ) : (
                                        <ListItemText
                                            primary="Phone"
                                            secondary={customer?.phone}
                                            secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                        />
                                    )}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Home sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            value={editedCustomer?.address || ''}
                                            onChange={handleInputChange('address')}
                                        />
                                    ) : (
                                        <ListItemText
                                            primary="Address"
                                            secondary={customer?.address}
                                            secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                        />
                                    )}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Fingerprint sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="CNIC"
                                            value={editedCustomer?.CNIC || ''}
                                            onChange={handleInputChange('CNIC')}
                                        />
                                    ) : (
                                        <ListItemText
                                            primary="CNIC"
                                            secondary={customer?.CNIC}
                                            secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                        />
                                    )}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CellTower sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    {isEditing ? (
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <InputLabel>ISP</InputLabel>
                                            <Select
                                                label="ISP Name"
                                                value={allIsps.find((isp) => isp.name === editedCustomer?.ispName) || customer?.ispName}
                                                onChange={(e) => {
                                                    const selectedIsp = e.target.value;
                                                    setEditedCustomer({
                                                        ...editedCustomer,
                                                        ispName: selectedIsp.name,
                                                        ispId: selectedIsp.id,
                                                    });
                                                    setIspId(selectedIsp.id);
                                                }}
                                                renderValue={(selected) => (selected ? selected.name : '')}
                                            >
                                                {allIsps.map((isp) => (
                                                    <MenuItem key={isp.id} value={isp}>
                                                        {isp.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <ListItemText
                                            primary="ISP Name"
                                            secondary={customer?.ispName}
                                            secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                        />
                                    )}
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Wallet sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    {isEditing ? (
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <InputLabel>Package</InputLabel>
                                            <Select
                                                label="Package"
                                                value={editedCustomer?.package || customer?.package || ''}
                                                onChange={(e) => {
                                                    const selectedPackage = e.target.value;
                                                    setEditedCustomer({
                                                        ...editedCustomer,
                                                        package: selectedPackage,
                                                    });
                                                }}
                                            >
                                                {packages.map((pkg) => (
                                                    <MenuItem key={pkg.id} value={pkg.pkgName}>
                                                        {pkg.pkgName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <ListItemText
                                            primary="Package"
                                            secondary={customer?.package}
                                            secondaryTypographyProps={{ color: 'darkblue', fontWeight: 'bold' }}
                                        />
                                    )}
                                </ListItem>
                            </List>
                        </Paper>
                    </Box>
                </Box>
            )
            }
            {
                tabValue === 1 && (
                    <Box sx={{ mt: 3 }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ '& .MuiTableCell-root': { borderRight: '1px solid rgba(224, 224, 224, 1)' } }}>
                                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableRow>
                                        <TableCell>Invoice No</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Package</TableCell>
                                        <TableCell>charged By</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell>{invoice.invoiceNumber}</TableCell>
                                            <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>{invoice.package}</TableCell>
                                            <TableCell>{invoice.chargedBy}</TableCell>
                                            <TableCell align="right">Rs. {invoice.amount}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewInvoice(invoice)}
                                                    sx={{ color: colors.primary }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {invoices.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography variant="body2" color="textSecondary">
                                                    No invoices found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Box>
                )
            }
            {/* Pagination */}
            {/* <Box display="flex" justifyContent="center" mt={2}>
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
            </Box> */}
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this customer? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}

export default CustomerDetails;
