import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import * as apiService from '../../api/index';

const OtpVerification = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const email = params.get('email');

    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();

    const handleChange = (e, index) => {
        const value = e.target.value;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input automatically if a number is entered
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        try {
            if (otp.length < 4)
                alert("OTP need 4 digits");

            const data = {
                "email": email,
                "otp": otp.join('')
            }

            const response = await apiService.authAPI.active(data);
            if (response?.data)
                alert(response?.data?.message)
        } catch (e) {
            alert(e?.response?.data?.message)
        }
    };

    const handleResend = async (event) => {
        const data =
        {
            "email": email,
        };
        try {
            const response = await apiService.authAPI.resend(data);
            if (response?.data) {
                alert(response?.data?.message)
            }
        } catch (e) {
            alert(e?.response?.data?.message)
        }
    };


    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                height: '100vh',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #3a3a3a, #1e1e1e)'
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
            }}
        >
            <Card
                sx={{
                    width: 400,
                    borderRadius: 8,
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
                    p: 4,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <CardContent>
                    <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
                        OTP Verification
                    </Typography>
                    <Typography variant="body2" textAlign="center" color="textSecondary">
                        Active account: {email}
                    </Typography>
                    <Box sx={{ mt: 2, mb: 4 }}>
                        <Grid container spacing={2} justifyContent="center">
                            {otp.map((value, index) => (
                                <Grid item key={index}>
                                    <TextField
                                        id={`otp-${index}`}
                                        value={value}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleBackspace(e, index)}
                                        inputProps={{
                                            maxLength: 1,
                                            style: { textAlign: 'center', fontSize: '1.5rem' },
                                        }}
                                        sx={{
                                            width: 50,
                                            height: 56,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            },
                                        }}
                                        variant="outlined"
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        {error && (
                            <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
                                Invalid OTP. Please try again.
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="body2" textAlign="center" color="textSecondary">
                        Enter the 4-digit OTP sent to your email.
                    </Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(to right, #36D1DC, #5B86E5)',
                            color: 'white',
                            borderRadius: 50,
                            height: 48,
                            mt: 4,
                        }}
                        onClick={() => handleSubmit()}
                    >
                        VERIFY
                    </Button>
                    <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{ mt: 4, cursor: 'pointer' }}
                        onClick={() => handleResend()}
                    >
                        Resend OTP
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default OtpVerification;
