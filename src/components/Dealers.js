import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, Button, Grid, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Search, Link, Public } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import colors from '../colors';
import { useDispatch, useSelector } from 'react-redux';
import { registerDealer, fetchDealers } from '../store/actions/dealerActions';

function Dealers() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const dealerId = useSelector((state) => state.auth.user.uid)
    const dealers = useSelector((state) => state.dealers.dealers); // Get dealers from Redux state

    useEffect(() => {
        const localDealers = localStorage.getItem('dealers');
        if (localDealers) {
            dispatch({
                type: 'FETCH_DEALERS_SUCCESS',
                payload: JSON.parse(localDealers),
            });
        } else {
            dispatch(fetchDealers()); // Fetch dealers when component mounts
        }
    }, [dispatch]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateDealer = () => {
        const dealerData = {
            name,
            email,
            password,
            phone,
            address,
            role: 'dealer'
        };
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setPassword('');
        dispatch(registerDealer(email, password, dealerData, dealerId)); // Dispatch action to add dealer
        handleClose();
    };

    return (
        <Box sx={{ pl: 4, pt: 5, }}>
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    style={{ marginLeft: '10px', backgroundColor: colors.primary }}
                >
                    Create Dealer
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ display: 'flex', mb: 5, justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.primary, color: 'white' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>Create Dealer</Typography>
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
                    />
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
                <DialogActions style={{ justifyContent: "center" }}>
                    <Button style={{ width: 200, marginBottom: 20, backgroundColor: colors.primary }} onClick={handleCreateDealer} variant="contained">
                        Create Dealer
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid item xs={12} md={12} sx={{
                '@media (max-width: 600px)': {
                    '& .MuiTableCell-root': {
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                    }
                }
            }} >
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dealers.map((dealer, index) => (
                                <TableRow key={index}>
                                    <TableCell>{dealer.name}</TableCell>
                                    <TableCell>{dealer.username}</TableCell>
                                    <TableCell>{dealer.phone}</TableCell>
                                    <TableCell>{dealer.address}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Box>
    );
}

export default Dealers;
