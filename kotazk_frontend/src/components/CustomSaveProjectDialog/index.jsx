import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import { Box, Divider, Grid2, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import CustomColorPicker from '../CustomColorPicker';
import CustomIconPicker from '../CustomProjectColorIconPicker';
import * as TablerIcons from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as apiService from '../../api/index'
import { useDispatch } from 'react-redux';
import { setCurrentProjectList } from '../../redux/actions/project.action';
import CustomTextFieldWithValidation from '../CustomTextFieldWithValidation';

export default function CustomSaveProjectDialog() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const [visibility, setVisibility] = React.useState('PUBLIC');
    const AddIcon = TablerIcons['IconPlus'];
    const ProjectIcon = TablerIcons['IconTableFilled'];
    const [open, setOpen] = React.useState(false);
    const [selectedIcon, setSelectedIcon] = React.useState('IconHome');  // Default icon
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [nameError, setNameError] = React.useState(true);
    const [descriptionError, setDescriptionError] = React.useState(false);
    const BackIcon = TablerIcons["IconArrowNarrowLeft"];

    const handleVisibilityChange = (event) => {
        setVisibility(event.target.value);
    };

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const saveProject = async () => {
        if (nameError || descriptionError) {
            return;
        }
        const data = {
            "name": name,
            "description": description,
            "visibility": visibility,
            "workspaceId": workspace.id
        }

        await apiService.projectAPI.create(data)
            .then(async (workspaceRes) => {
                const data = {
                    'filters': [

                    ]
                };
                await apiService.projectAPI.getPageByWorkspace(workspace.id, data)
                    .then(projectListRes => { console.log(projectListRes); dispatch(setCurrentProjectList(projectListRes.data)); })
                    .catch(projectListErr => console.log(projectListErr))
            })
            .catch(workspaceErr => alert(workspaceErr));
    }

    const SelectedIconComponent = TablerIcons[selectedIcon];

    return (
        <React.Fragment>
            <Button
                variant="contained"
                color='success'
                size="small"
                onClick={handleClickOpen}
                startIcon={<AddIcon size={18} />}
                sx={{
                    // borderRadius: 20,
                    textTransform: 'none',
                    textWrap: 'nowrap',
                    background: 'linear-gradient(45deg, #FF3259 30%, #FF705A 90%)',
                    color: '#FFFFFF',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF705A 30%, #FF3259 90%)',
                    },
                  }}
            >
                Create Project
            </Button>
            <Dialog
                fullWidth
                open={open}
                onClose={handleClose}
                maxWidth="lg"
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event) => {
                        event.preventDefault();
                        await saveProject();
                        handleClose();
                    },
                    sx: { borderRadius: 4 },
                }}
            >
                <Grid2 container p={2}
                    sx={{
                        borderRadius: 4,
                        background: theme.palette.mode === 'light'
                            ? 'linear-gradient(135deg, #432690, #52006B)'
                            : 'linear-gradient(135deg, #52006B, #432690)',
                    }}
                >
                    <Grid2 size={6}>
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
                                        <Stack direction='row' spacing={2} alignItems='center'>
                                            <Box>
                                                <ProjectIcon size={48} color={theme.palette.primary.main} />
                                            </Box>
                                            <Box>
                                                <Typography variant='h6' fontWeight={650}>Create Project</Typography>
                                                <Typography variant='body1' color={theme.palette.text.secondary}>Please fill in the details below to add a new project.</Typography>
                                            </Box>
                                        </Stack>
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
                                <Grid2 container spacing={2}>
                                    <Grid2 size={3}>
                                        <InputLabel
                                            htmlFor="name" sx={{
                                                my: 2,
                                                '& .MuiInputLabel-asterisk': {
                                                    color: 'red',
                                                },
                                            }} required>Project Name</InputLabel>
                                    </Grid2>
                                    <Grid2 size={9}>
                                        <CustomTextFieldWithValidation
                                            id="name"
                                            name="name"
                                            size="small"
                                            placeholder='Enter project name'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            setFormError={setNameError}
                                            maxLength={50}
                                            required
                                            validationRegex={/^[A-Za-z0-9À-ÿ ]*$/}
                                            regexErrorText="Only letters, numbers, and spaces are allowed."
                                            defaultHelperText="Enter the project name. Only letters, numbers, and spaces are allowed."
                                        />
                                    </Grid2>
                                </Grid2>

                                <Grid2 container spacing={2} mt={2}>
                                    <Grid2 size={3}>
                                        <InputLabel
                                            htmlFor="name" sx={{
                                                my: 2,
                                                '& .MuiInputLabel-asterisk': {
                                                    color: 'red',
                                                },
                                            }} required>Visibility</InputLabel>
                                    </Grid2>
                                    <Grid2 size={9}>
                                        <Select
                                            labelId="visibility-label"
                                            id="visibility"
                                            name="visibility"
                                            size='small'
                                            value={visibility}
                                            fullWidth
                                            onChange={handleVisibilityChange}
                                        >
                                            <MenuItem value="PUBLIC">Public</MenuItem>
                                            <MenuItem value="PRIVATE">Private</MenuItem>
                                        </Select>
                                    </Grid2>
                                </Grid2>

                                <Grid2 container spacing={2} mt={2}>
                                    <Grid2 size={3}>
                                        <InputLabel htmlFor="description">Description</InputLabel>
                                    </Grid2>
                                    <Grid2 size={9}>
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
                                    </Grid2>
                                </Grid2>

                            </DialogContent>
                            <Divider />
                            <DialogActions>
                                <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
                                    <Button variant="text" color="secondary" onClick={() => handleClose()} startIcon={<BackIcon />}>
                                        Back
                                    </Button>
                                    <Button variant="contained" color="primary" type="submit" disabled={nameError || descriptionError}>
                                        Save Project
                                    </Button>
                                </Stack>
                            </DialogActions>
                        </Paper>
                    </Grid2>
                    <Grid2 size={6}>
                        <Box sx={{ borderRadius: 4 }}>
                            <Box
                                component="img"
                                src="https://i.pinimg.com/originals/a3/84/3e/a3843e404a271edb47b1908dd2a6230b.gif"
                                height="100%"
                                borderRadius="0 16px 16px 0"
                            />
                        </Box>
                    </Grid2>
                </Grid2>

            </Dialog>
        </React.Fragment>
    );
}
