import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material';

const ChangePasswordDialog = ({ isOpen, onClose }) => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordChange = (field, value) => {
        setPasswords((prev) => ({ ...prev, [field]: value }));
    };

    const handleChangePassword = () => {
        const { currentPassword, newPassword, confirmPassword } = passwords;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (newPassword.length < 6) {
            alert('The new password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('The new password and confirmation do not match.');
            return;
        }

        console.log('Password change request:', passwords);
        alert('Password changed successfully!');
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setPasswords({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        onClose(); // Inform the parent component to close the dialog
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <Typography sx={{ mb: 2 }} variant="body2">
                    Your new password must be at least 6 characters long and include numbers, letters, and special characters (!@$%).
                </Typography>
                <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    size="medium"
                    sx={{ mb: 2 }}
                    value={passwords.currentPassword}
                    onChange={(e) =>
                        handlePasswordChange('currentPassword', e.target.value)
                    }
                />
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    size="medium"
                    sx={{ mb: 2 }}
                    value={passwords.newPassword}
                    onChange={(e) =>
                        handlePasswordChange('newPassword', e.target.value)
                    }
                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    size="medium"
                    sx={{ mb: 2 }}
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                        handlePasswordChange('confirmPassword', e.target.value)
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleChangePassword}
                >
                    Change Password
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePasswordDialog;
