import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, InputAdornment, Link, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password === confirmPassword) {
            console.log('Username:', username);
            console.log('Email:', email);
            console.log('Password:', password);
            navigate('/login');
        } else {
            console.error('Passwords do not match');
        }
    };

    const login = () => {
        navigate('/login');
    }

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

                        {/* Username Input */}
                        <Box fullWidth margin="normal" sx={{ mt: 4 }}>
                            <Typography variant="body1" gutterBottom>
                                Username
                            </Typography>
                            <TextField
                                fullWidth
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Type your username"
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
                                            <EmailIcon />
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

                        {/* Confirm Password Input */}
                        <Box fullWidth margin="normal" sx={{ mt: 4 }}>
                            <Typography variant="body1" gutterBottom>
                                Confirm Password
                            </Typography>
                            <TextField
                                fullWidth
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
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

                        {/* Register Button */}
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
                            Already have an account? <Link component="button" onClick={login} variant="body2" color={theme.palette.primary.main}>Login</Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Register;
