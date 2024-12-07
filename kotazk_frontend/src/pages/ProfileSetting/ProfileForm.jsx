import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Button,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
    CircularProgress,
    IconButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { getAvatar } from '../../utils/avatarUtil';
import * as apiService from '../../api/index';
import * as TablerIcons from '@tabler/icons-react'

const ProfileForm = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const SaveIcon = TablerIcons["IconDeviceFloppy"];

    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        email: '',
        avatar: '',
    });

    const [previewImage, setPreviewImage] = useState(null); // For image preview
    const [loading, setLoading] = useState(false); // For loading state on button

    useEffect(() => {
        if (currentUser) {
            setProfile({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                bio: currentUser.bio || '',
                email: currentUser.email || '',
                avatar: currentUser.avatar || '',
            });
            setPreviewImage(currentUser.avatar || null); // Set initial preview image
        }
    }, [currentUser]);

    const handleInputChange = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true); // Start loading animation
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result); // Show preview
                handleInputChange('avatar', file); // Store the file for upload
                setLoading(false); // Stop loading animation
            };
            reader.readAsDataURL(file);
        }
    };

    const saveAvatar = async () => {
        const file = profile.avatar;
        try {
            const response = await apiService.userAPI.uploadAvatar(file);
            if (response?.data) {
                setPreviewImage(response.data.avatar);
                setProfile((prev) => ({ ...prev, avatar: response.data.avatar }));
            }

            alert('Avatar updated successfully!');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('There was an error uploading your avatar.');
        }
    };

    const handleSaveProfile = () => { }

    return (
        <div>
            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ mb: 2 }}
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
                        border: '2px solid',
                    }}
                    src={previewImage || getAvatar(currentUser?.id, profile.avatar)}
                    alt="Profile Photo"
                />
                <Stack spacing={1}>
                    <Stack direction='row' spacing={2}>
                        <Button
                            component="label"
                            variant="outlined"
                            color="primary"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? (
                                <CircularProgress size={24} color="primary" />
                            ) : (
                                'Upload Photo'
                            )}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                        <IconButton color='success' onClick={() => saveAvatar()}>
                            <SaveIcon />
                        </IconButton>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                        A profile photo helps others recognize you across the platform.
                    </Typography>
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                {/* First Name */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="First Name *"
                        fullWidth
                        size="medium"
                        value={profile.firstName}
                        onChange={(e) =>
                            handleInputChange('firstName', e.target.value)
                        }
                    />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Last Name *"
                        fullWidth
                        size="medium"
                        value={profile.lastName}
                        onChange={(e) =>
                            handleInputChange('lastName', e.target.value)
                        }
                    />
                </Grid>

                {/* Bio */}
                <Grid item xs={12}>
                    <TextField
                        label="Bio"
                        multiline
                        rows={4}
                        fullWidth
                        size="medium"
                        value={profile.bio}
                        onChange={(e) =>
                            handleInputChange('bio', e.target.value)
                        }
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
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSaveProfile}
            >
                Save Profile
            </Button>
        </div>
    );
};

export default ProfileForm;
