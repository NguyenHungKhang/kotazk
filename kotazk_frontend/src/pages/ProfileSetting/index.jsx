import React, { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Divider,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

export default function ProfileSettings() {
    const theme = useTheme(); // Access the MUI theme
    const [profile, setProfile] = useState({
        photo: null,
        fullName: 'Lập Nguyễn',
        pronouns: '',
        jobTitle: '',
        department: '',
        email: 'nguyenlap6671@gmail.com',
        role: '',
    });

    const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false); // Control password dialog
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        // logoutOtherDevices: false,
    });

    const handleInputChange = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswords((prev) => ({ ...prev, [field]: value }));
    };

    const handleOpenPasswordDialog = () => {
        setPasswordDialogOpen(true);
    };

    const handleClosePasswordDialog = () => {
        setPasswordDialogOpen(false);
        setPasswords({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            // logoutOtherDevices: false,
        });
    };

    const handleSaveProfile = () => {
        console.log('Profile saved:', profile);
        alert('Profile updated successfully!');
    };

    const handleChangePassword = () => {
        const { currentPassword, newPassword, confirmPassword } = passwords;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        if (newPassword.length < 6) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Mật khẩu mới và mật khẩu xác nhận không trùng khớp.');
            return;
        }

        console.log('Password change request:', passwords);
        alert('Mật khẩu đã được đổi thành công!');
        handleClosePasswordDialog();
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
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                        mb: 2,
                        color: theme.palette.text.primary,
                    }}
                >
                    Profile Settings
                </Typography>
                <Divider sx={{ mb: 4 }} />

                {/* Profile Photo */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={3}
                    sx={{ mb: 4 }}
                >
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            border: `2px solid ${theme.palette.primary.main}`,
                        }}
                        src={profile.photo || '/default-avatar.png'}
                        alt="Profile Photo"
                    />
                    <Stack spacing={1}>
                        <Button component="label" variant="outlined" color="primary">
                            Upload Photo
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) =>
                                    setProfile((prev) => ({
                                        ...prev,
                                        photo: URL.createObjectURL(e.target.files[0]),
                                    }))
                                }
                            />
                        </Button>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ maxWidth: 300 }}
                        >
                            A profile photo helps others recognize you across the platform.
                        </Typography>
                    </Stack>
                </Stack>

                <Grid container spacing={3}>
                    {/* Full Name */}
                    <Grid item xs={12}>
                        <TextField
                            label="Full Name *"
                            fullWidth
                            size="medium"
                            value={profile.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                    </Grid>

                    {/* Pronouns */}
                    <Grid item xs={12}>
                        <TextField
                            label="Pronouns"
                            placeholder="e.g., she/her/hers"
                            fullWidth
                            size="medium"
                            value={profile.pronouns}
                            onChange={(e) => handleInputChange('pronouns', e.target.value)}
                        />
                    </Grid>

                    {/* Job Title */}
                    <Grid item xs={12}>
                        <TextField
                            label="Job Title"
                            fullWidth
                            size="medium"
                            value={profile.jobTitle}
                            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        />
                    </Grid>

                    {/* Department */}
                    <Grid item xs={12}>
                        <TextField
                            label="Department / Team"
                            fullWidth
                            size="medium"
                            value={profile.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            fullWidth
                            size="medium"
                            value={profile.email}
                            InputProps={{ readOnly: true }}
                            disabled
                        />
                    </Grid>

                    {/* Role */}
                    <Grid item xs={12}>
                        <TextField
                            label="Role"
                            select
                            fullWidth
                            size="medium"
                            value={profile.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Choose a role</em>
                            </MenuItem>
                            <MenuItem value="Team member">Team Member</MenuItem>
                            <MenuItem value="Manager">Manager</MenuItem>
                            <MenuItem value="Viewer">Viewer</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveProfile}
                    >
                        Save Profile
                    </Button>
                    {/* Change Password Section */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleOpenPasswordDialog}
                    >
                        Đổi mật khẩu
                    </Button>
                </Box>

                {/* Dialog for Changing Password */}
                <Dialog
                    open={isPasswordDialogOpen}
                    onClose={handleClosePasswordDialog}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Đổi mật khẩu</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ mb: 2 }} variant="body2">
                            Mật khẩu của bạn phải có tối thiểu 6 ký tự, đồng thời bao gồm cả chữ số, chữ cái và ký tự đặc biệt (!@$%).
                        </Typography>
                        <TextField
                            label="Mật khẩu hiện tại"
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
                            label="Mật khẩu mới"
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
                            label="Nhập lại mật khẩu mới"
                            type="password"
                            fullWidth
                            size="medium"
                            sx={{ mb: 2 }}
                            value={passwords.confirmPassword}
                            onChange={(e) =>
                                handlePasswordChange('confirmPassword', e.target.value)
                            }
                        />
                        {/* <FormControlLabel
                            control={
                                <Checkbox
                                    checked={passwords.logoutOtherDevices}
                                    onChange={(e) =>
                                        handlePasswordChange(
                                            'logoutOtherDevices',
                                            e.target.checked
                                        )
                                    }
                                />
                            }
                            label="Đăng xuất khỏi các thiết bị khác"
                        /> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePasswordDialog}>Hủy</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleChangePassword}
                        >
                            Đổi mật khẩu
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}
