import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Box,
  Divider,
  IconButton,
  Paper,
  Typography,
  InputLabel,
  useTheme,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as TablerIcons from '@tabler/icons-react';
import CustomTextFieldWithValidation from '../CustomTextFieldWithValidation';
import * as apiService from '../../api/index'

export default function CustomAddWorkspaceDialog() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState(true);
  const [descriptionError, setDescriptionError] = useState(false);
  const WorkspaceIcon = TablerIcons['IconBriefcaseFilled'];
  const BackIcon = TablerIcons["IconArrowNarrowLeft"];
  const AddIcon = TablerIcons["IconPlus"];
  const [errors, setErrors] = useState({ name: false, description: false });


  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (nameError || descriptionError) {
        console.log('Form submission prevented due to validation errors');
        return;
      }
      const data = {
        name,
        description
      }
      const response = await apiService.workspaceAPI.create(data);

      handleClose();
      console.log('Form submitted', { name, description });
    } catch (e) {
      alert(e);
    }
  };

  return (
    <React.Fragment>
      <Button
        size="small"
        variant="contained"
        sx={{
          borderRadius: 20,
          textTransform: 'none',
          textWrap: 'nowrap',
          background: 'linear-gradient(45deg, #FF3259 30%, #FF705A 90%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(45deg, #FF705A 30%, #FF3259 90%)',
          },
        }}
        startIcon={<AddIcon size={18}/>}
        onClick={handleClickOpen}
      >
        Create Workspace
      </Button>

      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
          sx: { borderRadius: 4 },
        }}
      >
        <Grid container p={2}
          sx={{
            borderRadius: 4,
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #BBE829, #DCE897)'
              : 'linear-gradient(135deg, #DCE897, #BBE829)',
          }}
        >
          <Grid item xs={6}>
            <Paper
              sx={{
                borderRadius: '16px 0 0 16px',
                height: '100%',
                borderRight: '1px solid',
                borderColor: 'ActiveBorder',
                boxShadow: 0
              }}
            >
              <DialogTitle>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item container alignItems="center" xs={10}>
                    <Box
                      sx={{
                        background: 'linear-gradient(45deg, #BBE829, #DCE897)',
                        borderRadius: 2,
                        padding: '4px',
                      }}
                    >
                      <WorkspaceIcon size={24} style={{ color: 'white' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={650} ml={4}>Add Workspace</Typography>
                  </Grid>
                  <Grid item xs={2} container justifyContent="flex-end">
                    <IconButton onClick={handleClose}>
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </DialogTitle>
              <Divider />
              <DialogContent>
                <DialogContentText mb={4}>
                  Please fill in the details below to add a new workspace.
                </DialogContentText>

                {/* Workspace Name Field */}
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <InputLabel
                      htmlFor="name" sx={{
                        my: 2,
                        '& .MuiInputLabel-asterisk': {
                          color: 'red',
                        },
                      }} required>Workspace Name</InputLabel>
                  </Grid>
                  <Grid item xs={9}>
                    <CustomTextFieldWithValidation
                      id="name"
                      name="name"
                      size="small"
                      placeholder='Enter workspace name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      setFormError={setNameError}
                      maxLength={50}
                      required
                      validationRegex={/^[A-Za-z0-9À-ÿ ]*$/}
                      regexErrorText="Only letters, numbers, and spaces are allowed."
                      defaultHelperText="Enter the workspace name. Only letters, numbers, and spaces are allowed."
                    />
                  </Grid>
                </Grid>

                {/* Description Field (Optional) */}
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={3}>
                    <InputLabel htmlFor="description">Description</InputLabel>
                  </Grid>
                  <Grid item xs={9}>
                    <CustomTextFieldWithValidation
                      id="description"
                      name="description"
                      size="small"
                      placeholder='Enter workspace description'
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      maxLength={200}
                      multiline
                      required={false}
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <Divider />
              <DialogActions>
                <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
                  <Button variant="text" color="secondary" onClick={() => handleClose()} startIcon={<BackIcon />}>
                    Back
                  </Button>
                  <Button variant="contained" color="primary" type="submit" disabled={nameError || descriptionError}>
                    Add Workspace
                  </Button>
                </Stack>
              </DialogActions>

            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ borderRadius: 4 }}>
              <Box
                component="img"
                src="https://cdn.dribbble.com/users/2520294/screenshots/7269423/alaminxyz.gif"
                height="100%"
                borderRadius="0 16px 16px 0"
              />
            </Box>
          </Grid>
        </Grid>
      </Dialog>
    </React.Fragment>
  );
}
