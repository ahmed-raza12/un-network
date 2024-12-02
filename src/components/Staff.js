import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Tooltip,
    DialogContentText,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, fetchStaffByDealerId, updateStaff, deleteStaff } from '../store/actions/staffActions';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const StaffList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const staff = useSelector((state) => state.staff.staff);
    const dealeruId = useSelector((state) => state.dealers.uid);
    const allDealers = useSelector((state) => state.dealers.dealers);
    const role = useSelector((state) => state.auth.user.role);

    // State for edit dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        designation: '',
        cash: ''
    });

    // State for delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState(null);

    // State for selected dealer
    const [selectedDealer, setSelectedDealer] = useState(() => {
        const savedDealer = localStorage.getItem('selectedDealerStaff');
        return savedDealer || dealeruId;
    });

    // State for loading
    const [isLoading, setIsLoading] = useState(false);

    // Effect to persist selected dealer
    useEffect(() => {
        if (selectedDealer) {
            localStorage.setItem('selectedDealerStaff', selectedDealer);
        }
    }, [selectedDealer]);

    // Effect to fetch staff data
    useEffect(() => {
        const fetchStaffData = async () => {
            setIsLoading(true);
            try {
                if (role === 'admin') {
                    await dispatch(fetchStaffByDealerId(selectedDealer));
                } else {
                    await dispatch(fetchStaff());
                }
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
            setIsLoading(false);
        };

        fetchStaffData();
    }, [dispatch, role, selectedDealer]);

    const handleEditClick = (e, staffMember) => {
        e.stopPropagation();
        setSelectedStaff(staffMember);
        setEditFormData({
            firstName: staffMember.firstName,
            lastName: staffMember.lastName,
            email: staffMember.email,
            phone: staffMember.phone,
            address: staffMember.address,
            designation: staffMember.designation,
            cash: staffMember.cash || ''
        });
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (e, staffMember) => {
        e.stopPropagation();
        setStaffToDelete(staffMember);
        setDeleteDialogOpen(true);
    };

    const handleEditSubmit = () => {
        const updatedStaffData = {
            ...selectedStaff,
            ...editFormData
        };
        dispatch(updateStaff(selectedStaff.id, updatedStaffData));
        setEditDialogOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (staffToDelete) {
            dispatch(deleteStaff(staffToDelete.id, staffToDelete.uid));
            setDeleteDialogOpen(false);
        }
    };

    const handleStaffClick = (staffMember) => {
        navigate(`/staff-profile/${staffMember.id}`, { state: {...staffMember, dealerId: selectedDealer } });
    };

    const handleDealerChange = (event) => {
        setSelectedDealer(event.target.value);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                {role === 'admin' && (
                    <FormControl sx={{ minWidth: 200, mb: 2 }}>
                        <InputLabel>Select Dealer</InputLabel>
                        <Select
                            value={selectedDealer || ''}
                            onChange={handleDealerChange}
                            label="Select Dealer"
                            disabled={isLoading}
                        >
                            {allDealers?.map((dealer) => (
                                <MenuItem key={dealer.uid} value={dealer.uid}>
                                    {dealer.dealerName || dealer.email}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    onClick={() => navigate('/create-staff')}

                                    sx={{
                                        background: colors.gradientBackground,
                                        '&:hover': { background: colors.gradientBackground }
                                    }}
                                >
                                    {isLoading ? <CircularProgress size={24} /> : 'Create Staff'}
                                </Button>
                            </Box>
                        </Grid>
                        {staff.map((staffMember) => (
                            <Grid item xs={12} sm={6} md={4} key={staffMember.id}>
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
                                            transform: 'scale(1.02)',
                                            transition: 'transform 0.2s ease-in-out'
                                        }
                                    }}
                                    onClick={() => handleStaffClick(staffMember)}
                                >   <Avatar
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        mb: 2,
                                        bgcolor: colors.primary,
                                        fontSize: '2.5rem'
                                    }}
                                >
                                        {staffMember.firstName ? staffMember.firstName.charAt(0).toUpperCase() : 'I'}

                                    </Avatar>
                                    <Typography variant="h5" sx={{ mb: 1 }}>
                                        {staffMember.firstName} {staffMember.lastName}
                                    </Typography>
                                    <Typography variant="body1" color="primary" sx={{ mb: 1 }}>
                                        {staffMember.phone}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {staffMember.designation}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Box>
    );
};

export default StaffList;