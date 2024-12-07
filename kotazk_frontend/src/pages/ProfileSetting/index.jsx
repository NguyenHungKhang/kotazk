import React, { useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import ProfileForm from './ProfileForm';
import ChangePasswordDialog from './ChangePasswordDialog';

export default function ProfileSettings() {
    const theme = useTheme();
    const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);

    const handleOpenPasswordDialog = () => {
        setPasswordDialogOpen(true);
    };

    const handleClosePasswordDialog = () => {
        setPasswordDialogOpen(false);
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #3a3a3a, #1e1e1e)'
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
            }}
        >
            <Box
                sx={{
                    p: 4,
                    maxWidth: 700,
                    width: '90%',
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[5],
                }}
            >
                <ProfileForm />

                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleOpenPasswordDialog}
                >
                    Change Password
                </Button>

                <ChangePasswordDialog
                    isOpen={isPasswordDialogOpen}
                    onClose={handleClosePasswordDialog}
                />
            </Box>
        </Box>
    );
}
