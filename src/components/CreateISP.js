import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../colors';
import { addStaff } from '../store/actions/staffActions'; // Import your action for adding staff


export const TextFieldStyle = {
    backgroundColor: 'white',
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            // borderColor: 'white',
        },
        '&:hover fieldset': {
            // borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'lightgray',
            borderWidth: 1,
        },
    },
}
function CreateISP() {
    const [ispName, setIspName] = useState('');
    const [supportNumber, setSupportNumber] = useState('');
    const [salesNumber, setSalesNumber] = useState('');
    const [supportEmail, setSupportEmail] = useState('');
    const [salesEmail, setSalesEmail] = useState('');
    const dealerId = useSelector((state) => state.auth.user.uid)
    const dispatch = useDispatch();

    const handleSubmit = () => {
        const staffData = {
            ispName,
            salesNumber,
            salesEmail,
            supportNumber,
            supportEmail,
        };

        // dispatch(addStaff(supportEmail, password, staffData, dealerId)); // Dispatch action to add staff
        // localStorage.setItem('staffData', JSON.stringify(staffData)); // Optionally save to local storage
    };

    return (
        <Box mt={80} sx={{ backgroundColor: '#f4f6fd', padding: 4, borderRadius: 2, maxWidth: "auto", margin: 'auto' }}>
            <Grid container spacing={2}>
                <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography sx={{ color: colors.primary }}>ISP Name</Typography>
                    <TextField
                        sx={TextFieldStyle}
                        placeholder="John"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={ispName}
                        onChange={(e) => setIspName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography sx={{ color: colors.primary }}>Support Email</Typography>
                    <TextField
                        sx={TextFieldStyle}
                        placeholder="Support Email"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography sx={{ color: colors.primary }}>Sales Email</Typography>
                    <TextField
                        sx={TextFieldStyle}
                        placeholder="Sales Email"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={salesEmail}
                        onChange={(e) => setSalesEmail(e.target.value)}
                    />
                </Grid>

                <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography sx={{ color: colors.primary }}>Support Number</Typography>
                    <TextField
                        sx={TextFieldStyle}
                        placeholder="03001234567"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={supportNumber}
                        onChange={(e) => setSupportNumber(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography sx={{ color: colors.primary }}>Sales Number</Typography>
                    <TextField
                        sx={TextFieldStyle}
                        placeholder="03001234567"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={supportNumber}
                        onChange={(e) => setSupportNumber(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Box display="flex" alignItems="center" justifyContent={"center"} mt={5} mb={2}>
                <Button
                    variant="contained"
                    //   color="primary"
                    onClick={handleSubmit}
                    style={{ marginLeft: '10px', backgroundColor: colors.primary }}
                >
                    Create ISP
                </Button>
            </Box>
        </Box>
    );
}

export default CreateISP; 