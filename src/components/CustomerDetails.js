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
    Pagination
} from '@mui/material';

import {
    Phone,
    Person,
    Badge,
    Wallet,
    CalendarToday,
    Print as PrintIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate, useParams } from 'react-router-dom';
import colors from '../colors';
import { fetchInvoicesByCustomerUid } from '../store/actions/invoiceActions';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { PrintableInvoice } from './Invoice';

// Create a styled Tab component
const StyledTab = styled(Tab)(({ theme }) => ({
    '&.Mui-selected': {
        background: 'linear-gradient(90deg, #00A36C 0%, #2AAA8A 100%)',
        color: 'white', // Active tab label color
    },
}));

function CustomerDetails() {
    const [tabValue, setTabValue] = useState(0);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const navigate = useNavigate()
    const { id } = useParams();
    const dispatch = useDispatch();
    const { invoices, loading, customer } = useSelector((state) => state.invoices);
    const printRef = useRef();

    useEffect(() => {
        if (customer?.uid) {
            console.log('Fetching invoices for customer:', customer.uid);
            dispatch(fetchInvoicesByCustomerUid(customer.uid));
        }
    }, [dispatch, customer?.uid]);

    useEffect(() => {
        dispatch(fetchInvoicesByCustomerUid(id));
    }, [dispatch, id]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Invoice-${selectedInvoice?.invoiceNo || ''}`,
        removeAfterPrint: true,
    });

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        navigate(`/invoice/${invoice.id}`);
    };

    const handlePrintInvoice = (invoice) => {
        window.open(`/invoice/${invoice.id}?print=true`, '_blank');
    };

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
                <StyledTab label="Invoices" />
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

export default CustomerDetails;
