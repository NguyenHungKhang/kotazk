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
import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import CustomColorPicker from '../CustomColorPicker';
import CustomIconPicker from '../CustomIconPicker';
import * as TablerIcons from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as apiService from '../../api/index'

export default function CustomSaveProjectDialog() {
    const theme = useTheme();
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const [visibility, setVisibility] = React.useState('PUBLIC');
    const AddIcon = TablerIcons['IconSquarePlus'];
    const ProjectIcon = TablerIcons['IconTableFilled'];
    const [open, setOpen] = React.useState(false);
    const [selectedIcon, setSelectedIcon] = React.useState('IconHome');  // Default icon
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");

    useEffect(() => {
        if (workspace != null)
            console.log(workspace.id);
    }, [, workspace])

    const handleVisibilityChange = (event) => {
        setVisibility(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveProject = async () => {
        const data = {
            "name": name,
            "description": description,
            "visibility": visibility,
            "workspaceId": workspace.id
        }
        console.log(data);
        await apiService.projectAPI.create(data)
            .then(res => console.log(res))
            .catch(err => console.error(err));
    }

    const SelectedIconComponent = TablerIcons[selectedIcon];

    return (
        <React.Fragment>
            <Button
                variant="contained"
                color='success'
                size="small"
                onClick={handleClickOpen}
                startIcon={<AddIcon size={20} />}
            >
                Create Project
            </Button>
            <Dialog
                fullWidth
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event) => {
                        event.preventDefault();
                        await saveProject();
                        handleClose();
                    },
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
                <DialogContent>
                    <Box>
                        <InputLabel
                            htmlFor="name"
                            sx={{
                                mb: 1,
                                fontWeight: 650,
                                color: theme.palette.text.primary
                            }}
                        >
                            Project Name
                        </InputLabel>
                        <Grid container spacing={2} alignItems='center'>
                            <Grid item xs={3}>
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
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    required
                                    margin='dense'
                                    size="small"
                                    id="name"
                                    name="name"
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => setName(e.target.value)}
                                    sx={{
                                        m: 0
                                    }}
                                />
                            </Grid>

                        </Grid>

                    </Box>

                    <Box mt={2}>
                        <InputLabel
                            htmlFor="name"
                            sx={{
                                mb: 1,
                                fontWeight: 650,
                                color: theme.palette.text.primary
                            }}
                        >
                            Description
                        </InputLabel>
                        <TextField
                            required
                            size="small"
                            id="description"
                            name="description"
                            fullWidth
                            variant="outlined"
                            multiline
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </Box>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button variant="contained" color="primary" type="submit">
                        Save Project
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
