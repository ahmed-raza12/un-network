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
function CreatePkg() {
    const [pkgName, setPkgName] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const dealerId = useSelector((state) => state.auth.user.uid)
    const dispatch = useDispatch();

    const handleSubmit = () => {
        const staffData = {
            pkgName,
            salePrice,
        };

        // dispatch(addStaff(supportEmail, password, staffData, dealerId)); // Dispatch action to add staff
        // localStorage.setItem('staffData', JSON.stringify(staffData)); // Optionally save to local storage
    };

    return (
        <Box mt={80} sx={{ backgroundColor: '#f4f6fd', padding: 4, borderRadius: 2, maxWidth: "auto", margin: 'auto' }}>
            <Grid container spacing={2}>
                <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography sx={{ color: colors.primary }}>Package Name</Typography>
                    <TextField
                        sx={TextFieldStyle}
                        placeholder="DT-1MB"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={pkgName}
                        onChange={(e) => setPkgName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography sx={{ color: colors.primary }}>Sales Number</Typography>
                    <TextField
                        sx={TextFieldStyle}
                        placeholder="1200"
                        type='number'
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
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
                    Create Package
                </Button>
            </Box>
        </Box>
    );
}

export default CreatePkg; 