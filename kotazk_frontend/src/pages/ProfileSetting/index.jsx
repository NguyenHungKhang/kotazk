import React, { useState } from 'react';
import { Avatar, Box, Button, Divider, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';

export default function ProfileSettings() {
    const [profile, setProfile] = useState({
        photo: null,
        fullName: 'Lập Nguyễn',
        pronouns: '',
        jobTitle: '',
        department: '',
        email: 'nguyenlap6671@gmail.com',
        role: '',
    });

    const handleInputChange = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfile((prev) => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        console.log('Profile saved:', profile);
        alert('Profile updated successfully!');
    };

    return (
        <Box sx={{ p: 4, maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Profile Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Profile Photo */}
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar
                    sx={{ width: 80, height: 80 }}
                    src={profile.photo || '/default-avatar.png'}
                    alt="Profile Photo"
                />
                <Stack spacing={1}>
                    <Button component="label" variant="outlined">
                        Upload your photo
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Typography variant="body2" color="textSecondary">
                        Photos help your teammates recognize you.
                    </Typography>
                </Stack>
            </Stack>

            <Grid container spacing={2}>
                {/* Full Name */}
                <Grid item xs={12}>
                    <TextField
                        label="Your full name *"
                        fullWidth
                        size="small"
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
                        size="small"
                        value={profile.pronouns}
                        onChange={(e) => handleInputChange('pronouns', e.target.value)}
                    />
                </Grid>

                {/* Job Title */}
                <Grid item xs={12}>
                    <TextField
                        label="Job title"
                        fullWidth
                        size="small"
                        value={profile.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    />
                </Grid>

                {/* Department */}
                <Grid item xs={12}>
                    <TextField
                        label="Department or team"
                        fullWidth
                        size="small"
                        value={profile.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                    <TextField
                        label="Email"
                        fullWidth
                        size="small"
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
                        size="small"
                        value={profile.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                    >
                        <MenuItem value="">
                            <em>Choose one</em>
                        </MenuItem>
                        <MenuItem>Team member</MenuItem>
                        <MenuItem>Manager</MenuItem>
                        <MenuItem>Viewer</MenuItem>
                    </TextField>
                </Grid>

                {/* Bio */}
                <Grid item xs={12}>
                    <TextField
                        label="Bio"
                        fullWidth
                        size="small"
                        value={profile.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                </Grid>

                {/* Bio */}
                <Grid item xs={12}>
                    <TextField
                        label="Bio"
                        fullWidth
                        size="small"
                        value={profile.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                </Grid>
            </Grid>


            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'right' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveProfile}
                >
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
}
