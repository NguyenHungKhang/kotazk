import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, InputAdornment, Link, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
<<<<<<< HEAD
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
=======
// import FacebookIcon from '@mui/icons-material/Facebook';
// import TwitterIcon from '@mui/icons-material/Twitter';
>>>>>>> origin/develop
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
=======
import * as apiService from '../../api/index'
>>>>>>> origin/develop

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
<<<<<<< HEAD

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        navigate('/work-space');
=======

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();  // Prevents page reload
        const data = {
            email,
            password
        };
        await apiService.authAPI.login(data)
            .then(response => navigate('/workspace/'))
            .catch(error => console.warn("error"));
>>>>>>> origin/develop
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                height: '100vh',
<<<<<<< HEAD
                background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(135deg, #3a3a3a, #1e1e1e)' 
=======
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #3a3a3a, #1e1e1e)'
>>>>>>> origin/develop
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
            }}
        >
            <Card sx={{
                width: 400,
                borderRadius: 8,
                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
                p: 4,
                backgroundColor: theme.palette.background.paper, // Use paper color from theme
            }}>
                <CardContent>
                    <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
                        Login
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
                                name="email"
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
                                sx={{
                                    '& .MuiInput-underline:before': {
                                        borderBottom: `1px solid ${theme.palette.text.primary}`, // Update based on text color
                                    },
                                    '& .MuiInput-underline:hover:before': {
                                        borderBottom: `2px solid ${theme.palette.text.primary}`,
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottom: `2px solid ${theme.palette.text.primary}`,
                                    },
                                }}
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
                                name="password"
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
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                                sx={{
                                    '& .MuiInput-underline:before': {
<<<<<<< HEAD
                                        borderBottom: `1px solid ${theme.palette.text.primary}`, // Update based on text color
=======
                                        borderBottom: `1px solid ${theme.palette.text.primary}`,
>>>>>>> origin/develop
                                    },
                                    '& .MuiInput-underline:hover:before': {
                                        borderBottom: `2px solid ${theme.palette.text.primary}`,
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottom: `2px solid ${theme.palette.text.primary}`,
                                    },
                                }}
                            />
                        </Box>

<<<<<<< HEAD
                        {/* Forgot Password Link */}
=======
>>>>>>> origin/develop
                        <Box display="flex" justifyContent="flex-end" mt={2} mb={3}>
                            <Link
                                component="button"
                                variant="body2"
                                color={theme.palette.primary.main}
                                onClick={() => navigate('/ForgotPassword')} // Navigate to the forgot password page
                            >
                                Forgot password?
                            </Link>
                        </Box>

<<<<<<< HEAD
                        {/* Login Button */}
=======
>>>>>>> origin/develop
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
                            LOGIN
                        </Button>

                        {/* Social Media Buttons */}
                        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
                            Or Sign Up Using
                        </Typography>
                        <Box display="flex" justifyContent="center" mt={2}>
<<<<<<< HEAD
                            <IconButton sx={{ mx: 1, backgroundColor: '#3b5998', color: 'white', borderRadius: '50%', width: 48, height: 48 }}>
=======
                            {/* <IconButton sx={{ mx: 1, backgroundColor: '#3b5998', color: 'white', borderRadius: '50%', width: 48, height: 48 }}>
>>>>>>> origin/develop
                                <FacebookIcon />
                            </IconButton>
                            <IconButton sx={{ mx: 1, backgroundColor: '#1DA1F2', color: 'white', borderRadius: '50%', width: 48, height: 48 }}>
                                <TwitterIcon />
<<<<<<< HEAD
                            </IconButton>
=======
                            </IconButton> */}
>>>>>>> origin/develop
                            <IconButton sx={{ mx: 1, backgroundColor: '#DB4437', color: 'white', borderRadius: '50%', width: 48, height: 48 }}>
                                <GoogleIcon />
                            </IconButton>
                        </Box>

                        {/* Sign Up Link */}
                        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
<<<<<<< HEAD
                            Or Sign Up Using <Link href="#" variant="body2" color={theme.palette.primary.main}>SIGN UP</Link>
=======
                            Or Sign Up Using{' '}
                            <Link
                                component="button"
                                variant="body2"
                                color={theme.palette.primary.main}
                                onClick={() => navigate('/register')}
                            >
                                SIGN UP
                            </Link>
>>>>>>> origin/develop
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;