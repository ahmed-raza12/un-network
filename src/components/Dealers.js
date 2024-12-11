import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, Button, Grid, TableCell, TableContainer, TableHead, TableRow, Avatar, Paper, TextField, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Search, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import colors from '../colors';
import { useDispatch, useSelector } from 'react-redux';
import { registerDealer, fetchDealers, updateDealer, deleteDealer } from '../store/actions/dealerActions';
import generateTestDealers from '../utils/generateTestDealers';

function Dealers() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedDealer, setSelectedDealer] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const dealerId = useSelector((state) => state.auth.user.uid)
    const dealers = useSelector((state) => state.dealers.dealers);

    useEffect(() => {
        const localDealers = localStorage.getItem('dealers');
        console.log(localDealers, 'localDealers');
        if (localDealers) {
            console.log(JSON.parse(localDealers), 'localDealers');
            dispatch({
                type: 'FETCH_DEALERS_SUCCESS',
                payload: JSON.parse(localDealers),
            });
        } else {
            console.log('Fetching dealers from Firebase');
            dispatch(fetchDealers());
        }
    }, [dispatch]);

    const handleClickOpen = (dealer = null) => {
        if (dealer) {
            setEditMode(true);
            setSelectedDealer(dealer);
            setName(dealer.name);
            setEmail(dealer.email);
            setPhone(dealer.phone);
            setAddress(dealer.address);
        } else {
            setEditMode(false);
            setSelectedDealer(null);
            resetForm();
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setAddress('');
        setEditMode(false);
        setSelectedDealer(null);
    };

    const handleSubmit = () => {
        const dealerData = {
            name,
            email,
            phone,
            address,
            role: 'dealer'
        };

        if (editMode && selectedDealer) {
            dispatch(updateDealer(selectedDealer.id, { ...selectedDealer, ...dealerData }));
        } else {
            dispatch(registerDealer(email, password, dealerData, dealerId));
        }
        handleClose();
    };

    const handleDeleteClick = (dealer) => {
        setSelectedDealer(dealer);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedDealer) {
            dispatch(deleteDealer(selectedDealer.id));
            setDeleteConfirmOpen(false);
            setSelectedDealer(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setSelectedDealer(null);
    };

    const handleDealerClick = (dealer) => {
        navigate(`/dealers/${dealer.id}`, { state: { dealer } });
    };
    return (
        <Box sx={{ pl: 4, pt: 5, minHeight: '100vh' }}>
            <Box display="flex" alignItems="center" mb={2}>
                <TextField
                    placeholder="Name / Username / Phone Number"
                    variant="outlined"
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <IconButton>
                                <Search />
                            </IconButton>
                        )
                    }}
                />
                {/* <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        generateTestDealers()
                            .then(() => {
                                dispatch(fetchDealers());
                            })
                            .catch(error => console.error('Error generating test data:', error));
                    }}
                    style={{ marginLeft: '10px', backgroundColor: colors.secondary }}
                >
                    Generate Test Data
                </Button> */}
            </Box>
            <Grid container spacing={3} mt={2}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/create-dealer')}
                            sx={{
                                background: colors.gradientBackground,
                                '&:hover': { background: colors.gradientBackground }
                            }}
                        >
                            Create Dealer
                        </Button>
                    </Box>
                </Grid>
                {dealers.map((dealer) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={dealer.id}>
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
                                position: 'relative',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s ease-in-out'
                                }
                            }}
                            onClick={() => handleDealerClick(dealer)}
                        >
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mb: 2,
                                    bgcolor: colors.primary,
                                    fontSize: '2.5rem'
                                }}
                            >
                                {dealer.name ? dealer.name.charAt(0).toUpperCase() : 'D'}
                            </Avatar>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                {dealer.name}
                            </Typography>
                            <Typography variant="body1" color="primary" sx={{ mb: 1 }}>
                                {dealer.companyName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {dealer.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {dealer.phone}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ display: 'flex', mb: 5, justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.primary, color: 'white' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>{editMode ? 'Update Dealer' : 'Create Dealer'}</Typography>
                    <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={editMode}
                    />
                    {!editMode && (
                        <>
                            <Typography sx={{ color: colors.primary }}>Password</Typography>
                            <TextField
                                type="password"
                                placeholder="Password"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </>
                    )}
                    <TextField
                        margin="dense"
                        label="Phone Number"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Address"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: colors.primary }}>
                        {editMode ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete dealer "{selectedDealer?.name}"? This action cannot be undone.
                    </Typography>
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

export default Dealers;