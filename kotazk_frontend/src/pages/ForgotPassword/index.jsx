import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  Link,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
// import * as apiService from '../../api/index';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    // event.preventDefault();
    // try {
    //   const response = await apiService.authAPI.forgotPassword({ email });
    //   setMessage(response.message || 'Password reset link sent to your email.');
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
            Forgot Password
          </Typography>
          <Typography variant="body2" textAlign="center" color="textSecondary" gutterBottom>
            Enter your registered email to receive a password reset link.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
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
                placeholder="Enter your email"
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
              SEND RESET LINK
            </Button>
            <Box display="flex" justifyContent="center" mt={2}>
              <Link
                component="button"
                variant="body2"
                color={theme.palette.primary.main}
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
