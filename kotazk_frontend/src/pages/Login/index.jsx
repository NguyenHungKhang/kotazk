import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, useTheme, Card, CardContent, CardMedia, Stack } from '@mui/material';

const Login = () => {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Xử lý logic đăng nhập ở đây
        console.log('Email:', email);
        console.log('Password:', password);
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
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage:
                        'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(13,13,94,1) 100%)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    filter: 'blur(100px)', // Độ mờ của hình nền
                    zIndex: -1,
                }}
            />
            <Card>
                <Stack direction='row' spacing={1}>
                    <CardMedia
                        component="img"
                        sx={{ width: 550 }}
                        image="https://i.pinimg.com/564x/46/42/e6/4642e667ea6e9cdc20527d0465d029f8.jpg"
                        alt="Live from space album cover"
                    />
                    <CardContent
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'

                        }}
                    >
                        <Box>
                            <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
                                Welcome to Kotazk (Demo)
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Stack>
            </Card>
        </Box>
    );
};

export default Login;
