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
import CustomIconPicker from '../CustomProjectColorIconPicker';
import * as TablerIcons from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as apiService from '../../api/index'
import { useDispatch } from 'react-redux';
import { setCurrentProjectList } from '../../redux/actions/project.action';
import CustomBreadcrumb from '../CustomBreadcumbs';
import CustomLongTextEditor from '../CustomLongTextEditor';
import CustomFileUploader from '../CustomFileUploader';
import CustomStatusColorIconPicker from '../CustomStatusColorIconPicker';
import { TextFields } from '@mui/icons-material';
import StartAndEndDatePicker from './StartAndEndDatePicker';
import CustomStartAndEndDatePicker from './StartAndEndDatePicker';
import LabelComponent from './LabelComponent';
import AssigneesComponent from './AssigneesComponent';
import PriorityComponent from './PriorityComponent';

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

    const StatusIcon = TablerIcons["IconPlaystationCircle"];
    const DateIcon = TablerIcons["IconCalendarDue"];
    const TimeEstimateIcon = TablerIcons["IconHourglass"];
    const LabelsIcon = TablerIcons["IconTagsFilled"];
    const AssigneeIcon = TablerIcons["IconUser"];
    const CollaboratorsIcon = TablerIcons["IconUsers"];
    const PriorityIcon = TablerIcons["IconFlag"]
    const LinkedTasksIcon = TablerIcons["IconHierarchy"];
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
                maxWidth='xl'
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
                                    <Grid container spacing={0.5} alignItems='center'>
                                        <Grid item xs={4} display='flex' alignItems='center'>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <StatusIcon size={16} stroke={2} />
                                                <Typography pt={0.5}>
                                                    Status
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Stack direction='row' spacing={2}>
                                                <TextField
                                                    size='small'
                                                    defaultValue={1}
                                                    select
                                                    margin="none"
                                                    fullWidth
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            py: 0,  // Removes padding inside the root container
                                                            '& .MuiSelect-select': {
                                                                py: 1,
                                                                px: 2,  // Removes padding between value and border
                                                                minHeight: 'auto',  // Resets the default min height
                                                                lineHeight: 'normal',  // Adjusts line height to prevent extra space
                                                                "& ul": {
                                                                    p: 0
                                                                }
                                                            },

                                                            '& fieldset': {
                                                                borderColor: 'transparent !important',
                                                            },
                                                            '&:hover fieldset': {
                                                                bgcolor: theme.palette.action.hover
                                                            },
                                                            '&:focus fieldset': {
                                                                bgcolor: theme.palette.action.focus
                                                            },
                                                            '& .MuiSelect-icon': {
                                                                display: 'none',  // Hides the arrow icon
                                                            },
                                                        },
                                                    }}
                                                    InputProps={{
                                                        size: 'small',
                                                        style: {
                                                            outline: 'none !important'
                                                        }
                                                    }}
                                                    SelectProps={{
                                                        style: {
                                                            p: 0
                                                        }
                                                    }}

                                                >
                                                    <MenuItem
                                                        value={1}
                                                        sx={{
                                                            fontSize: '12px',  // Smaller font size for menu items
                                                            padding: '4px 8px',  // Smaller padding to make items more compact
                                                            minHeight: 'unset',  // Remove default min-height to shrink items
                                                        }}
                                                    >
                                                        <CustomStatusColorIconPicker name={"To do"} />
                                                    </MenuItem>
                                                    <MenuItem
                                                        value={2}
                                                        sx={{
                                                            fontSize: '12px',  // Smaller font size for menu items
                                                            padding: '4px 8px',  // Smaller padding to make items more compact
                                                            minHeight: 'unset',  // Remove default min-height to shrink items
                                                        }}
                                                    >
                                                        <CustomStatusColorIconPicker name={"In Process"} />
                                                    </MenuItem>
                                                </TextField>
                                                <IconButton>

                                                </IconButton>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <DateIcon size={16} stroke={2} />
                                                <Typography pt={0.5}>
                                                    Date
                                                </Typography>
                                            </Stack>

                                        </Grid>
                                        <Grid item xs={8}>
                                            <StartAndEndDatePicker />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <TimeEstimateIcon size={16} stroke={2} />
                                                <Typography pt={0.5}>
                                                    Time Estimate
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                required
                                                inputProps={{ type: 'number' }}
                                                size="small"
                                                id="time_estimate"
                                                name="time_estimate"
                                                fullWidth
                                                placeholder='Empty'
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        py: 0,  // Removes padding inside the root container
                                                        '& .MuiSelect-select': {
                                                            py: 1,
                                                            px: 1,  // Removes padding between value and border
                                                            minHeight: 'auto',  // Resets the default min height
                                                            lineHeight: 'normal',  // Adjusts line height to prevent extra space
                                                        },
                                                        '& fieldset': {
                                                            borderColor: 'transparent !important',
                                                        },
                                                        '&:hover fieldset': {
                                                            bgcolor: theme.palette.action.hover
                                                        },
                                                        '&:focus fieldset': {
                                                            bgcolor: theme.palette.action.focus
                                                        },
                                                        '& .MuiSelect-icon': {
                                                            display: 'none',  // Hides the arrow icon
                                                        },
                                                    },
                                                }}

                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={6}>
                                    <Grid container spacing={2} alignItems='center'>
                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <AssigneeIcon size={16} stroke={2} />
                                                <Typography variant='body2' pt={0.5}>
                                                    Assignee
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <AssigneesComponent />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <CollaboratorsIcon size={16} stroke={2} />
                                                <Typography variant='body2' pt={0.5}>
                                                    Collaborators
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <AssigneesComponent />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <PriorityIcon size={16} stroke={2} />
                                                <Typography variant='body2' pt={0.5}>
                                                    Priority
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <PriorityComponent />
                                        </Grid>
                                        {/* <Grid item xs={4}>
                                        <Stack direction='row' spacing={2} alignItems='center'>
                                                <LinkedTasksIcon size={16} stroke={2} />
                                                <Typography variant='body2' pt={0.5}>
                                                    Linked Tasks
                                                </Typography>
                                            </Stack>
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
                                        </Grid> */}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={2}>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <LabelsIcon size={16} stroke={2} />
                                        <Typography pt={0.5}>
                                            Labels
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    <LabelComponent />
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
        </React.Fragment >
    );
}

export default CustomTaskDialog;