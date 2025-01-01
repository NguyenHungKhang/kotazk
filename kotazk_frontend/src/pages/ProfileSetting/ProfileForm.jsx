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
import { userNameRegex } from '../../utils/regexUtil';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../redux/actions/user.action';
import { setSnackbar } from '../../redux/actions/snackbar.action';
import dayjs from 'dayjs';

const ProfileForm = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const SaveIcon = TablerIcons["IconDeviceFloppy"];
    const [changeAvatar, setChangeImage] = useState(false);
    const [isUploadAvatar, setIsUploadAvatar] = useState(false);
    const dispatch = useDispatch();

    // Separate states for profile fields
    const [firstNameError, setFirstNameError] = useState(true);
    const [lastNameError, setLastNameError] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [changedNameAt, setChangedNameAt] = useState(null);
    const nameChangeable = changedNameAt == null ? true : dayjs().diff(dayjs(changedNameAt), 'day') > 69;

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
            setChangedNameAt(currentUser.changedNameAt || null)
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

    const handleSaveProfile = async () => {
        const updatedProfile = {
            firstName,
            lastName,
        };
        try {
            const response = await apiService.userAPI.update(updatedProfile);
            if (response?.data) {
                dispatch(setSnackbar({
                    open: true,
                    content: 'Update User Succesful!',
                    type: 'success'
                }))
                dispatch(setCurrentUser(response?.data))
            }
        } catch (e) {
            console.log(123)
        }
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
                        label={"First Name"}
                        placeholder='Enter first name'
                        fullWidth
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        setFormError={setFirstNameError}
                        maxLength={50}
                        required
                        validationRegex={userNameRegex}
                        disabled={!nameChangeable}
                    />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                    <CustomTextFieldWithValidation
                        id="lastname"
                        name="Last Name"
                        label={"Last Name"}
                        placeholder='Enter last name'
                        fullWidth
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        setFormError={setLastNameError}
                        maxLength={50}
                        required
                        validationRegex={userNameRegex}
                        disabled={!nameChangeable}
                    />

                </Grid>
                {!nameChangeable && (
                    <Grid item xs={12}>
                        <Typography color='textSecondary'>
                            {`Can not change name before 60 days of last change. Last change: ${dayjs(changedNameAt).format("HH:mm MM/DD/YYYY")}`}
                        </Typography>
                    </Grid>
                )}

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
                onClick={() => handleSaveProfile()}
                disabled={firstNameError || lastNameError || !nameChangeable}
            >
                Save Profile
            </Button>
        </div>
    );
};

export default ProfileForm;
