import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import * as apiService from '../../api/index';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Assuming the token is passed as a query parameter
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    // try {
    //   const response = await apiService.authAPI.resetPassword({ token, password });
    //   setMessage(response.message || 'Password reset successful. You can now log in.');
    //   setTimeout(() => navigate('/login'), 2000);
    // } catch (error) {
    //   setMessage('An error occurred. Please try again.');
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
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body2" textAlign="center" color="textSecondary" gutterBottom>
            Enter your new password below.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Box fullWidth margin="normal" sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                New Password
              </Typography>
              <TextField
                fullWidth
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
              />
            </Box>
            <Box fullWidth margin="normal" sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
              />
            </Box>
            {message && (
              <Typography
                variant="body2"
                textAlign="center"
                color={message.includes('error') ? 'error' : 'primary'}
                sx={{ mt: 2 }}
              >
                {message}
              </Typography>
            )}
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
                mb: 2,
              }}
            >
              RESET PASSWORD
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;
