import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, InputAdornment, Link, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        navigate('/work-space');
    };

    return (
        <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            sx={{
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <Card sx={{
                width: 480,
                p: 5,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: theme.palette.mode === 'dark' ? '0px 0px 20px rgba(255, 255, 255, 0.2)' : '0px 0px 20px rgba(0, 0, 0, 0.2)',
            }}>
                <CardContent>
                    <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        />
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                            <Link href="#" variant="body2" color="primary">
                                Forgot password?
                            </Link>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                background: 'linear-gradient(to right, #36D1DC, #5B86E5)',
                                color: 'white',
                            }}
                        >
                            Login
                        </Button>
                        <Typography variant="body2" align="center" gutterBottom>
                            Or Sign Up Using
                        </Typography>
                        <Box display="flex" justifyContent="center" mt={2} mb={2}>
                            <Button
                                variant="outlined"
                                sx={{
                                    mx: 1,
                                    color: 'white',
                                    backgroundColor: '#3b5998',
                                    borderColor: '#3b5998',
                                    minWidth: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    padding: 0,
                                    '&:hover': {
                                        backgroundColor: '#3b5998',
                                        borderColor: '#3b5998',
                                    },
                                }}
                            >
                                <FacebookIcon sx={{ fontSize: 24, color: 'white' }} />
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    mx: 1,
                                    color: 'white',
                                    backgroundColor: '#1DA1F2',
                                    borderColor: '#1DA1F2',
                                    minWidth: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    padding: 0,
                                    '&:hover': {
                                        backgroundColor: '#1DA1F2',
                                        borderColor: '#1DA1F2',
                                    },
                                }}
                            >
                                <TwitterIcon sx={{ fontSize: 24, color: 'white' }} />
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    mx: 1,
                                    color: 'white',
                                    backgroundColor: '#DB4437',
                                    borderColor: '#DB4437',
                                    minWidth: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    padding: 0,
                                    '&:hover': {
                                        backgroundColor: '#DB4437',
                                        borderColor: '#DB4437',
                                    },
                                }}
                            >
                                <GoogleIcon sx={{ fontSize: 24, color: 'white' }} />
                            </Button>
                        </Box>

                        <Typography variant="body2" align="center">
                            Or Sign Up Using
                            <br />
                            <Link href="#" variant="body2" color="primary" sx={{ ml: 1 }}>
                                SIGN UP
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
