import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, InputAdornment, Link, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
// import * as apiService from '../../api/index';

const Register = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const theme = useTheme();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = async (event) => {
        // event.preventDefault();

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            setPasswordError(true);
            return;
        }

        // setPasswordError(false); // Clear any previous error

        // const data = { email, firstName, lastName, password };
        // try {
        //     await apiService.authAPI.register(data);
        //     navigate('/workspace/');
        // } catch (error) {
        //     console.warn("Registration failed", error);
        // }
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
            <Card sx={{
                width: 400,
                borderRadius: 8,
                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
                p: 4,
                backgroundColor: theme.palette.background.paper,
            }}>
                <CardContent>
                    <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
                        Register
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        {/* Email Input */}
                        <Box fullWidth margin="normal" sx={{ mt: 4 }}>
                            <Typography variant="body1" gutterBottom>
                                Email
                            </Typography>
                            <TextField
                                fullWidth
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Type your email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircleIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                            />
                        </Box>

                        {/* First Name Input */}
                        <Box fullWidth margin="normal" sx={{ mt: 4 }}>
                            <Typography variant="body1" gutterBottom>
                                First Name
                            </Typography>
                            <TextField
                                fullWidth
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Type your first name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                            />
                        </Box>

                        {/* Last Name Input */}
                        <Box fullWidth margin="normal" sx={{ mt: 4 }}>
                            <Typography variant="body1" gutterBottom>
                                Last Name
                            </Typography>
                            <TextField
                                fullWidth
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Type your last name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                            />
                        </Box>

                        {/* Password Input */}
                        <Box fullWidth margin="normal" sx={{ mt: 4 }}>
                            <Typography variant="body1" gutterBottom>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Type your password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                            />
                        </Box>

                        {/* Confirm Password Input */}
                        <Box fullWidth margin="normal" sx={{ mt: 4 }}>
                            <Typography variant="body1" gutterBottom>
                                Confirm Password
                            </Typography>
                            <TextField
                                fullWidth
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowConfirmPassword}>
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                            />
                            {passwordError && (
                                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                    Password and Confirm Password do not match
                                </Typography>
                            )}
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(to right, #36D1DC, #5B86E5)',
                                color: 'white',
                                borderRadius: 50,
                                height: 48,
                                mt: 3,
                                mb: 3,
                            }}
                        >
                            REGISTER
                        </Button>

                        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
                            Already have an account?{' '}
                            <Link
                                component="button"
                                variant="body2"
                                color={theme.palette.primary.main}
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Register;