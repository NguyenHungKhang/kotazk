import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, InputAdornment, Link, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import * as apiService from '../../api/index'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();

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
                                        borderBottom: `1px solid ${theme.palette.text.primary}`,
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

                        <Box display="flex" justifyContent="flex-end" mt={2} mb={3}>
                            <Link href="#" variant="body2" color={theme.palette.primary.main}>
                                Forgot password?
                            </Link>
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
                            LOGIN
                        </Button>

                        {/* Social Media Buttons */}
                        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
                            Or Sign Up Using
                        </Typography>
                        <Box display="flex" justifyContent="center" mt={2}>
                            {/* <IconButton sx={{ mx: 1, backgroundColor: '#3b5998', color: 'white', borderRadius: '50%', width: 48, height: 48 }}>
                                <FacebookIcon />
                            </IconButton>
                            <IconButton sx={{ mx: 1, backgroundColor: '#1DA1F2', color: 'white', borderRadius: '50%', width: 48, height: 48 }}>
                                <TwitterIcon />
                            </IconButton> */}
                            <IconButton sx={{ mx: 1, backgroundColor: '#DB4437', color: 'white', borderRadius: '50%', width: 48, height: 48 }}>
                                <GoogleIcon />
                            </IconButton>
                        </Box>

                        {/* Sign Up Link */}
                        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
                            Or Sign Up Using <Link href="#" variant="body2" color={theme.palette.primary.main}>SIGN UP</Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;