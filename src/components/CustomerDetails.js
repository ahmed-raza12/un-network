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
    TextField
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
import { PrintableInvoice } from './Invoice';
import dealerReducer from '../store/reducers/dealerReducer';

// Create a styled Tab component
const StyledTab = styled(Tab)(({ theme }) => ({
    '&.Mui-selected': {
        background: 'linear-gradient(90deg, #00A36C 0%, #2AAA8A 100%)',
        color: 'white',
    },
}));

function CustomerDetails() {
    const [tabValue, setTabValue] = useState(0);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { invoices, loading } = useSelector((state) => state.invoices);
    const location = useLocation();
    const { state } = location;
    const customer = state;
    console.log(customer, 'customer');
    const printRef = useRef();

    useEffect(() => {
        if (customer) {
            setEditedCustomer({ ...customer });
        }
    }, [customer]);

    useEffect(() => {
        if (customer?.id) {
            dispatch(fetchInvoicesByCustomerUid(customer.id));
        }
    }, [dispatch, customer?.id]);

    useEffect(() => {
        dispatch(fetchInvoicesByCustomerUid(id));
    }, [dispatch, id]);

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
            await dispatch(updateCustomer(customer.id, editedCustomer, customer.dealerId));
            setIsEditing(false);
            navigate('/customers', { replace: true });
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
            await dispatch(deleteCustomer(customer.id, customer.dealerId));
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
        setEditedCustomer({ ...editedCustomer, [field]: event.target.value });
    };

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        navigate(`/invoice/${invoice.id}`);
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
                                        <Badge sx={{ color: 'darkblue' }} />
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
                                        <Wallet sx={{ color: 'darkblue' }} />
                                    </ListItemIcon>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Package"
                                            value={editedCustomer?.package || ''}
                                            onChange={handleInputChange('package')}
                                        />
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
                        {/* <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', width: '100%' }}>
                            <List>
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
                        </Paper> */}
                    </Box>
                </Box>
            )}
            {tabValue === 1 && (
                <Box sx={{ mt: 3 }}>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Invoice No</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Package</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell>{invoice.invoiceNo}</TableCell>
                                        <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{invoice.ispName}</TableCell>
                                        <TableCell align="right">Rs. {invoice.amount}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewInvoice(invoice)}
                                                sx={{ color: colors.primary }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handlePrintInvoice(invoice)}
                                                sx={{ color: colors.primary }}
                                            >
                                                <PrintIcon />
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
            )}
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
        </Box>
    );
}

export default CustomerDetails;
