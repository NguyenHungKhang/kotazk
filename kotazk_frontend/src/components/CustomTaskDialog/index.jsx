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
import { useDispatch } from 'react-redux';
import { setCurrentProjectList } from '../../redux/actions/project.action';
import CustomBreadcrumb from '../CustomBreadcumbs';
import CustomLongTextEditor from '../CustomLongTextEditor';
import CustomFileUploader from '../CustomFileUploader';

const CustomTaskDialog = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const [visibility, setVisibility] = React.useState('PUBLIC');
    const AddIcon = TablerIcons['IconSquarePlus'];
    const ProjectIcon = TablerIcons['IconTableFilled'];
    const [open, setOpen] = React.useState(false);
    const [selectedIcon, setSelectedIcon] = React.useState('IconHome');  // Default icon
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");

    // useEffect(() => {
    //     if (workspace != null)
    //         console.log(workspace.id);
    // }, [dispatch, workspace])

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
            .then(async (workspaceRes) => {
                const data = {
                    'filters': [

                    ]
                };
                await apiService.projectAPI.getPageByWorkspace(workspace.id, data)
                    .then(projectListRes => { console.log(projectListRes); dispatch(setCurrentProjectList(projectListRes.data)); })
                    .catch(projectListErr => console.log(projectListErr))
            })
            .catch(workspaceErr => console.error(workspaceErr));
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
                Create task
            </Button>
            <Dialog
                fullWidth
                maxWidth='lg'
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
                    {/* <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item container alignItems="center" xs={10}>
                            <CustomBreadcrumb />
                        </Grid>
                        <Grid item xs={2} container justifyContent="flex-end">
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid> */}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={7}>


                            <Box>
                                <TextField
                                    required
                                    size="small"
                                    id="name"
                                    name="name"
                                    fullWidth
                                    variant="standard"
                                    placeholder='Name of task...'
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: {
                                            fontSize: 18,
                                            fontWeight: 500
                                        }
                                    }}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Box>
                            <Grid container spacing={6} mt={2}>
                                <Grid item xs={6}>
                                    <Grid container spacing={2} alignItems='center'>
                                        <Grid item xs={4}>
                                            <Typography>
                                                Status
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Select
                                                size='small'
                                            >

                                            </Select>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography>
                                                Date
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                required
                                                size="small"
                                                id="date"
                                                name="date"
                                                fullWidth
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography>
                                                Time Estimate
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                required
                                                size="small"
                                                id="time_estimate"
                                                name="time_estimate"
                                                fullWidth
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography>
                                                Tags
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                required
                                                size="small"
                                                id="tags"
                                                name="tags"
                                                fullWidth
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={6}>
                                    <Grid container spacing={2} alignItems='center'>
                                        <Grid item xs={4}>
                                            <Typography>
                                                Assignees
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Select
                                                size='small'
                                            >

                                            </Select>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography>
                                                Priority
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                required
                                                size="small"
                                                id="date"
                                                name="date"
                                                fullWidth
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography>
                                                Linked task
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                required
                                                size="small"
                                                id="time_estimate"
                                                name="time_estimate"
                                                fullWidth
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Box mt={6}>
                                <Typography
                                    variant='h6'
                                    fontWeight={650}
                                    sx={{
                                        mb: 1
                                    }}
                                >
                                    Description
                                </Typography>
                                <Box
                                    mt={2}
                                    bgcolor={theme.palette.mode === "light" ? "#fff" : '#1F1F1F'}
                                    border="1px solid"
                                    borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                    minHeight={100}
                                    borderRadius={2}
                                >
                                    <CustomLongTextEditor />
                                </Box>
                            </Box>

                            <Box mt={6}>
                                <Typography variant='h6' fontWeight={650}>
                                    Custom Fields
                                </Typography>
                                <Grid container mt={2}>
                                    <Grid
                                        item
                                        borderRadius={"8px 0 0 0 "}
                                        xs={4}
                                        border="1px solid"
                                        borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                        p={2}
                                    >
                                        Field
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        borderRadius={"0 8px 0 0"}
                                        border="1px solid"
                                        borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                        borderLeft='none'
                                        p={2}
                                    >
                                        Value
                                    </Grid>

                                    <Grid
                                        item
                                        // borderRadius={"8px 0 0 0 "}
                                        xs={4}
                                        border="1px solid"
                                        borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                        borderTop='none'
                                        p={2}
                                    >
                                        Field 2
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        // borderRadius={"0 8px 0 0"}
                                        border="1px solid"
                                        borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                        borderTop='none'
                                        borderLeft='none'
                                        p={2}
                                    >
                                        Value 2
                                    </Grid>

                                    <Grid
                                        item
                                        borderRadius={"0 0 0 8px "}
                                        xs={4}
                                        border="1px solid"
                                        borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                        borderTop='none'
                                        p={2}
                                    >
                                        Field 3
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        borderRadius={"0 0 8px 0"}
                                        border="1px solid"
                                        borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                        borderLeft='none'
                                        borderTop='none'
                                        p={2}
                                    >
                                        Value 3
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box mt={6}>
                                <Typography variant='h6' fontWeight={650}>
                                    Subtasks
                                </Typography>
                                <Stack mt={2}>
                                    <Box
                                        flexGrow={1}
                                        borderRadius={"8px 8px 0 0"}
                                        border="1px solid"
                                        borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                        p={2}
                                    >
                                        Test 1
                                    </Box>
                                    <Box
                                        flexGrow={1}
                                        borderRadius={"0 0 8px 8px"}
                                        border="1px solid"
                                        borderTop="none"
                                        borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                        p={2}
                                    >
                                        Test 2
                                    </Box>
                                </Stack>
                            </Box>

                            <Box mt={6}>
                                <Typography variant='h6' fontWeight={650}>
                                    Attachments
                                </Typography>
                                <Box>
                                    <CustomFileUploader />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>


                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default CustomTaskDialog;