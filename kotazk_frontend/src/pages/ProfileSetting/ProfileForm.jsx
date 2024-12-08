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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { getAvatar } from '../../utils/avatarUtil';
import * as apiService from '../../api/index';
import * as TablerIcons from '@tabler/icons-react';
import { LoadingButton } from '@mui/lab';
import CustomTextFieldWithValidation from '../../components/CustomTextFieldWithValidation';

const ProfileForm = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const SaveIcon = TablerIcons["IconDeviceFloppy"];
    const [changeAvatar, setChangeImage] = useState(false);
    const [isUploadAvatar, setIsUploadAvatar] = useState(false);

    // Separate states for profile fields
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');

    const [previewImage, setPreviewImage] = useState(null); // For image preview
    const [loading, setLoading] = useState(false); // For loading state on button

    useEffect(() => {
        if (currentUser) {
            setFirstName(currentUser.firstName || '');
            setLastName(currentUser.lastName || '');
            setBio(currentUser.bio || '');
            setEmail(currentUser.email || '');
            setAvatar(currentUser.avatar || '');
            setPreviewImage(currentUser.avatar || null);
        }
    }, [currentUser]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true); // Start loading animation
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result); // Show preview
                setAvatar(file); // Store the file for upload
                setLoading(false); // Stop loading animation
                setChangeImage(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveAvatar = async () => {
        try {
            setIsUploadAvatar(true);
            const response = await apiService.userAPI.uploadAvatar(avatar);
            if (response?.data) {
                setPreviewImage(response.data.avatar);
                setAvatar(response.data.avatar);
                setChangeImage(false);
            }
            setIsUploadAvatar(false);
            alert('Avatar updated successfully!');
        } catch (error) {
            setIsUploadAvatar(false);
            alert('There was an error uploading your avatar.');
        }
    };

    const handleSaveProfile = () => {
        const updatedProfile = {
            firstName,
            lastName,
            bio,
            email, // Email is read-only
            avatar,
        };
        console.log('Profile Saved:', updatedProfile);
        // Implement save logic here (e.g., API call to update the profile)
    };

    return (
        <div>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Profile Settings
            </Typography>
            <Divider sx={{ mb: 4 }} />

            {/* Profile Photo */}
            <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 4 }}>
                <Avatar
                    sx={{
                        width: 100,
                        height: 100,
                        border: '2px solid',
                    }}
                    src={previewImage || getAvatar(currentUser?.id, avatar)}
                    alt="Profile Photo"
                />
                <Stack spacing={1}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            component="label"
                            variant="outlined"
                            color="primary"
                            disabled={isUploadAvatar} // Disable button while loading
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

                        {changeAvatar && (
                            <LoadingButton color="success" onClick={saveAvatar} loading={isUploadAvatar}>
                                <SaveIcon />
                            </LoadingButton>
                        )}
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                        A profile photo helps others recognize you across the platform.
                    </Typography>
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                {/* First Name */}
                <Grid item xs={12} sm={6}>
                    <CustomTextFieldWithValidation
                        id="firstname"
                        name="First Name"
                        label={"First Name*"}
                        placeholder='Enter first name'
                        fullWidth
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        setFormError={setFirstNameError}
                        maxLength={50}
                        required
                        validationRegex={/^[A-Za-z0-9À-ÿ ]*$/}
                    //  regexErrorText="Only letters, numbers, and spaces are allowed."
                    //  defaultHelperText="Enter the project name. Only letters, numbers, and spaces are allowed."
                    />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                    <CustomTextFieldWithValidation
                        id="lastname"
                        name="Last Name"
                        label={"Last Name*"}
                        placeholder='Enter last name'
                        fullWidth
                        value={firstName}
                        onChange={(e) => setLastName(e.target.value)}
                        setFormError={setLastNameError}
                        maxLength={50}
                        required
                        validationRegex={/^[A-Za-z0-9À-ÿ ]*$/}
                    />
                </Grid>

                {/* Bio */}
                <Grid item xs={12}>
                <CustomTextFieldWithValidation
                        id="bio"
                        name="Bio"
                        label={"Bio"}
                        placeholder='Enter bio'
                        fullWidth
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={500}
                        multiline
                        rows={4}
                    />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                    <TextField
                        label="Email"
                        fullWidth
                        size="medium"
                        value={email}
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
